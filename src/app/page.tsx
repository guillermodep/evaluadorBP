import Link from 'next/link'

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Evaluación Técnica</span>
            <span className="block text-indigo-600">para Roles Tecnológicos</span>
          </h1>
          <div className="mt-10">
            <Link href="/home" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Comenzar
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
