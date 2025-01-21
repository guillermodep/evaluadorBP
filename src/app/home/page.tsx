'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

const roles = [
  { 
    id: 'developer', 
    title: 'Desarrollador', 
    icon: '👨‍💻',
    specialties: [
      { id: 'backend', title: 'Backend Developer', icon: '⚙️' },
      { id: 'frontend', title: 'Frontend Developer', icon: '🎨' },
      { id: 'fullstack', title: 'Fullstack Developer', icon: '🛠️' }
    ]
  },
  { 
    id: 'qa', 
    title: 'QA', 
    icon: '🔍',
    specialties: [
      { id: 'quality-assurance', title: 'Quality Assurance', icon: '✅' },
      { id: 'quality-engineer', title: 'Quality Engineer', icon: '🔧' }
    ]
  },
  { 
    id: 'devops', 
    title: 'DevOps', 
    icon: '⚙️',
    specialties: [
      { id: 'devops', title: 'DevOps Engineer', icon: '🔄' },
      { id: 'devsecops', title: 'DevSecOps Engineer', icon: '🔒' },
      { id: 'platform', title: 'Platform Engineer', icon: '🏗️' }
    ]
  }
];

const buttonVariants = {
  initial: { 
    scale: 1,
    y: 0,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  hover: { 
    scale: 1.05,
    y: -5,
    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15)',
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: { 
    scale: 0.95,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  }
};

const iconVariants = {
  initial: { 
    scale: 1,
    rotate: 0 
  },
  hover: { 
    scale: 1.2,
    rotate: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};

export default function HomePage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleSpecialtySelect = (roleId, specialtyId) => {
    router.push(`/evaluation/${roleId}/${specialtyId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <motion.h1 
          className="text-4xl font-bold text-center mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Evaluación Técnica
        </motion.h1>
        <motion.p 
          className="text-center text-gray-600 mb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {selectedRole ? 'Selecciona tu especialidad' : 'Selecciona tu rol para comenzar'}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {!selectedRole ? (
            // Mostrar selección de roles
            roles.map((role, index) => (
              <motion.button
                key={role.id}
                onClick={() => handleRoleSelect(role)}
                className="bg-white rounded-xl p-8
                  border-2 border-gray-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                custom={index}
                animate={{ 
                  opacity: [0, 1],
                  y: [50, 0]
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
              >
                <div className="flex flex-col items-center gap-4">
                  <motion.span 
                    className="text-4xl"
                    variants={iconVariants}
                  >
                    {role.icon}
                  </motion.span>
                  <span className="text-lg font-medium text-gray-800">
                    {role.title}
                  </span>
                </div>
              </motion.button>
            ))
          ) : (
            // Mostrar selección de especialidades
            <>
              <motion.button
                onClick={() => setSelectedRole(null)}
                className="absolute top-8 left-8 text-gray-600 hover:text-gray-800"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Volver
              </motion.button>
              
              {selectedRole.specialties.map((specialty, index) => (
                <motion.button
                  key={specialty.id}
                  onClick={() => handleSpecialtySelect(selectedRole.id, specialty.id)}
                  className="bg-white rounded-xl p-8
                    border-2 border-gray-100
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  custom={index}
                  animate={{ 
                    opacity: [0, 1],
                    y: [50, 0]
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <div className="flex flex-col items-center gap-4">
                    <motion.span 
                      className="text-4xl"
                      variants={iconVariants}
                    >
                      {specialty.icon}
                    </motion.span>
                    <span className="text-lg font-medium text-gray-800">
                      {specialty.title}
                    </span>
                  </div>
                </motion.button>
              ))}
            </>
          )}
        </div>

        <motion.footer 
          className="text-center mt-12 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          Desarrollado con ❤️ por el equipo de evaluación técnica
        </motion.footer>
      </div>
    </div>
  );
}
