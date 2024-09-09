import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { questionNumber, difficulty, topic, usedQuestions } = await request.json();

    let attempts = 0;
    let generatedQuestion;

    while (attempts < 3) {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: `You are a math teacher creating a multiple choice question on the topic of ${topic}. The question number is ${questionNumber}.
          The current difficulty level is ${difficulty.toFixed(1)} out of 10.
          Create a unique math question appropriate for a high school student at this difficulty level and on the specified topic.
          The question must not be one of the following: ${usedQuestions.join(', ')}.
          Provide the question, four possible answers (including the correct one), and indicate which answer is correct.
          Also, provide a brief explanation of the concept being tested, a tip for solving similar problems, and a probable reason why a student might answer incorrectly.
          Format your response as a JSON object with keys: question, options (an array of 4 options), correctAnswer, concept, tip, and wrongAnswerReason.`
        }],
      });

      const responseContent = completion.choices[0].message.content;
      console.log('Raw OpenAI response:', responseContent);

      try {
        generatedQuestion = JSON.parse(responseContent);
        if (!usedQuestions.includes(generatedQuestion.question)) {
          break;
        }
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
      }

      attempts++;
    }

    if (!generatedQuestion || !generatedQuestion.question || !Array.isArray(generatedQuestion.options) || generatedQuestion.options.length !== 4) {
      throw new Error('Invalid question format from OpenAI');
    }

    return NextResponse.json(generatedQuestion);
  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json({ error: 'Error generating question: ' + error.message }, { status: 500 });
  }
}