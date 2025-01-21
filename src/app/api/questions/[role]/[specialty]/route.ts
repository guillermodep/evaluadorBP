import { NextRequest, NextResponse } from 'next/server';
import { Question } from '@/types';

// Cache para almacenar preguntas usadas recientemente
const recentQuestionsCache: { [key: string]: Set<string> } = {};
const CACHE_MAX_SIZE = 100; // Número máximo de preguntas a almacenar por categoría

function addToCache(role: string, specialty: string, question: string) {
  const cacheKey = `${role}-${specialty}`;
  if (!recentQuestionsCache[cacheKey]) {
    recentQuestionsCache[cacheKey] = new Set();
  }

  // Limpiar caché si alcanza el límite
  if (recentQuestionsCache[cacheKey].size >= CACHE_MAX_SIZE) {
    recentQuestionsCache[cacheKey].clear();
  }

  recentQuestionsCache[cacheKey].add(question.toLowerCase());
}

function isQuestionUsed(role: string, specialty: string, question: string): boolean {
  const cacheKey = `${role}-${specialty}`;
  return recentQuestionsCache[cacheKey]?.has(question.toLowerCase()) || false;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { role: string; specialty: string } }
): Promise<NextResponse> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  const { role, specialty } = params;

  const roleInSpanish = {
    developer: 'desarrollador',
    qa: 'analista QA',
    devops: 'ingeniero DevOps'
  }[role] || role;

  const specialtyInSpanish = {
    backend: 'Backend',
    frontend: 'Frontend',
    fullstack: 'Fullstack',
    'quality-assurance': 'Quality Assurance',
    'quality-engineer': 'Quality Engineer',
    devops: 'DevOps Engineer',
    devsecops: 'DevSecOps Engineer',
    platform: 'Platform Engineer'
  }[specialty] || specialty;

  // Mapeo de áreas específicas por especialidad
  const specialtyAreas = {
    devops: [
      'CI/CD y Entrega Continua',
      'Infraestructura como Código',
      'Contenedores y Orquestación',
      'Monitoreo y Logging',
      'Automatización y Scripting'
    ],
    devsecops: [
      'Seguridad en CI/CD',
      'Análisis de vulnerabilidades',
      'Seguridad en contenedores',
      'Cumplimiento y auditoría',
      'Automatización de seguridad'
    ],
    platform: [
      'Arquitectura de plataformas',
      'Servicios cloud-native',
      'Automatización de infraestructura',
      'Observabilidad y monitoreo',
      'Gestión de recursos cloud'
    ]
  };

  if (!apiKey) {
    console.error('API key not configured');
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const timestamp = new Date().toISOString();
    const randomSeed = Math.random().toString(36).substring(7);
    let attempts = 0;
    const MAX_ATTEMPTS = 3;

    while (attempts < MAX_ATTEMPTS) {
      try {
        let specialtyPrompt = '';
        if (role === 'devops') {
          const areas = specialtyAreas[specialty as keyof typeof specialtyAreas] || [];
          specialtyPrompt = `
            Para esta especialidad de ${specialtyInSpanish}, enfócate en estas áreas específicas:
            ${areas.map(area => `- ${area}`).join('\n')}
            
            Asegúrate de cubrir al menos 3 de estas áreas en las preguntas.
            Incluye preguntas sobre DevOps general y específicas de ${specialtyInSpanish}.
          `;
        }

        const prompt = `[Timestamp: ${timestamp}, Seed: ${randomSeed}]
          Genera 5 preguntas de opción múltiple NUEVAS Y DIFERENTES para un ${roleInSpanish} 
          con especialidad en ${specialtyInSpanish}.
          Las preguntas y respuestas DEBEN estar en español.
          
          ${specialtyPrompt}
          
          Formato JSON requerido:
          {
            "questions": [
              {
                "id": number,
                "question": "pregunta en español",
                "options": ["opción 1 en español", "opción 2 en español", "opción 3 en español", "opción 4 en español"],
                "correctAnswer": "la respuesta correcta en español (debe ser una de las opciones)",
                "difficulty": "basic|intermediate|advanced|expert|master",
                "topic": "tema de la pregunta en español"
              }
            ]
          }

          Requisitos:
          - CADA PREGUNTA DEBE SER ÚNICA Y DIFERENTE
          - Todas las preguntas y respuestas DEBEN estar en español
          - Genera exactamente 5 preguntas
          - Cada pregunta debe tener exactamente 4 opciones
          - La respuesta correcta debe ser exactamente igual a una de las opciones
          - Usa diferentes niveles de dificultad para cada pregunta
          - Las preguntas deben ser técnicas y específicas para ${specialtyInSpanish}
          - Enfócate en escenarios prácticos y casos de uso reales
          ${role === 'devops' ? '- Incluye preguntas tanto de DevOps general como específicas de la especialidad' : ''}`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'mixtral-8x7b-32768',
            messages: [{ 
              role: 'system',
              content: `Eres un experto técnico en ${roleInSpanish} especializado en ${specialtyInSpanish}.
                ${role === 'devops' ? 'Tienes amplia experiencia tanto en DevOps general como en ' + specialtyInSpanish : ''}
                Todas tus respuestas deben ser en español y específicas para esta especialidad.
                IMPORTANTE: Genera preguntas completamente diferentes a las anteriores.
                Usa el timestamp ${timestamp} y seed ${randomSeed} para asegurar variación.`
            }, {
              role: 'user',
              content: prompt
            }],
            temperature: 0.95,
            max_tokens: 2048,
            top_p: 0.9,
            frequency_penalty: 1.0, // Aumentado para reducir repeticiones
            presence_penalty: 1.0,  // Aumentado para forzar más variación
          }),
        });

        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        const parsedData = JSON.parse(content);

        // Validar formato y unicidad de las preguntas
        if (!Array.isArray(parsedData.questions) || parsedData.questions.length !== 5) {
          throw new Error('Invalid questions format');
        }

        // Verificar si alguna pregunta está repetida
        const hasRepeatedQuestions = parsedData.questions.some(
          (q: Question) => isQuestionUsed(role, specialty, q.question)
        );

        if (hasRepeatedQuestions) {
          attempts++;
          if (attempts === MAX_ATTEMPTS) {
            throw new Error('No se pudieron generar preguntas únicas después de varios intentos');
          }
          continue; // Intentar de nuevo
        }

        // Almacenar las nuevas preguntas en el caché
        parsedData.questions.forEach((q: Question) => {
          addToCache(role, specialty, q.question);
        });

        return NextResponse.json(parsedData.questions);
      } catch (error) {
        attempts++;
        if (attempts === MAX_ATTEMPTS) {
          throw error;
        }
      }
    }

    throw new Error('Failed to generate unique questions');

  } catch (error) {
    console.error('Error in questions API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate questions' },
      { status: 500 }
    );
  }
} 