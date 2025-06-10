
'use client'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">🚀 Welkom bij Sales Copilot</h1>
      <p className="mb-6 max-w-xl">
        Start hier je AI Sales-assistent. Ga naar de loginpagina om je leads te genereren of kies een plan. 
      </p>

      <div className="flex gap-4">
        <a
          href="/login"
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Log in
        </a>
         <a
          href="/pricing"
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Pricing
        </a>
      </div>
    </main>
  )
}
