import { NextRequest, NextResponse } from 'next/server';
import { Question, Difficulty } from '@/types';

const difficulties: Difficulty[] = ['basic', 'intermediate', 'advanced', 'expert', 'master'];

export async function GET(
  req: NextRequest,
  { params }: { params: { role: string } }
): Promise<NextResponse> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  const { role } = params;

  if (!apiKey) {
    console.error('API key not configured');
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const questions: Question[] = [];
    const prompt = `Generate 5 multiple choice questions for a ${role} position with varying difficulty levels.
      Each question should be specific to the ${role} role.
      Format the response as JSON with the following structure:
      {
        "questions": [
          {
            "id": number,
            "question": "string",
            "options": ["string", "string", "string", "string"],
            "correctAnswer": "string",
            "difficulty": "one of: basic, intermediate, advanced, expert, master"
          }
        ]
      }
      Important:
      - Generate exactly 5 questions
      - Each question must have exactly 4 options
      - The correctAnswer must be one of the options
      - Use different difficulty levels for each question
      - Make questions relevant to ${role} role
      - Ensure questions test real technical knowledge`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [{ 
          role: 'user', 
          content: prompt 
        }],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      console.error('API Response not OK:', await response.text());
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid API response structure:', data);
      throw new Error('Invalid API response structure');
    }

    try {
      const content = data.choices[0].message.content;
      const parsedData = JSON.parse(content);

      if (!Array.isArray(parsedData.questions) || parsedData.questions.length !== 5) {
        console.error('Invalid questions format:', parsedData);
        throw new Error('Invalid questions format');
      }

      // Validar cada pregunta
      parsedData.questions.forEach((q: any, index: number) => {
        if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || !q.correctAnswer || !q.difficulty) {
          console.error(`Invalid question format at index ${index}:`, q);
          throw new Error(`Invalid question format at index ${index}`);
        }
      });

      return NextResponse.json(parsedData.questions);
    } catch (parseError) {
      console.error('Error parsing API response:', parseError);
      throw new Error('Failed to parse API response');
    }

  } catch (error) {
    console.error('Error in questions API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
