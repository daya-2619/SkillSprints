// src/app/tutor.tsx

import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useState } from "react";
import { useTutor } from "../hooks/useTutor";

export default function TutorScreen() {
  const [prompt, setPrompt] = useState("");
  const { mutateAsync, isPending, data, error } = useTutor();

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    await mutateAsync({ prompt, stream: false });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Tutor</Text>
      <TextInput
        style={styles.input}
        placeholder="Ask a question..."
        multiline
        value={prompt}
        onChangeText={setPrompt}
      />
      <Button title="Ask" onPress={handleAsk} disabled={isPending} />
      {isPending && <ActivityIndicator style={styles.loader} />}
      {error && <Text style={styles.error}>Error: {error.message}</Text>}
      {data && (
        <View style={styles.responseBox}>
          <Text style={styles.responseText}>{data.response}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f0f4f8",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#2c3e50",
  },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "white",
  },
  loader: {
    marginVertical: 12,
  },
  error: {
    color: "#e74c3c",
    marginTop: 8,
  },
  responseBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  responseText: {
    fontSize: 16,
    color: "#34495e",
  },
});
