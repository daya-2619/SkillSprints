// frontend/src/components/Quiz.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, shadows, typography } from "../theme";

interface QuestionItem {
  question: string;
  options: string[];
  answer: number; // index of correct option
}

interface QuizProps {
  title: string;
  questions: QuestionItem[];
}

export const Quiz: React.FC<QuizProps> = ({ title, questions }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {questions.map((q, idx) => (
        <View key={idx} style={styles.questionBox}>
          <Text style={styles.question}>{idx + 1}. {q.question}</Text>
          {q.options.map((opt, i) => (
            <Text key={i} style={styles.option}>• {opt}</Text>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.glass,
    ...shadows.soft,
    borderRadius: 12,
    marginVertical: 8,
  },
  title: {
    ...typography.heading,
    marginBottom: 12,
    color: colors.textPrimary,
  },
  questionBox: {
    marginBottom: 12,
  },
  question: {
    ...typography.bodyBold,
    marginBottom: 4,
    color: colors.textSecondary,
  },
  option: {
    ...typography.body,
    marginLeft: 12,
    color: colors.textPrimary,
  },
});
