import { useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import NotionTestScreen from './screens/NotionTestScreen'

export default function App() {
  const [showTest, setShowTest] = useState(false)

  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      {/* 테스트 토글 버튼 */}
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999 }}>
        <button
          onClick={() => setShowTest(!showTest)}
          style={{
            background: '#000',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 14,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          {showTest ? 'Home' : 'Notion Test'}
        </button>
      </div>

      {showTest ? (
        <NotionTestScreen />
      ) : (
        <div className="flex items-center justify-center p-6 min-h-screen">
          <HomeScreen />
        </div>
      )}
    </div>
  )
}
