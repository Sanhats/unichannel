import { EventEmitter } from 'events';
import ChannelFactory from '../../services/channel-factory';
import { ChannelConfig, defaultChannels } from '../../config/channels';
import { PrismaClient } from '@prisma/client';
import { SocketServer } from '../socket/socket-server';
import { adaptMessage, UnifiedMessage } from './message-adapter';

const prisma = new PrismaClient();

class ChannelManager extends EventEmitter {
  private static instance: ChannelManager;
  private factory: ChannelFactory;
  private socketServer: SocketServer;
  private initialized: boolean = false;

  private constructor() {
    super();
    this.factory = ChannelFactory.getInstance();
    this.socketServer = SocketServer.getInstance();
    
    // Configurar manejadores de eventos
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    // Reenviar eventos del factory
    this.factory.on('channelStatusChange', (data) => {
      this.emit('channelStatusChange', data);
      
      // Notificar a los clientes vía WebSockets
      this.socketServer.emitChannelStatusChange(data.channelId, data.status);
    });

    this.factory.on('channelMessage', async (data) => {
      try {
        // Adaptar el mensaje al formato unificado
        const unifiedMessage = adaptMessage(
          data.message,
          data.channelId,
          data.type
        );
        
        // Guardar el mensaje en la base de datos
        await this.saveMessage(unifiedMessage);
        
        // Emitir evento
        this.emit('channelMessage', unifiedMessage);
        
        // Notificar a los clientes vía WebSockets
        this.socketServer.emitNewMessage(unifiedMessage);
      } catch (error) {
        console.error('Error procesando mensaje:', error);
      }
    });

    this.factory.on('channelError', (data) => {
      this.emit('channelError', data);
      // No notificamos errores a los clientes directamente por seguridad
    });
  }

  private async saveMessage(message: UnifiedMessage) {
    try {
      // Buscar o crear la conversación
      let conversation = await prisma.conversation.findFirst({
        where: {
          channelId: message.channelId,
          client: {
            channelIds: {
              path: [`$.${message.channelType}`],
              equals: message.senderId,
            },
          },
        },
      });

      if (!conversation) {
        // Buscar o crear el cliente
        let client = await prisma.client.findFirst({
          where: {
            channelIds: {
              path: [`$.${message.channelType}`],
              equals: message.senderId,
            },
          },
        });

        if (!client) {
          client = await prisma.client.create({
            data: {
              name: message.senderName || `Cliente ${message.senderId}`,
              channelIds: {
                [message.channelType]: message.senderId,
              },
            },
          });
        }

        // Crear la conversación
        conversation = await prisma.conversation.create({
          data: {
            channelId: message.channelId,
            clientId: client.id,
            status: 'pending',
            lastMessageAt: new Date(),
          },
        });
      }

      // Guardar el mensaje
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          content: message.content,
          type: message.contentType,
          metadata: message.metadata ? JSON.stringify(message.metadata) : null,
          direction: message.direction,
          status: message.status,
          sentAt: new Date(message.timestamp),
        },
      });

      // Actualizar la fecha del último mensaje en la conversación
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date() },
      });
    } catch (error) {
      console.error('Error guardando mensaje en la base de datos:', error);
      throw error;
    }
  }

  // El resto del código permanece igual...
}

export default ChannelManager;