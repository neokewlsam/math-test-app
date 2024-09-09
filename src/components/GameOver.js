'use client';

import dynamic from 'next/dynamic';

const Tag = dynamic(() => import('@carbon/react').then((mod) => mod.Tag), { ssr: false });
const Button = dynamic(() => import('@carbon/react').then((mod) => mod.Button), { ssr: false });

export default function GameOver({ score, failedConcept, onRestart, topic }) {
  return (
    <div className="game-over">
      <h2 className="game-over__title">Challenge Complete!</h2>
      <div className="game-over__tags">
        <Tag type="green" size="lg">Your score: {score} out of 50</Tag>
        <Tag type="purple" size="lg">Topic: {topic}</Tag>
      </div>
      {failedConcept && (
        <div className="game-over__analysis">
          <h3 className="game-over__analysis-title">Performance Analysis</h3>
          <p><strong>Concept tested:</strong> {failedConcept.concept}</p>
          <p><strong>Your answer:</strong> {failedConcept.userAnswer}</p>
          <p><strong>Correct answer:</strong> {failedConcept.correctAnswer}</p>
          <p><strong>Tip for improvement:</strong> {failedConcept.tip}</p>
          <p><strong>Probable reason for wrong answer:</strong> {failedConcept.wrongAnswerReason}</p>
        </div>
      )}
      <Button className="game-over__restart-button" onClick={onRestart}>Restart Challenge</Button>
    </div>
  );
}