import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";

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
  return useMutation<TutorResponse, Error, TutorRequest>({
    mutationFn: async (payload) => {
      const token = await SecureStore.getItemAsync("access_token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const resp = await fetch(`${process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/tutor/ask`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const err = await resp.text();
        throw new Error(err || "Tutor request failed");
      }
      const data: TutorResponse = await resp.json();
      return data;
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });
}
