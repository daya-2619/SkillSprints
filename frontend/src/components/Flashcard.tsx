// frontend/src/components/Flashcard.tsx

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, shadows, typography } from "../theme";

interface FlashcardProps {
  question: string;
  answer: string;
}

export const Flashcard: React.FC<FlashcardProps> = ({ question, answer }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <TouchableOpacity onPress={() => setShowAnswer(!showAnswer)} activeOpacity={0.9}>
      <View style={[styles.card, showAnswer && styles.revealed]}>
        <Text style={styles.question}>{question}</Text>
        {showAnswer && <Text style={styles.answer}>{answer}</Text>}
        <View style={styles.toggleBtn}>
          <Text style={styles.toggleText}>{showAnswer ? "Hide" : "Show"} Answer</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glass,
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    ...shadows.soft,
  },
  revealed: {
    backgroundColor: colors.primaryLight,
  },
  question: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  answer: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  toggleBtn: {
    alignSelf: "flex-start",
    backgroundColor: colors.accent,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  toggleText: {
    color: "#fff",
    fontFamily: "Inter",
  },
});
