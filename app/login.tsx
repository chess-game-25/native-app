import { AuthContext } from "@/utils/authContext";
import { Stack } from "expo-router";
import { useContext } from "react";
import { Button, Text, View } from "react-native";

export default function LoginScreen() {
    const authContext = useContext(AuthContext);
  return (
    <>
    <Stack.Screen name="login" options={{ headerShown: false }} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <Text>Login Screen</Text>
        <Button title="Login" onPress={() => authContext.logIn("", "")} />
      </View>
    </>
  );
}
