'use client';

import { useRouter } from 'next/navigation';

const roles = [
  { id: 'developer', title: 'Desarrollador', icon: '👨‍💻' },
  { id: 'qa', title: 'QA', icon: '🔍' },
  { id: 'devops', title: 'DevOps', icon: '⚙️' }
];

export default function HomePage() {
  const router = useRouter();

  return (
    <main style={{minHeight: '100vh'}} className="flex flex-col items-center justify-center p-8">
      <div style={{maxWidth: '1000px'}} className="w-full">
        <header className="text-center mb-12">
          <h1 style={{fontSize: '2.5rem'}} className="font-bold mb-4">
            Evaluación Técnica
          </h1>
          <p style={{color: '#666'}}>
            Selecciona tu rol para comenzar
          </p>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          margin: '0 auto',
          maxWidth: '900px'
        }}>
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => router.push(`/evaluation/${role.id}`)}
              style={{
                padding: '2rem',
                background: 'white',
                borderRadius: '1rem',
                border: '2px solid #eee',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#3b82f6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#eee';
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <span style={{fontSize: '3rem'}}>{role.icon}</span>
                <span style={{
                  fontSize: '1.2rem',
                  fontWeight: '500',
                  color: '#333'
                }}>
                  {role.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        <footer style={{
          textAlign: 'center',
          marginTop: '3rem',
          color: '#666'
        }}>
          Desarrollado con ❤️ por el equipo de evaluación técnica
        </footer>
      </div>
    </main>
  );
}
