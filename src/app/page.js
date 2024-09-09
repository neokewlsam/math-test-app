'use client';

import dynamic from 'next/dynamic';
import MathTest from '../components/MathTest';

const Theme = dynamic(() => import('@carbon/react').then((mod) => mod.Theme), { ssr: false });

export default function Home() {
  return (
    <Theme theme="white">
      <header className="header">
        <h1>Adaptive Math Tutor</h1>
      </header>
      <main>
        <MathTest />
      </main>
    </Theme>
  );
}