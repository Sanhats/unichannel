export interface FacebookCredentials {
  email: string;
  password: string;
}

export interface FacebookMessage {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  timestamp: number;
  attachments?: any[];
  isGroup: boolean;
}

export interface FacebookThread {
  id: string;
  name: string;
  participants: {
    id: string;
    name: string;
  }[];
  isGroup: boolean;
  unreadCount: number;
}