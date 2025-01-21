'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Question, ExpertiseLevel, EvaluationResult } from '@/types';
import { motion } from 'framer-motion';

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

export default function EvaluationPage({ 
  params 
}: { 
  params: { 
    role: string;
    specialty: string;
  } 
}) {
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
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/questions/${params.role}/${params.specialty}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al cargar las preguntas');
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Formato de preguntas inválido');
        }

        data.forEach((question: any, index: number) => {
          if (!question.question || 
              !Array.isArray(question.options) || 
              question.options.length !== 4 ||
              !question.correctAnswer ||
              !question.difficulty) {
            throw new Error(`Pregunta ${index + 1} tiene un formato inválido`);
          }
        });

        setQuestions(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar las preguntas. Por favor, intenta de nuevo.');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [params.role, params.specialty]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
    } else {
      const score = newAnswers.reduce((acc, curr, idx) => {
        return acc + (curr === questions[idx].correctAnswer ? 1 : 0);
      }, 0) / questions.length;

      setResult(calculateExpertiseLevel(score));
    }
  };

  const handleCancel = () => {
    if (window.confirm('¿Estás seguro que deseas cancelar la evaluación? Perderás todo el progreso.')) {
      router.push('/home');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div>Cargando preguntas...</div>
      <button
        onClick={handleCancel}
        className="mt-4 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        Cancelar
      </button>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-red-500">{error}</div>
      <button
        onClick={handleCancel}
        className="mt-4 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        Volver al inicio
      </button>
    </div>
  );

  if (!questions || questions.length === 0 || !questions[currentQuestion]) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-red-500">No se pudieron cargar las preguntas correctamente</div>
        <button
          onClick={handleCancel}
          className="mt-4 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

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

  const currentQ = questions[currentQuestion];
  if (!currentQ) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg relative">
        <motion.button
          onClick={handleCancel}
          className="absolute top-4 right-4 px-4 py-2 
            flex items-center gap-2 
            text-gray-600 font-medium
            bg-white rounded-lg
            border border-gray-200
            hover:bg-gray-50 hover:text-red-600 hover:border-red-100
            active:bg-gray-100
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-red-100"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
          Cancelar
        </motion.button>

        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">
            Pregunta {currentQuestion + 1} de {questions.length}
          </p>
          <div className="flex items-center gap-2">
            <span className={`
              px-3 py-1 text-sm font-medium rounded-full
              ${currentQ.difficulty === 'basic' ? 'bg-green-100 text-green-700' :
                currentQ.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                currentQ.difficulty === 'advanced' ? 'bg-yellow-100 text-yellow-700' :
                currentQ.difficulty === 'expert' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'}
            `}>
              {currentQ.difficulty.charAt(0).toUpperCase() + currentQ.difficulty.slice(1)}
            </span>
            <span className="text-sm text-gray-500">{currentQ.topic}</span>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-6">{currentQ.question}</h2>

        <div className="space-y-4">
          {currentQ.options.map((option, index) => (
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