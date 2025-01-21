'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const roles = [
  {
    id: 'developer',
    title: 'Desarrollador',
    icon: '👨‍💻',
    gradient: 'from-blue-500 to-blue-600',
    description: 'Desarrollo de software y arquitectura'
  },
  {
    id: 'qa',
    title: 'QA',
    icon: '🔍',
    gradient: 'from-purple-500 to-purple-600',
    description: 'Testing y control de calidad'
  },
  {
    id: 'devops',
    title: 'DevOps',
    icon: '⚙️',
    gradient: 'from-emerald-500 to-emerald-600',
    description: 'Infraestructura y operaciones'
  }
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
      {/* Fondo con grid */}
      <div className="fixed inset-0 bg-grid opacity-5"></div>
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Evaluación Técnica
          </h1>
          <p className="text-gray-600">
            Selecciona tu rol para comenzar
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-100 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <button
                onClick={() => router.push(`/evaluation/${role.id}`)}
                className={`
                  relative w-full bg-gradient-to-br ${role.gradient}
                  rounded-xl p-8
                  shadow-lg
                  transition-all duration-300
                  group-hover:shadow-xl
                  flex flex-col items-center
                  overflow-hidden
                  backdrop-blur-sm
                `}
              >
                <div className="absolute inset-0 bg-white/90"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-4xl mb-4 transform transition-transform duration-300 group-hover:scale-110">
                    {role.icon}
                  </span>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {role.title}
                  </h2>
                  <p className="text-sm text-gray-600 text-center mb-6">
                    {role.description}
                  </p>
                  <span className={`
                    inline-flex items-center text-sm font-medium
                    bg-gradient-to-r ${role.gradient} text-transparent bg-clip-text
                    group-hover:opacity-80 transition-opacity
                  `}>
                    Comenzar
                    <svg 
                      className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
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
              </button>
            </motion.div>
          ))}
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-gray-500">
            Desarrollado con ❤️ por el equipo de evaluación técnica
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
