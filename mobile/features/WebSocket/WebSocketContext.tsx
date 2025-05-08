import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/app/store";

import { setIsConnected } from "./webSocketSlice";

import { setActionPreferences } from "../Personality/personalitySlice";
import { setIntimacyScore } from "../Postcards/postcardsSlice";

// Define types for messages and context value
interface Message {
  // Define your message structure here
  [key: string]: any;
}

interface WebSocketContextValue {
  socket: WebSocket | null;
  messages: Message[];
  sendMessage: (message: any) => void;
  sendActionPreferences: (actionPreferences: { [key: string]: number }) => void;
  isConnected: boolean;
}

// Create context with a default value
const WebSocketContext = createContext<WebSocketContextValue | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const ipAddress = useSelector(
    (state: RootState) => state.webSocket.ipAddress,
  );
  const url = `ws://${ipAddress}/ws`;
  const isConnected = useSelector(
    (state: RootState) => state.webSocket.isConnected,
  );

  useEffect(() => {
    if (!ipAddress) {
      console.warn("No IP address found");
      return;
    }
    // Create the WebSocket connection once at the provider level
    const newSocket = new WebSocket(url);
    console.log("WebSocket connecting to", url);

    newSocket.onopen = () => {
      console.log("WebSocket connection established");
      dispatch(setIsConnected(true));

      // Send init client directly using the newSocket instance
      sendMessage({ type: "init_client" }, newSocket);
    };

    newSocket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
        console.log("Received message:", data);
        if (data.type === "intimacy_score") {
          dispatch(setIntimacyScore(data.intimacy_score));
        } else if (data.type === "init_data") {
          dispatch(setIntimacyScore(data.intimacy_score));
          dispatch(setActionPreferences(data.action_preferences));
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection closed");
      dispatch(setIsConnected(false));
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      dispatch(setIsConnected(false));
    };

    setSocket(newSocket);

    // Clean up
    return () => {
      newSocket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ipAddress, dispatch]);

  // Helper function to send messages through a specific socket or the current one
  const sendMessage = (message: any, socketToUse?: WebSocket): void => {
    const socketInstance = socketToUse || socket;
    if (socketInstance && socketInstance.readyState === WebSocket.OPEN) {
      socketInstance.send(JSON.stringify(message));
    } else {
      console.warn("Cannot send message, WebSocket is not connected");
    }
  };

  const sendActionPreferences = (actionPreferences: {
    [key: string]: number;
  }): void => {
    sendMessage({
      type: "action_preferences",
      action_preferences: actionPreferences,
    });
  };

  const value: WebSocketContextValue = {
    socket,
    messages,
    sendMessage,
    sendActionPreferences,
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
