'use client';

import MainLayout from '../../components/layout/MainLayout';
import ConversationList from '../../components/conversations/ConversationList';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export default function Conversations() {
  return (
    <MainLayout>
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2" />
          Conversaciones
        </h1>
        
        <ConversationList />
      </div>
    </MainLayout>
  );
}