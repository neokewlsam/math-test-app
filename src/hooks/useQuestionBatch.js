'use client';

import { useState, useEffect } from 'react';

const BATCH_SIZE = 10;
const CACHE_KEY = 'mathChallengeQuestions';

export function useQuestionBatch(initialQuestionNumber, initialDifficulty) {
  const [questions, setQuestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchQuestionBatch() {
      setLoading(true);
      setError(null);

      const cachedQuestions = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      const newQuestions = { ...cachedQuestions };
      const questionsToFetch = [];

      for (let i = 0; i < BATCH_SIZE; i++) {
        const questionNumber = initialQuestionNumber + i;
        const cacheKey = `${questionNumber}-${initialDifficulty}`;
        if (!newQuestions[cacheKey]) {
          questionsToFetch.push({ questionNumber, difficulty: initialDifficulty });
        }
      }

      if (questionsToFetch.length > 0) {
        try {
          console.log('Fetching questions:', questionsToFetch);
          const response = await fetch('/api/generate-questions-batch', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ questions: questionsToFetch }),
          });
          
          console.log('Response status:', response.status);
          console.log('Response headers:', response.headers);

          if (!response.ok) {
            throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          console.log('Parsed data:', data);

          // For now, we're just logging the response
          console.log('API response:', data);

          // When we implement actual question generation, uncomment this:
          // data.forEach((question, index) => {
          //   const cacheKey = `${questionsToFetch[index].questionNumber}-${questionsToFetch[index].difficulty}`;
          //   newQuestions[cacheKey] = question;
          // });
          // localStorage.setItem(CACHE_KEY, JSON.stringify(newQuestions));
        } catch (error) {
          console.error('Error fetching questions:', error);
          setError(error.message);
        }
      }

      setQuestions(newQuestions);
      setLoading(false);
    }

    fetchQuestionBatch();
  }, [initialQuestionNumber, initialDifficulty]);

  return { questions, loading, error };
}