'use client';

import { useState, useEffect } from 'react';

export function useQuestion(questionNumber, previousAnswer, difficulty) {
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchQuestion() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/generate-question', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ questionNumber, previousAnswer, difficulty }),
        });
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch question');
        }

        console.log('Received question data:', data);
        
        if (!data.question || !Array.isArray(data.options) || data.options.length !== 4) {
          throw new Error('Invalid question data format');
        }

        setQuestionData(data);
      } catch (error) {
        console.error('Error fetching question:', error);
        setError(error.message);
        setQuestionData(null);
      }
      setLoading(false);
    }

    fetchQuestion();
  }, [questionNumber, previousAnswer, difficulty]);

  return { questionData, loading, error };
}