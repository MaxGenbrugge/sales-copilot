'use client'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">🚀 Welkom bij Sales Copilot</h1>
      <p className="mb-6 max-w-xl">
        Start hier je AI Sales-assistent. Ga naar de testpagina of log binnenkort in om je leads te genereren.
      </p>
      <a
        href="/test"
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
      >
        Ga naar testpagina
      </a>
    </main>
  )
}
