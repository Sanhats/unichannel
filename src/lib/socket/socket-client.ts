import { io, Socket } from 'socket.io-client';
import { UnifiedMessage } from '../channels/message-adapter';

// Tipo para los eventos del socket
interface ServerToClientEvents {
  'new-message': (message: UnifiedMessage) => void;
  'channel-status-change': (data: { channelId: string; status: string }) => void;
  'conversation-assigned': (data: { conversationId: string; agentId: string }) => void;
  'conversation-status-change': (data: { conversationId: string; status: string }) => void;
  'typing': (data: { conversationId: string; agentId: string; isTyping: boolean }) => void;
  'messages-read': (data: { conversationId: string; messageIds: string[]; readBy: string }) => void;
}

interface ClientToServerEvents {
  'join-conversation': (conversationId: string) => void;
  'leave-conversation': (conversationId: string) => void;
  'typing': (data: { conversationId: string; isTyping: boolean }) => void;
  'read-messages': (data: { conversationId: string; messageIds: string[] }) => void;
}

// Clase para gestionar el cliente de WebSockets
class SocketClient {
  private static instance: SocketClient;
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private eventHandlers: Map<string, Set<Function>> = new Map();

  private constructor() {}

  public static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  public connect(token: string) {
    if (this.socket?.connected) return this.socket;

    this.socket = io({
      path: '/api/socket',
      addTrailingSlash: false,
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventHandlers();

    return this.socket;
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Conectado al servidor de WebSockets');
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`Desconectado del servidor de WebSockets: ${reason}`);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión:', error);
    });

    // Configurar manejadores para eventos del servidor
    this.socket.on('new-message', (message) => {
      this.triggerEvent('new-message', message);
    });

    this.socket.on('channel-status-change', (data) => {
      this.triggerEvent('channel-status-change', data);
    });

    this.socket.on('conversation-assigned', (data) => {
      this.triggerEvent('conversation-assigned', data);
    });

    this.socket.on('conversation-status-change', (data) => {
      this.triggerEvent('conversation-status-change', data);
    });

    this.socket.on('typing', (data) => {
      this.triggerEvent('typing', data);
    });

    this.socket.on('messages-read', (data) => {
      this.triggerEvent('messages-read', data);
    });
  }

  private triggerEvent(event: string, ...args: any[]) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(...args);
        } catch (error) {
          console.error(`Error en manejador de evento ${event}:`, error);
        }
      });
    }
  }

  public on(event: string, handler: Function): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    
    this.eventHandlers.get(event)!.add(handler);
    
    // Devolver función para eliminar el manejador
    return () => {
      const handlers = this.eventHandlers.get(event);
      if (handlers) {
        handlers.delete(handler);
      }
    };
  }

  public joinConversation(conversationId: string) {
    if (!this.socket?.connected) return;
    this.socket.emit('join-conversation', conversationId);
  }

  public leaveConversation(conversationId: string) {
    if (!this.socket?.connected) return;
    this.socket.emit('leave-conversation', conversationId);
  }

  public sendTypingStatus(conversationId: string, isTyping: boolean) {
    if (!this.socket?.connected) return;
    this.socket.emit('typing', { conversationId, isTyping });
  }

  public markMessagesAsRead(conversationId: string, messageIds: string[]) {
    if (!this.socket?.connected) return;
    this.socket.emit('read-messages', { conversationId, messageIds });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Hook para usar el cliente de WebSockets en componentes React
export function useSocket() {
  const socketClient = SocketClient.getInstance();
  
  return {
    connect: (token: string) => socketClient.connect(token),
    on: (event: string, handler: Function) => socketClient.on(event, handler),
    joinConversation: (conversationId: string) => socketClient.joinConversation(conversationId),
    leaveConversation: (conversationId: string) => socketClient.leaveConversation(conversationId),
    sendTypingStatus: (conversationId: string, isTyping: boolean) => 
      socketClient.sendTypingStatus(conversationId, isTyping),
    markMessagesAsRead: (conversationId: string, messageIds: string[]) => 
      socketClient.markMessagesAsRead(conversationId, messageIds),
    disconnect: () => socketClient.disconnect(),
  };
}

export default SocketClient;