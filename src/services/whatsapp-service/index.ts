import { Client, LocalAuth } from 'whatsapp-web.js';
import { EventEmitter } from 'events';

class WhatsAppService extends EventEmitter {
  private client: Client | null = null;
  private status: 'disconnected' | 'connecting' | 'connected' = 'disconnected';
  private sessionId: string;

  constructor(sessionId: string) {
    super();
    this.sessionId = sessionId;
  }

  async initialize() {
    try {
      this.status = 'connecting';
      this.emit('statusChange', this.status);

      this.client = new Client({
        authStrategy: new LocalAuth({ clientId: this.sessionId }),
        puppeteer: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        }
      });

      this.client.on('qr', (qr) => {
        this.emit('qr', qr);
      });

      this.client.on('ready', () => {
        this.status = 'connected';
        this.emit('statusChange', this.status);
        this.emit('ready');
      });

      this.client.on('message', (message) => {
        this.emit('message', {
          id: message.id.id,
          from: message.from,
          to: message.to,
          body: message.body,
          timestamp: message.timestamp,
          hasMedia: message.hasMedia,
          type: 'text',
        });
      });

      this.client.on('disconnected', () => {
        this.status = 'disconnected';
        this.emit('statusChange', this.status);
        this.emit('disconnected');
      });

      await this.client.initialize();
    } catch (error) {
      this.status = 'disconnected';
      this.emit('statusChange', this.status);
      this.emit('error', error);
    }
  }

  async sendMessage(to: string, content: string) {
    if (!this.client || this.status !== 'connected') {
      throw new Error('WhatsApp client not connected');
    }

    try {
      const result = await this.client.sendMessage(to, content);
      return {
        id: result.id.id,
        timestamp: Date.now(),
      };
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.destroy();
      this.client = null;
      this.status = 'disconnected';
      this.emit('statusChange', this.status);
    }
  }

  getStatus() {
    return this.status;
  }
}

export default WhatsAppService;