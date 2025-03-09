'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import ConnectionStatus from '../../components/channels/ConnectionStatus';
import { ChartBarIcon, UsersIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface Channel {
  id: string;
  name: string;
  type: 'whatsapp' | 'facebook' | 'instagram';
  status: 'connected' | 'connecting' | 'disconnected';
}

interface Stats {
  totalConversations: number;
  activeConversations: number;
  pendingConversations: number;
  resolvedConversations: number;
  totalClients: number;
  totalMessages: number;
}

export default function Dashboard() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalConversations: 0,
    activeConversations: 0,
    pendingConversations: 0,
    resolvedConversations: 0,
    totalClients: 0,
    totalMessages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // En una implementación real, esto vendría de una API
      // Simulamos una carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de ejemplo
      const mockChannels: Channel[] = [
        {
          id: 'whatsapp-1',
          name: 'WhatsApp Principal',
          type: 'whatsapp',
          status: 'connected',
        },
        {
          id: 'facebook-1',
          name: 'Facebook Messenger',
          type: 'facebook',
          status: 'connected',
        },
        {
          id: 'instagram-1',
          name: 'Instagram Direct',
          type: 'instagram',
          status: 'disconnected',
        },
      ];
      
      const mockStats: Stats = {
        totalConversations: 125,
        activeConversations: 15,
        pendingConversations: 8,
        resolvedConversations: 102,
        totalClients: 87,
        totalMessages: 1243,
      };
      
      setChannels(mockChannels);
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <ChartBarIcon className="h-6 w-6 mr-2" />
          Dashboard
        </h1>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="ml-2 text-gray-500">Cargando datos...</p>
          </div>
        ) : (
          <>
            {/* Estadísticas */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Conversaciones Totales
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {stats.totalConversations}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-600 font-medium">Activas: {stats.activeConversations}</span>
                      <span className="text-yellow-600 font-medium">Pendientes: {stats.pendingConversations}</span>
                      <span className="text-blue-600 font-medium">Resueltas: {stats.resolvedConversations}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <UsersIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Clientes Totales
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {stats.totalClients}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <div className="text-gray-600">
                      Promedio de {(stats.totalMessages / stats.totalClients).toFixed(1)} mensajes por cliente
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                      <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Mensajes Totales
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {stats.totalMessages}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <div className="text-gray-600">
                      Promedio de {(stats.totalMessages / stats.totalConversations).toFixed(1)} mensajes por conversación
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estado de Canales */}
            <h2 className="text-xl font-medium text-gray-900 mb-4">Estado de Canales</h2>
            <div className="space-y-4">
              {channels.map((channel) => (
                <ConnectionStatus
                  key={channel.id}
                  channelId={channel.id}
                  channelName={channel.name}
                  channelType={channel.type}
                  initialStatus={channel.status}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}