import { Stack } from 'expo-router';

export default function ProtectedLayout() {
  return (
    <Stack>
      <Stack.Screen name="(screens)" options={{ headerShown: false }} />
    </Stack>
  );
}
