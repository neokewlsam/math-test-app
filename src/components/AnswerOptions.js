'use client';

import dynamic from 'next/dynamic';

const Button = dynamic(() => import('@carbon/react').then((mod) => mod.Button), { ssr: false });

export default function AnswerOptions({ options, onAnswer }) {
  return (
    <div className="answer-options">
      {options.map((option, index) => (
        <Button
          key={index}
          onClick={() => onAnswer(option)}
          className="answer-options__button"
        >
          {option}
        </Button>
      ))}
    </div>
  );
}