import { useState } from 'react'
import { useNotionSentences } from '@/data/hooks/useNotionSentences'
import { fetchDatabaseSchema } from '@/data/services/notionApi'
import { LEVELS, TOPICS } from '@/domain/constants'

export default function NotionTestPage() {
  const [topic, setTopic] = useState<string>('')
  const [level, setLevel] = useState<string>('')
  const [schema, setSchema] = useState<unknown>(null)

  const { sentences, rawSample, loading, error } = useNotionSentences({
    topic: topic || undefined,
    level: level || undefined,
  })

  const loadSchema = async () => {
    try {
      const res = (await fetchDatabaseSchema()) as { properties: unknown }
      setSchema(res.properties)
    } catch (e: unknown) {
      setSchema({ error: e instanceof Error ? e.message : 'Unknown error' })
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Notion DB Test</h1>

      <div className="flex gap-3">
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All Topics</option>
          {TOPICS.map((t) => (
            <option key={t.id} value={t.label}>
              {t.label}
            </option>
          ))}
        </select>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All Levels</option>
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <button onClick={loadSchema} className="bg-gray-800 text-white px-4 py-2 rounded text-sm">
          DB Schema 보기
        </button>
      </div>

      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <section>
        <h2 className="text-lg font-semibold mb-2">Parsed Sentences ({sentences.length})</h2>
        <div className="space-y-2">
          {sentences.map((s) => (
            <div key={s.id} className="border rounded p-3 bg-white text-sm space-y-1">
              <p className="font-medium">{s.sentence}</p>
              <div className="flex gap-2 text-xs text-gray-500">
                <span className="bg-blue-100 px-2 py-0.5 rounded">{s.topic}</span>
                <span className="bg-green-100 px-2 py-0.5 rounded">{s.level}</span>
                <span className="bg-purple-100 px-2 py-0.5 rounded">{s.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {rawSample && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Raw Notion Response (Sample)</h2>
          <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-auto max-h-96">
            {JSON.stringify(rawSample, null, 2)}
          </pre>
        </section>
      )}

      {schema && (
        <section>
          <h2 className="text-lg font-semibold mb-2">DB Schema</h2>
          <pre className="bg-gray-900 text-yellow-300 p-4 rounded text-xs overflow-auto max-h-96">
            {JSON.stringify(schema, null, 2)}
          </pre>
        </section>
      )}
    </div>
  )
}
