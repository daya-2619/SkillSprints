import { useState } from 'react';

export const useQuiz = () => {
  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchQuiz = async (courseId: string) => {
    setLoading(true);
    // Placeholder for API call
    setTimeout(() => {
      setQuizData({ questions: [{ q: 'What is AI?', options: ['A', 'B'], answer: 'A' }] });
      setLoading(false);
    }, 1000);
  };

  return { fetchQuiz, quizData, loading };
};
