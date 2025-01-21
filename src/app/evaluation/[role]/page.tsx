'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  type: string;
}

export default function EvaluationPage() {
  const params = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/questions/${params.role}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error fetching questions');
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.role]); // Solo se ejecuta cuando cambia el rol

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (Object.keys(selectedAnswers).length === questions.length) {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-red-500/10 backdrop-blur-lg rounded-lg p-8 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (showResults) {
    const correctAnswers = questions.filter((q, index) => 
      selectedAnswers[index] === q.correctAnswer
    ).length;
    const percentage = (correctAnswers / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Resultados</h2>
          <div className="text-center mb-8">
            <p className="text-5xl font-bold text-white mb-4">{percentage}%</p>
            <p className="text-xl text-gray-300">
              {correctAnswers} de {questions.length} respuestas correctas
            </p>
          </div>
          <div className="space-y-6">
            {questions.map((q, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-6">
                <p className="text-white mb-4">{q.question}</p>
                <p className="text-sm">
                  <span className="text-gray-400">Tu respuesta: </span>
                  <span className={selectedAnswers[index] === q.correctAnswer ? 'text-green-400' : 'text-red-400'}>
                    {selectedAnswers[index]}
                  </span>
                </p>
                {selectedAnswers[index] !== q.correctAnswer && (
                  <p className="text-sm">
                    <span className="text-gray-400">Respuesta correcta: </span>
                    <span className="text-green-400">{q.correctAnswer}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => router.push('/home')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 shadow-xl">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">
                Pregunta {currentQuestionIndex + 1} de {questions.length}
              </h1>
              <span className="text-gray-400">
                {params.role}
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <h2 className="text-xl text-white mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full p-4 rounded-lg text-left transition-all duration-300 ${
                  selectedAnswers[currentQuestionIndex] === option
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                currentQuestionIndex === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              disabled={!selectedAnswers[currentQuestionIndex]}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                !selectedAnswers[currentQuestionIndex]
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Ver resultados' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
