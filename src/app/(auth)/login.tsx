import { AuthForm } from "@/components/auth-form";
import { StyleSheet, View } from "react-native";

export default function LoginScreen() {
  return (
    <View style={styles.centered}>
      <AuthForm />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
});
