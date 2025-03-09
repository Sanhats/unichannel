import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io({
      path: '/api/socket',
      addTrailingSlash: false,
    });
  }
  return socket;
};

export const joinConversation = (conversationId: string) => {
  const socket = getSocket();
  socket.emit('join-conversation', conversationId);
};

export const leaveConversation = (conversationId: string) => {
  const socket = getSocket();
  socket.emit('leave-conversation', conversationId);
};

export const onNewMessage = (callback: (message: any) => void) => {
  const socket = getSocket();
  socket.on('new-message', callback);
  return () => {
    socket.off('new-message', callback);
  };
};

export const onChannelStatusChange = (callback: (data: any) => void) => {
  const socket = getSocket();
  socket.on('channel-status-change', callback);
  return () => {
    socket.off('channel-status-change', callback);
  };
};