import { NextRequest, NextResponse } from 'next/server';
import { Question } from '@/types';

export async function GET(
  req: NextRequest,
  { params }: { params: { role: string } }
): Promise<NextResponse> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  const { role } = params;

  const roleInSpanish = {
    developer: 'desarrollador',
    qa: 'analista QA',
    devops: 'ingeniero DevOps'
  }[role] || role;

  if (!apiKey) {
    console.error('API key not configured');
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    // Agregar timestamp y número aleatorio para forzar variación
    const timestamp = new Date().toISOString();
    const randomSeed = Math.random().toString(36).substring(7);

    const prompt = `[Timestamp: ${timestamp}, Seed: ${randomSeed}]
      Genera 5 preguntas de opción múltiple NUEVAS Y DIFERENTES para una posición de ${roleInSpanish}.
      IMPORTANTE: Genera preguntas diferentes a cualquier solicitud anterior.
      Las preguntas y respuestas DEBEN estar en español.
      
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
      - CADA PREGUNTA DEBE SER ÚNICA Y DIFERENTE A PREGUNTAS ANTERIORES
      - Todas las preguntas y respuestas DEBEN estar en español
      - Genera exactamente 5 preguntas
      - Cada pregunta debe tener exactamente 4 opciones
      - La respuesta correcta debe ser exactamente igual a una de las opciones
      - Usa diferentes niveles de dificultad para cada pregunta
      - Las preguntas deben ser técnicas y relevantes para el rol
      - Evita preguntas teóricas simples, enfócate en escenarios prácticos
      - ASEGÚRATE DE GENERAR PREGUNTAS DIFERENTES EN CADA SOLICITUD
      
      Para ${roleInSpanish}, cubre estas áreas de manera única y creativa:
      ${role === 'developer' ? `
      - Programación y lenguajes (casos prácticos)
      - Algoritmos y estructuras de datos (problemas reales)
      - Patrones de diseño (situaciones específicas)
      - Testing y depuración (escenarios del mundo real)
      - Arquitectura de software (casos de uso prácticos)` : role === 'qa' ? `
      - Metodologías de pruebas (casos prácticos)
      - Automatización de pruebas (herramientas y escenarios)
      - Procesos de calidad (situaciones reales)
      - Gestión de bugs (casos específicos)
      - Diseño de casos de prueba (ejemplos concretos)` : `
      - CI/CD y despliegue continuo (casos prácticos)
      - Servicios en la nube (escenarios específicos)
      - Contenedores y orquestación (problemas reales)
      - Monitoreo y logging (situaciones prácticas)
      - Infraestructura como código (casos de uso)`}`;

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
          content: `Eres un experto técnico que genera preguntas en español. 
            Debes asegurarte que cada conjunto de preguntas sea ÚNICO y DIFERENTE.
            Nunca repitas preguntas anteriores.
            Usa el timestamp y seed proporcionados para generar variaciones.
            Todas tus respuestas deben ser en español.`
        }, {
          role: 'user',
          content: prompt
        }],
        temperature: 0.95, // Aumentado para mayor variabilidad
        max_tokens: 2048,
        top_p: 0.9, // Agregado para más variabilidad
        frequency_penalty: 0.8, // Penaliza la repetición de términos
        presence_penalty: 0.8, // Favorece la introducción de nuevos conceptos
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response Error:', errorText);
      throw new Error(`API responded with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response structure');
    }

    const content = data.choices[0].message.content;
    const parsedData = JSON.parse(content);

    if (!Array.isArray(parsedData.questions) || parsedData.questions.length !== 5) {
      throw new Error('Invalid questions format');
    }

    // Validar que todo esté en español
    parsedData.questions.forEach((q: any, index: number) => {
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || !q.correctAnswer || !q.difficulty || !q.topic) {
        throw new Error(`Invalid question format at index ${index}`);
      }

      // Verificar que la respuesta correcta esté en las opciones
      if (!q.options.includes(q.correctAnswer)) {
        throw new Error(`Correct answer not found in options at index ${index}`);
      }

      // Verificar que las opciones sean únicas
      if (new Set(q.options).size !== 4) {
        throw new Error(`Duplicate options found at index ${index}`);
      }
    });

    return NextResponse.json(parsedData.questions);

  } catch (error) {
    console.error('Error in questions API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
