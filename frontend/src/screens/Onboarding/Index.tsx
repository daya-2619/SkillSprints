// frontend/src/screens/Onboarding/Index.tsx

import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function OnboardingScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to skillsprint</Text>
      <Text style={styles.subtitle}>Learn AI, Data Science, Programming and more in bite‑size lessons.</Text>
      <Button title="Get Started" onPress={() => navigation.navigate("login" as never)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f0f4f8" },
  title: { fontSize: 28, fontWeight: "bold", color: "#2c3e50", marginBottom: 12 },
  subtitle: { fontSize: 16, color: "#34495e", textAlign: "center", marginBottom: 24 },
});
