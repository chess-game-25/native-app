import { Stack } from "expo-router";

export default function RootLayout() {
  return (
      <Stack >
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="find_match" options={{ headerShown: false }} />
        <Stack.Screen name="game" options={{ headerShown: false }} />
        <Stack.Screen name="wait_room" options={{ headerShown: false }} />
      </Stack>
  );
}
