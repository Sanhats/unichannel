declare module 'facebook-chat-api' {
  interface FacebookCredentials {
    email: string;
    password: string;
  }

  interface AppState {
    [key: string]: any;
  }

  interface ApiOptions {
    selfListen?: boolean;
    listenEvents?: boolean;
    updatePresence?: boolean;
    forceLogin?: boolean;
  }

  interface MessageInfo {
    messageID: string;
    threadID: string;
    senderID: string;
    body?: string;
    attachments?: any[];
    isGroup: boolean;
    mentions?: any;
    timestamp: number;
    type: string;
  }

  interface ThreadInfo {
    threadID: string;
    name?: string;
    participants: { id: string; name: string }[];
    isGroup: boolean;
    unreadCount: number;
  }

  interface SendMessageOptions {
    body?: string;
    attachment?: any[];
    url?: string;
    sticker?: string;
    messageId?: string;
  }

  interface SendMessageCallback {
    (err: Error | null, info: { messageID: string }): void;
  }

  interface GetThreadListCallback {
    (err: Error | null, threads: ThreadInfo[]): void;
  }

  interface GetThreadHistoryCallback {
    (err: Error | null, history: MessageInfo[]): void;
  }

  interface LogoutCallback {
    (err: Error | null): void;
  }

  interface Api {
    setOptions(options: ApiOptions): void;
    getAppState(): AppState;
    sendMessage(msg: string | SendMessageOptions, threadID: string, callback: SendMessageCallback): void;
    sendMessage(msg: string | SendMessageOptions, threadID: string): Promise<{ messageID: string }>;
    getThreadList(limit: number, timestamp: number | null, tags: string[], callback: GetThreadListCallback): void;
    getThreadHistory(threadID: string, limit: number, timestamp: number | null, callback: GetThreadHistoryCallback): void;
    listen(callback: (err: Error | null, message: MessageInfo) => void): void;
    logout(callback: LogoutCallback): void;
  }

  function FacebookChatApi(credentials: FacebookCredentials | AppState, callback: (err: Error | null, api: Api) => void): void;
  
  export = FacebookChatApi;
}