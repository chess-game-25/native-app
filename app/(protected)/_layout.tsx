import { AuthContext } from '@/utils/authContext';
import { Redirect, Stack } from 'expo-router';
import { useContext } from 'react';

export default function ProtectedLayout() {
  const authState = useContext(AuthContext);

  if (authState.isReady && !authState.token) {
    return <Redirect href={'/login'} />;
  }

  return (
    <Stack>
      <Stack.Screen name="(screens)" options={{ headerShown: false }} />
    </Stack>
  );
}
