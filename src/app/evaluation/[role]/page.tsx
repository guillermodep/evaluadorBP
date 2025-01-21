'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Question, ExpertiseLevel, EvaluationResult } from '@/types';

const calculateExpertiseLevel = (score: number): EvaluationResult => {
  const levels: Record<ExpertiseLevel, { min: number; description: string }> = {
    novato: {
      min: 0,
      description: 'Estás comenzando tu viaje en este campo. ¡Hay mucho por aprender!'
    },
    principiante: {
      min: 0.2,
      description: 'Tienes conocimientos básicos. Sigue practicando para mejorar.'
    },
    competente: {
      min: 0.4,
      description: 'Tienes un buen dominio de las habilidades fundamentales.'
    },
    proficiente: {
      min: 0.6,
      description: 'Manejas conceptos avanzados y tienes experiencia sólida.'
    },
    experto: {
      min: 0.8,
      description: '¡Excelente! Tienes un dominio excepcional de la materia.'
    }
  };

  let level: ExpertiseLevel = 'novato';
  for (const [key, value] of Object.entries(levels)) {
    if (score >= value.min) {
      level = key as ExpertiseLevel;
    }
  }

  return {
    level,
    score: score * 100,
    correctAnswers: Math.round(score * 5),
    totalQuestions: 5,
    description: levels[level].description
  };
};

export default function EvaluationPage({ params }: { params: { role: string } }) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/questions/${params.role}`);
        if (!response.ok) throw new Error('Error al cargar las preguntas');
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las preguntas. Por favor, intenta de nuevo.');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [params.role]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
    } else {
      // Calcular resultado
      const score = newAnswers.reduce((acc, curr, idx) => {
        return acc + (curr === questions[idx].correctAnswer ? 1 : 0);
      }, 0) / questions.length;

      setResult(calculateExpertiseLevel(score));
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando preguntas...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (result) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Resultado de la Evaluación</h2>
        <div className="text-center mb-8">
          <p className="text-2xl font-semibold text-blue-600 mb-2">
            Nivel: {result.level.charAt(0).toUpperCase() + result.level.slice(1)}
          </p>
          <p className="text-xl mb-4">Puntuación: {result.score.toFixed(1)}%</p>
          <p className="text-gray-600 mb-4">
            Respuestas correctas: {result.correctAnswers} de {result.totalQuestions}
          </p>
          <p className="text-gray-700">{result.description}</p>
        </div>
        <button
          onClick={() => router.push('/home')}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">
            Pregunta {currentQuestion + 1} de {questions.length}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Dificultad: {questions[currentQuestion].difficulty}
          </p>
          <h2 className="text-xl font-semibold mb-6">{questions[currentQuestion].question}</h2>
        </div>

        <div className="space-y-4">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
