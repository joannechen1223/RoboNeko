import "react-native-reanimated";

import {
  useFonts,
  CherryBombOne_400Regular as CherryBombOne,
} from "@expo-google-fonts/cherry-bomb-one";
import { SourGummy_400Regular as SourGummy } from "@expo-google-fonts/sour-gummy";
import { Stack } from "expo-router";
import { View } from "react-native";
import { ActivityIndicator } from "react-native";
import { Provider } from "react-redux";

import { WebSocketProvider } from "@/features/WebSocket/WebSocketContext";

import store from "./store";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    CherryBombOne: CherryBombOne,
    SourGummy: SourGummy,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <WebSocketProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="postcards" options={{ headerShown: false }} />
          <Stack.Screen name="personality" options={{ headerShown: false }} />
        </Stack>
      </WebSocketProvider>
    </Provider>
  );
}
