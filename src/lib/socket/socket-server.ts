import { Server as NetServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { UnifiedMessage } from '../channels/message-adapter';

// Tipo para los eventos del socket
interface ServerToClientEvents {
  'new-message': (message: UnifiedMessage) => void;
  'channel-status-change': (data: { channelId: string; status: string }) => void;
  'conversation-assigned': (data: { conversationId: string; agentId: string }) => void;
  'conversation-status-change': (data: { conversationId: string; status: string }) => void;
}

interface ClientToServerEvents {
  'join-conversation': (conversationId: string) => void;
  'leave-conversation': (conversationId: string) => void;
  'typing': (data: { conversationId: string; isTyping: boolean }) => void;
  'read-messages': (data: { conversationId: string; messageIds: string[] }) => void;
}

// Clase para gestionar el servidor de WebSockets
export class SocketServer {
  private static instance: SocketServer;
  private io: SocketIOServer | null = null;

  private constructor() {}

  public static getInstance(): SocketServer {
    if (!SocketServer.instance) {
      SocketServer.instance = new SocketServer();
    }
    return SocketServer.instance;
  }

  public initialize(server: NetServer) {
    if (this.io) return this.io;

    this.io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.setupSocketHandlers();

    return this.io;
  }

  private setupSocketHandlers() {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      console.log(`Cliente conectado: ${socket.id}`);

      // Autenticación
      this.handleAuthentication(socket);

      // Unirse a una conversación
      socket.on('join-conversation', (conversationId) => {
        socket.join(`conversation:${conversationId}`);
        console.log(`Cliente ${socket.id} se unió a la conversación ${conversationId}`);
      });

      // Abandonar una conversación
      socket.on('leave-conversation', (conversationId) => {
        socket.leave(`conversation:${conversationId}`);
        console.log(`Cliente ${socket.id} abandonó la conversación ${conversationId}`);
      });

      // Indicador de escritura
      socket.on('typing', (data) => {
        socket.to(`conversation:${data.conversationId}`).emit('typing', {
          conversationId: data.conversationId,
          agentId: socket.data.userId,
          isTyping: data.isTyping,
        });
      });

      // Marcar mensajes como leídos
      socket.on('read-messages', (data) => {
        // Aquí se actualizaría el estado de los mensajes en la base de datos
        // y se notificaría a otros clientes
        socket.to(`conversation:${data.conversationId}`).emit('messages-read', {
          conversationId: data.conversationId,
          messageIds: data.messageIds,
          readBy: socket.data.userId,
        });
      });

      // Desconexión
      socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
      });
    });
  }

  private async handleAuthentication(socket: Socket) {
    try {
      // En un entorno real, necesitarías verificar la autenticación
      // Esto es un ejemplo simplificado
      const token = socket.handshake.auth.token;
      if (token) {
        // Aquí verificarías el token y obtendrías el usuario
        socket.data.userId = 'user-id-from-token';
        socket.data.role = 'agent';
      } else {
        // Si no hay token, desconectar
        socket.disconnect();
      }
    } catch (error) {
      console.error('Error en autenticación de socket:', error);
      socket.disconnect();
    }
  }

  public emitNewMessage(message: UnifiedMessage) {
    if (!this.io) return;
    
    // Emitir a todos los clientes en la conversación
    this.io.to(`conversation:${message.conversationId}`).emit('new-message', message);
  }

  public emitChannelStatusChange(channelId: string, status: string) {
    if (!this.io) return;
    
    // Emitir a todos los clientes
    this.io.emit('channel-status-change', { channelId, status });
  }

  public emitConversationAssigned(conversationId: string, agentId: string) {
    if (!this.io) return;
    
    // Emitir a todos los clientes en la conversación
    this.io.to(`conversation:${conversationId}`).emit('conversation-assigned', {
      conversationId,
      agentId,
    });
  }

  public emitConversationStatusChange(conversationId: string, status: string) {
    if (!this.io) return;
    
    // Emitir a todos los clientes en la conversación
    this.io.to(`conversation:${conversationId}`).emit('conversation-status-change', {
      conversationId,
      status,
    });
  }
}

// Función para inicializar el servidor de WebSockets en API Routes
export default async function socketHandler(
  req: NextApiRequest,
  res: NextApiResponse & { socket: { server: NetServer } }
) {
  try {
    // Verificar autenticación
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    // Inicializar servidor de WebSockets
    const socketServer = SocketServer.getInstance();
    if (!res.socket.server.io) {
      console.log('Inicializando servidor de Socket.IO');
      res.socket.server.io = socketServer.initialize(res.socket.server);
    }

    res.end();
  } catch (error) {
    console.error('Error en socket handler:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}