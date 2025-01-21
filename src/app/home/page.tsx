'use client';

import { useRouter } from 'next/navigation';

const roles = [
  {
    id: 'developer',
    title: 'Desarrollador',
    description: 'Evaluación de habilidades en desarrollo de software, arquitectura y mejores prácticas',
    icon: '👨‍💻'
  },
  {
    id: 'qa',
    title: 'QA',
    description: 'Evaluación de habilidades en pruebas, automatización y control de calidad',
    icon: '🔍'
  },
  {
    id: 'devops',
    title: 'DevOps',
    description: 'Evaluación de habilidades en infraestructura, CI/CD y operaciones',
    icon: '⚙️'
  }
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold text-white mb-4">
            Evaluación Técnica
          </h1>
          <p className="text-xl text-gray-300">
            Selecciona tu rol para comenzar la evaluación
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => router.push(`/evaluation/${role.id}`)}
              className="group cursor-pointer"
            >
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="text-5xl mb-2">{role.icon}</div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-3">
                      {role.title}
                    </h2>
                    <p className="text-gray-300 text-sm">
                      {role.description}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <span className="inline-flex items-center text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                    Comenzar evaluación
                    <svg 
                      className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M13 7l5 5m0 0l-5 5m5-5H6" 
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center animate-fade-in">
          <p className="text-gray-400">
            Desarrollado con ❤️ por el equipo de evaluación técnica
          </p>
        </div>
      </div>
    </div>
  );
}
