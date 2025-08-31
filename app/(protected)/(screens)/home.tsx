import { AuthContext } from "@/utils/authContext";
import { useContext } from "react";
import { View, Text, Button } from "react-native";

export default function HomeScreen() {
  const authProvider = useContext(AuthContext);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <Text>Home Screen</Text>
      <Button title="Log Out" onPress={() => {authProvider.logOut()}} />
    </View>
  );
}
