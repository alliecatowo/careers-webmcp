export interface SocketEngine {
  connect: () => void;
  disconnect: () => void;
  on: (event: string, handler: (payload: any) => void) => void;
  emit: (event: string, payload: any) => void;
}

// Global instance of the engine
import { socketAdapter } from './socket.adapter';
export const socketEngine: SocketEngine = socketAdapter;
