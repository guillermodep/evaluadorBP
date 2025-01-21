import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Verificar que axios está disponible
if (!axios) {
  console.error('Axios not available');
}

interface Question {
  id: number;
  question: string;
  type: string;
  options: string[];
  correctAnswer: string;
}

interface QuestionResponse {
  questions: Question[];
}

interface ParseError extends Error {
  message: string;
}

type Props = {
  params: {
    role: string;
  };
};

export async function GET(
  req: NextRequest,
  { params }: Props
): Promise<NextResponse> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  const { role } = params;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    console.log('Making request to GROQ API...');
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: `Eres un entrevistador técnico experto especializado en crear preguntas de opción múltiple.
            Para cada pregunta, debes generar:
            1. Una pregunta técnica específica del rol
            2. Exactamente 4 opciones de respuesta
            3. Una respuesta correcta que debe estar entre las opciones
            4. Las opciones deben ser claras y mutuamente excluyentes
            5. Todas las respuestas deben estar en español`
          },
          {
            role: "user",
            content: `Genera 3 preguntas técnicas de opción múltiple para una entrevista de ${role}.
            Cada pregunta debe ser específica del rol y tener exactamente este formato JSON:
{
  "questions": [
    {
      "id": 1,
      "question": "¿[Pregunta técnica específica de ${role}]?",
      "type": "multiple_choice",
      "options": [
        "Una respuesta técnicamente correcta",
        "Una respuesta plausible pero incorrecta",
        "Otra respuesta incorrecta pero relacionada",
        "Una respuesta claramente incorrecta"
      ],
      "correctAnswer": "Una respuesta técnicamente correcta"
    }
  ]
}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: "json_object" },
        presence_penalty: 0.3,
        frequency_penalty: 0.3
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    const content = response.data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('No content in response:', response.data);
      throw new Error('No content in response');
    }

    try {
      const parsedData = JSON.parse(content) as QuestionResponse;
      
      if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
        throw new Error('Invalid response format');
      }

      const validQuestions = parsedData.questions.filter((q: Question) => 
        q.question &&
        q.options &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        q.correctAnswer &&
        q.options.includes(q.correctAnswer)
      );

      if (validQuestions.length === 0) {
        throw new Error('No valid questions generated');
      }

      return NextResponse.json(validQuestions);
    } catch (error) {
      const parseError = error as ParseError;
      console.error('Parse error:', parseError, 'Content:', content);
      return NextResponse.json(
        { error: 'Failed to parse response', details: parseError.message },
        { status: 500 }
      );
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('GROQ API error:', error.response?.data || error.message);
      return NextResponse.json(
        { 
          error: 'Failed to fetch questions',
          details: error.response?.data?.error || error.message
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
