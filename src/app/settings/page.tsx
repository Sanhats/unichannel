'use client';

import { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('channels');

  return (
    <MainLayout>
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Cog6ToothIcon className="h-6 w-6 mr-2" />
          Configuración
        </h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('channels')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'channels'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Canales
              </button>
              <button
                onClick={() => setActiveTab('agents')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'agents'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Agentes
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'templates'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Plantillas
              </button>
              <button
                onClick={() => setActiveTab('general')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'general'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                General
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'channels' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Configuración de Canales</h2>
                <p className="text-gray-500 mb-4">
                  Conecta y gestiona tus canales de comunicación con clientes.
                </p>
                
                {/* Aquí iría el contenido de configuración de canales */}
                <div className="mt-6 space-y-4">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Añadir nuevo canal
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'agents' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Gestión de Agentes</h2>
                <p className="text-gray-500 mb-4">
                  Administra los agentes que tendrán acceso al sistema.
                </p>
                
                {/* Aquí iría el contenido de gestión de agentes */}
                <div className="mt-6 space-y-4">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Añadir nuevo agente
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'templates' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Plantillas de Respuesta</h2>
                <p className="text-gray-500 mb-4">
                  Crea y gestiona plantillas de respuesta rápida para tus agentes.
                </p>
                
                {/* Aquí iría el contenido de plantillas */}
                <div className="mt-6 space-y-4">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Crear nueva plantilla
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'general' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Configuración General</h2>
                <p className="text-gray-500 mb-4">
                  Configura las opciones generales del sistema.
                </p>
                
                {/* Aquí iría el contenido de configuración general */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <input
                      id="notifications"
                      name="notifications"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="notifications" className="ml-2 block text-sm text-gray-900">
                      Activar notificaciones de escritorio
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="sounds"
                      name="sounds"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="sounds" className="ml-2 block text-sm text-gray-900">
                      Activar sonidos de notificación
                    </label>
                  </div>
                  
                  <div className="mt-4">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Guardar cambios
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}