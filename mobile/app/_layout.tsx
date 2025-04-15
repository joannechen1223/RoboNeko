import "react-native-reanimated";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";

import store from "./store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="postcards" options={{ headerShown: false }} />
        <Stack.Screen name="personality" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </Provider>
  );
}
