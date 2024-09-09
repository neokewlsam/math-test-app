'use client';

import dynamic from 'next/dynamic';

const Tag = dynamic(() => import('@carbon/react').then((mod) => mod.Tag), { ssr: false });

export default function QuestionDisplay({ question, difficulty, previousAnswer, topic }) {
  return (
    <div className="question-display">
      <div className="question-display__header">
        <Tag type="blue" size="sm">Difficulty: {difficulty.toFixed(1)}/10</Tag>
        <Tag type="purple" size="sm">Topic: {topic}</Tag>
        {previousAnswer !== null && previousAnswer !== undefined && (
          <Tag type="warm-gray" size="sm">Previous answer: {previousAnswer}</Tag>
        )}
      </div>
      <p className="question-display__text">{question}</p>
    </div>
  );
}