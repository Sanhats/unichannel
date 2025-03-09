declare module 'instagram_mqtt' {
  import { IgApiClient } from 'instagram-private-api';
  
  interface RealtimeClient extends NodeJS.EventEmitter {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
  }
  
  export function withRealtime(client: IgApiClient): RealtimeClient;
}