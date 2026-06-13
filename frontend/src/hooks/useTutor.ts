// src/hooks/useTutor.ts

import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { Alert } from "react-native";

interface TutorRequest {
  prompt: string;
  stream?: boolean;
}

interface TutorResponse {
  response: string;
}

/**
 * React Query hook to call the backend tutor endpoint.
 * Returns a mutation object with `mutateAsync` for manual trigger.
 */
export function useTutor(): UseMutationResult<TutorResponse, Error, TutorRequest> {
  return useMutation<TutorResponse, Error, TutorRequest>(
    async (payload) => {
      const resp = await fetch(`${process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/tutor/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const err = await resp.text();
        throw new Error(err || "Tutor request failed");
      }
      const data: TutorResponse = await resp.json();
      return data;
    },
    {
      onError: (error) => {
        Alert.alert("Error", error.message);
      },
    }
  );
}
