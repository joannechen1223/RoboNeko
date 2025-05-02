import "react-native-reanimated";

import { Stack } from "expo-router";
import { Provider } from "react-redux";

import { WebSocketProvider } from "@/features/WebSocket/WebSocketContext";

import store from "./store";

export default function RootLayout() {
  return (
    <WebSocketProvider url="ws://192.168.1.67/ws">
      <Provider store={store}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="postcards" options={{ headerShown: false }} />
          <Stack.Screen name="personality" options={{ headerShown: false }} />
        </Stack>
      </Provider>
    </WebSocketProvider>
  );
}
