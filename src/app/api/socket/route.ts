import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { SocketServer } from '../../../lib/socket/socket-server';

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // En una API Route normal, no podemos inicializar el servidor de WebSockets directamente
    // porque necesitamos acceso al servidor HTTP subyacente.
    // En su lugar, devolvemos una respuesta que indica que el endpoint está disponible.
    return NextResponse.json({ 
      status: 'available',
      message: 'WebSocket endpoint is available. Connect using Socket.IO client.'
    });
  } catch (error) {
    console.error('Error en socket route:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}