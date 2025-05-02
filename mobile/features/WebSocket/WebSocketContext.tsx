import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Define types for messages and context value
interface Message {
  // Define your message structure here
  [key: string]: any;
}

interface WebSocketContextValue {
  socket: WebSocket | null;
  messages: Message[];
  sendMessage: (message: any) => void;
  isConnected: boolean;
}

// Create context with a default value
const WebSocketContext = createContext<WebSocketContextValue | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
  url: string;
}

export function WebSocketProvider({ children, url }: WebSocketProviderProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Create the WebSocket connection once at the provider level
    const newSocket = new WebSocket(url);

    newSocket.onopen = () => {
      console.log("WebSocket connection established");
      setIsConnected(true);
    };

    newSocket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    setSocket(newSocket);

    // Clean up
    return () => {
      newSocket.close();
    };
  }, [url]);

  // Methods to interact with the socket
  const sendMessage = (message: any): void => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn("Cannot send message, WebSocket is not connected");
    }
  };

  const value: WebSocketContextValue = {
    socket,
    messages,
    sendMessage,
    isConnected,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

// Custom hook to use the WebSocket context
export function useWebSocket(): WebSocketContextValue {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
