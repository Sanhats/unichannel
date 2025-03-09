'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import MainLayout from '../../../components/layout/MainLayout';
import ConversationList from '../../../components/conversations/ConversationList';
import ChatWindow from '../../../components/conversations/ChatWindow';

interface Conversation {
  id: string;
  clientName: string;
  channelId: string;
  channelType: 'whatsapp' | 'facebook' | 'instagram';
  status: 'pending' | 'active' | 'resolved';
}

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.id as string;
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConversation();
  }, [conversationId]);

  const fetchConversation = async () => {
    setIsLoading(true);
    try {
      // En una implementación real, esto vendría de una API
      // Simulamos una carga de datos
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos de ejemplo
      const mockConversation: Conversation = {
        id: conversationId,
        clientName: 'Juan Pérez',
        channelId: 'whatsapp-1',
        channelType: 'whatsapp',
        status: 'active',
      };
      
      setConversation(mockConversation);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          <div className="md:col-span-1 overflow-hidden">
            <ConversationList />
          </div>
          <div className="md:col-span-2 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-full bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                <p className="ml-2 text-gray-500">Cargando conversación...</p>
              </div>
            ) : conversation ? (
              <ChatWindow
                conversationId={conversation.id}
                channelId={conversation.channelId}
                channelType={conversation.channelType}
                clientName={conversation.clientName}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-white shadow overflow-hidden sm:rounded-lg">
                <p className="text-gray-500">Conversación no encontrada</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}