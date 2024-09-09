'use client';

import { useState, useEffect } from 'react';
import QuestionDisplay from './QuestionDisplay';
import AnswerOptions from './AnswerOptions';
import GameOver from './GameOver';
import TopicSelector from './TopicSelector';
import dynamic from 'next/dynamic';

const ProgressBar = dynamic(() => import('@carbon/react').then((mod) => mod.ProgressBar), { ssr: false });
const Loading = dynamic(() => import('@carbon/react').then((mod) => mod.Loading), { ssr: false });
const InlineNotification = dynamic(() => import('@carbon/react').then((mod) => mod.InlineNotification), { ssr: false });
const Button = dynamic(() => import('@carbon/react').then((mod) => mod.Button), { ssr: false });

export default function MathTest() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [failedConcept, setFailedConcept] = useState(null);
  const [difficulty, setDifficulty] = useState(1);
  const [previousAnswer, setPreviousAnswer] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('General Math');
  const [testStarted, setTestStarted] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState(new Set());

  useEffect(() => {
    if (testStarted) {
      fetchQuestion();
    }
  }, [currentQuestion, testStarted]);

  async function fetchQuestion() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          questionNumber: currentQuestion, 
          difficulty, 
          topic: selectedTopic,
          usedQuestions: Array.from(usedQuestions)
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setQuestionData(data);
      setUsedQuestions(prev => new Set(prev).add(data.question));
    } catch (e) {
      console.error("Failed to fetch question:", e);
      setError(e.message || "Failed to load question. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === questionData.correctAnswer) {
      if (currentQuestion === 50) {
        setGameOver(true);
        setScore(score + 1);
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setScore(score + 1);
        setPreviousAnswer(selectedAnswer);
        setDifficulty(Math.min(difficulty + 0.2, 10));
      }
    } else {
      setGameOver(true);
      setFailedConcept({
        concept: questionData.concept,
        userAnswer: selectedAnswer,
        correctAnswer: questionData.correctAnswer,
        tip: questionData.tip,
        wrongAnswerReason: questionData.wrongAnswerReason
      });
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(1);
    setScore(0);
    setGameOver(false);
    setQuestionData(null);
    setLoading(false);
    setError(null);
    setFailedConcept(null);
    setDifficulty(1);
    setPreviousAnswer(null);
    setTestStarted(false);
    setUsedQuestions(new Set());
  };

  const handleTopicChange = (topic) => {
    setSelectedTopic(topic);
  };

  const startTest = () => {
    setTestStarted(true);
    fetchQuestion();
  };

  if (!testStarted) {
    return (
      <div className="container topic-selection">
        <h2 className="topic-selection__title">Select a Topic</h2>
        <TopicSelector selectedTopic={selectedTopic} onTopicChange={handleTopicChange} />
        <Button className="topic-selection__button" onClick={startTest}>Start Test</Button>
      </div>
    );
  }

  if (loading) {
    return <Loading description="Loading question..." withOverlay />;
  }

  if (error) {
    return (
      <InlineNotification
        kind="error"
        title="Error"
        subtitle={error}
        hideCloseButton
      />
    );
  }

  if (!questionData) {
    return (
      <InlineNotification
        kind="warning"
        title="No Data"
        subtitle="No question data available. Please try again."
        hideCloseButton
      />
    );
  }

  return (
    <div className="container math-test">
      {!gameOver ? (
        <>
          <ProgressBar 
            value={(currentQuestion - 1) * 2} 
            max={100} 
            label="Progress"
            helperText={`Question ${currentQuestion} of 50`}
          />
          <QuestionDisplay 
            question={questionData.question} 
            difficulty={difficulty}
            previousAnswer={previousAnswer}
            topic={selectedTopic}
          />
          <AnswerOptions options={questionData.options} onAnswer={handleAnswer} />
        </>
      ) : (
        <GameOver 
          score={score} 
          failedConcept={failedConcept} 
          onRestart={handleRestart}
          topic={selectedTopic}
        />
      )}
    </div>
  );
}