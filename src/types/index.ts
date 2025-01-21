export type Difficulty = 'basic' | 'intermediate' | 'advanced' | 'expert' | 'master';

export type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: Difficulty;
};

export type ExpertiseLevel = 'novato' | 'principiante' | 'competente' | 'proficiente' | 'experto';

export interface EvaluationResult {
  level: ExpertiseLevel;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  description: string;
} 