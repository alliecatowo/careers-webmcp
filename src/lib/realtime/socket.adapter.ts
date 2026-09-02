import { socketEngine, SocketEngine } from './socket.engine';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

class MockSocket implements SocketEngine {
    private listeners: Map<string, ((payload: any) => void)[]> = new Map();

    connect() {
        console.log("Mock Socket: Connecting...");
    }
    disconnect() {
        console.log("Mock Socket: Disconnecting...");
    }
    on(event: string, handler: (payload: any) => void) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(handler);
        console.log(`Mock Socket: Registered handler for event "${event}"`);
    }
    emit(event: string, payload: any) {
        console.log(`Mock Socket: Emitting event "${event}"`, payload);
        if (this.listeners.has(event)) {
            this.listeners.get(event)?.forEach(handler => handler(payload));
        }
    }
}

class RealSocket implements SocketEngine {
    // In a real app, this would be an instance of a WebSocket or Socket.IO client.
    private socket: any = null;

    connect() {
        // Example: this.socket = new WebSocket('wss://your-server.com');
        console.warn("Real socket not implemented. Please connect to a WebSocket server.");
    }
    disconnect() {
        // this.socket?.close();
    }
    on(event: string, handler: (payload: any) => void) {
        // this.socket?.addEventListener('message', (message) => {
        //   const parsed = JSON.parse(message.data);
        //   if (parsed.type === event) {
        //     handler(parsed.payload);
        //   }
        // });
    }
    emit(event: string, payload: any) {
        // this.socket?.send(JSON.stringify({ type: event, payload }));
    }
}


export const socketAdapter = USE_MOCK ? new MockSocket() : new RealSocket();
