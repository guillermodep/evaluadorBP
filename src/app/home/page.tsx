'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const roles = [
  {
    id: 'developer',
    title: 'Desarrollador',
    icon: '👨‍💻',
    gradient: 'from-blue-500 via-blue-600 to-blue-700',
    shadow: 'shadow-blue-500/20',
    description: 'Desarrollo de software y arquitectura'
  },
  {
    id: 'qa',
    title: 'QA',
    icon: '🔍',
    gradient: 'from-purple-500 via-purple-600 to-purple-700',
    shadow: 'shadow-purple-500/20',
    description: 'Testing y control de calidad'
  },
  {
    id: 'devops',
    title: 'DevOps',
    icon: '⚙️',
    gradient: 'from-emerald-500 via-emerald-600 to-emerald-700',
    shadow: 'shadow-emerald-500/20',
    description: 'Infraestructura y operaciones'
  }
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-6">
      {/* Efecto de luz de fondo */}
      <div className="fixed inset-0 bg-grid opacity-5"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center mb-16"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 text-transparent bg-clip-text">
          Evaluación Técnica
        </h1>
      </motion.div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        {roles.map((role, index) => (
          <motion.button
            key={role.id}
            onClick={() => router.push(`/evaluation/${role.id}`)}
            className={`group flex flex-col items-center p-8 rounded-2xl 
              bg-gradient-to-b ${role.gradient} ${role.shadow}
              shadow-lg backdrop-blur-sm
              hover:shadow-xl hover:-translate-y-1
              transition-all duration-300
              border border-white/10`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {role.icon}
            </span>
            <h2 className="text-xl font-semibold text-white mb-2">
              {role.title}
            </h2>
            <p className="text-sm text-white/70 mb-6 text-center">
              {role.description}
            </p>
            <span className="inline-flex items-center text-sm text-white/90 font-medium">
              Comenzar evaluación
              <svg 
                className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
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
          </motion.button>
        ))}
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 mt-16 text-center"
      >
        <p className="text-sm text-gray-500">
          Desarrollado con ❤️ por el equipo de evaluación técnica
        </p>
      </motion.footer>
    </div>
  );
}
