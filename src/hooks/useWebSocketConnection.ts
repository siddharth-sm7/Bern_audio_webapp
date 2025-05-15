import { useState, useEffect, useRef, useCallback } from 'react';

// In a real application, this would be configured from environment variables
const WEBSOCKET_URL = 'wss://example.com/audio-api';

interface WebSocketHook {
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  sendAudioChunk: (chunk: Uint8Array) => void;
  responseAudio: Uint8Array | null;
}

export const useWebSocketConnection = (): WebSocketHook => {
  const [connected, setConnected] = useState<boolean>(false);
  const [responseAudio, setResponseAudio] = useState<Uint8Array | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  
  // Mock a WebSocket connection for demonstration purposes
  // In a real implementation, this would connect to an actual server
  const connect = useCallback(async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // For this demo, we'll mock the WebSocket
      // In a real application, uncomment the line below:
      // const ws = new WebSocket(WEBSOCKET_URL);
      
      // Mock WebSocket for demonstration
      const mockWs = {
        send: (data: any) => {
          console.log('Sending data to WebSocket:', data);
          // Simulate processing time before response
          if (mockTimeoutRef.current) {
            clearTimeout(mockTimeoutRef.current);
          }
          
          mockTimeoutRef.current = setTimeout(() => {
            // Mock a response after 2 seconds
            // In a real app, this would be from the server
            const mockResponseBuffer = new ArrayBuffer(1024);
            const mockResponse = new Uint8Array(mockResponseBuffer);
            // Fill with some dummy data (sine wave)
            for (let i = 0; i < mockResponse.length; i++) {
              mockResponse[i] = 128 + Math.floor(127 * Math.sin(i / 10));
            }
            setResponseAudio(mockResponse);
          }, 2000);
        },
        close: () => {
          console.log('WebSocket closed');
          if (mockTimeoutRef.current) {
            clearTimeout(mockTimeoutRef.current);
          }
          setConnected(false);
        }
      };
      
      // For demo purposes
      websocketRef.current = mockWs as unknown as WebSocket;
      setConnected(true);
      resolve();
      
      // In a real application, you would handle WebSocket events:
      /*
      ws.onopen = () => {
        websocketRef.current = ws;
        setConnected(true);
        resolve();
      };
      
      ws.onclose = () => {
        websocketRef.current = null;
        setConnected(false);
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };
      
      ws.onmessage = (event) => {
        // Handle incoming audio data
        if (event.data instanceof Blob) {
          event.data.arrayBuffer().then((buffer) => {
            const audioData = new Uint8Array(buffer);
            setResponseAudio(audioData);
          });
        }
      };
      */
    });
  }, []);
  
  const mockTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }
    setConnected(false);
  }, []);
  
  // Send audio chunk to WebSocket
  const sendAudioChunk = useCallback((chunk: Uint8Array) => {
    if (!websocketRef.current || !connected) return;
    
    // In a real application, you would send the binary data:
    // websocketRef.current.send(chunk);
    
    // For the mock implementation
    if (typeof websocketRef.current.send === 'function') {
      websocketRef.current.send(chunk);
    }
  }, [connected]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      disconnect();
      if (mockTimeoutRef.current) {
        clearTimeout(mockTimeoutRef.current);
      }
    };
  }, [disconnect]);
  
  return {
    connected,
    connect,
    disconnect,
    sendAudioChunk,
    responseAudio,
  };
};