'use client';

import dynamic from 'next/dynamic';

const Select = dynamic(() => import('@carbon/react').then((mod) => mod.Select), { ssr: false });
const SelectItem = dynamic(() => import('@carbon/react').then((mod) => mod.SelectItem), { ssr: false });

const topics = [
  'General Math',
  'Algebra',
  'Geometry',
  'Trigonometry',
  'Calculus',
  'Statistics',
  'Probability'
];

export default function TopicSelector({ selectedTopic, onTopicChange }) {
  return (
    <div className="topic-selector">
      <Select
        id="topic-select"
        labelText=""
        onChange={(e) => onTopicChange(e.target.value)}
        value={selectedTopic}
      >
        {topics.map((topic) => (
          <SelectItem key={topic} value={topic} text={topic} />
        ))}
      </Select>
    </div>
  );
}