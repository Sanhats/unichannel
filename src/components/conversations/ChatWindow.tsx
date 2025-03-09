'use client';

import { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, PaperClipIcon, FaceSmileIcon } from '@heroicons/react/24/outline';
import { useSocket } from '../../lib/socket/socket-client';

interface Message {
  id: string;
  content: string;
  timestamp: number;
  direction: 'inbound' | 'outbound';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  type: 'text' | 'image' | 'video' | 'file';
  metadata?: any;
}

interface ChatWindowProps {
  conversationId: string;
  channelId: string;
  channelType: 'whatsapp' | 'facebook' | 'instagram';
  clientName: string;
  initialMessages?: Message[];
}

export default function ChatWindow({
  conversationId,
  channelId,
  channelType,
  clientName,
  initialMessages = [],
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(initialMessages.length === 0);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();

  useEffect(() => {
    if (initialMessages.length === 0) {
      fetchMessages();
    }

    // Conectar al socket y unirse a la conversación
    const token = 'dummy-token'; // En una implementación real, esto vendría de la autenticación
    socket.connect(token);
    socket.joinConversation(conversationId);

    // Escuchar nuevos mensajes
    const unsubscribe = socket.on('new-message', (message) => {
      if (message.conversationId === conversationId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      // Limpiar al desmontar
      unsubscribe();
      socket.leaveConversation(conversationId);
    };
  }, [conversationId, initialMessages, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      // En una implementación real, esto vendría de una API
      // Simulamos una carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de ejemplo
      const mockMessages: Message[] = [
        {
          id: '1',
          content: 'Hola, necesito información sobre mi pedido',
          timestamp: Date.now() - 3600000, // 1 hora atrás
          direction: 'inbound',
          status: 'read',
          type: 'text',
        },
        {
          id: '2',
          content: 'Claro, ¿podría proporcionarme el número de su pedido?',
          timestamp: Date.now() - 3500000, // 58 minutos atrás
          direction: 'outbound',
          status: 'read',
          type: 'text',
        },
        {
          id: '3',
          content: 'Mi número de pedido es #12345',
          timestamp: Date.now() - 3400000, // 56 minutos atrás
          direction: 'inbound',
          status: 'read',
          type: 'text',
        },
        {
          id: '4',
          content: 'Gracias, estoy verificando la información de su pedido',
          timestamp: Date.now() - 3300000, // 55 minutos atrás
          direction: 'outbound',
          status: 'read',
          type: 'text',
        },
        {
          id: '5',
          content: 'Su pedido está en proceso de envío y debería llegar mañana',
          timestamp: Date.now() - 3200000, // 53 minutos atrás
          direction: 'outbound',
          status: 'read',
          type: 'text',
        },
        {
          id: '6',
          content: 'Perfecto, muchas gracias por la información',
          timestamp: Date.now() - 3100000, // 51 minutos atrás
          direction: 'inbound',
          status: 'read',
          type: 'text',
        },
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      // Crear mensaje temporal
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        content: newMessage,
        timestamp: Date.now(),
        direction: 'outbound',
        status: 'sent',
        type: 'text',
      };

      // Añadir mensaje a la lista
      setMessages((prevMessages) => [...prevMessages, tempMessage]);
      
      // Limpiar campo de entrada
      setNewMessage('');

      // En una implementación real, esto enviaría el mensaje a través de la API
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelId,
          conversationId,
          content: newMessage,
          contentType: 'text',
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el mensaje');
      }

      // Simular respuesta del servidor
      const data = await response.json();
      
      // Actualizar mensaje con ID real
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === tempMessage.id
            ? {
                ...msg,
                id: data.messageId || msg.id,
                status: 'delivered',
              }
            : msg
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Marcar mensaje como fallido
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === `temp-${Date.now()}`
            ? {
                ...msg,
                status: 'failed',
              }
            : msg
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return (
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'delivered':
        return (
          <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'read':
        return (
          <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white shadow overflow-hidden sm:rounded-lg">
      {/* Encabezado del chat */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-lg font-medium text-white">
              {clientName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-gray-900">{clientName}</h3>
          <p className="text-sm text-gray-500 capitalize">{channelType}</p>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="ml-2 text-gray-500">Cargando mensajes...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="mt-2 text-gray-500">No hay mensajes en esta conversación</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.direction === 'outbound' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                    message.direction === 'outbound'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p>{message.content}</p>
                  <div
                    className={`text-xs mt-1 flex items-center ${
                      message.direction === 'outbound' ? 'text-blue-100 justify-end' : 'text-gray-500'
                    }`}
                  >
                    <span>{formatTime(message.timestamp)}</span>
                    {message.direction === 'outbound' && (
                      <span className="ml-1">{getMessageStatusIcon(message.status)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Área de entrada de mensajes */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <button
            type="button"
            className="p-2 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none"
          >
            <PaperClipIcon className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 border-0 focus:ring-0 focus:outline-none px-4 py-2"
          />
          <button
            type="button"
            className="p-2 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none"
          >
            <FaceSmileIcon className="h-5 w-5" />
          </button>
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className={`p-2 rounded-full ${
              !newMessage.trim() || isSending
                ? 'text-gray-400'
                : 'text-blue-500 hover:text-blue-600'
            } focus:outline-none`}
          >
            <PaperAirplaneIcon className="h-5 w-5 transform rotate-90" />
          </button>
        </form>
      </div>
    </div>
  );
}