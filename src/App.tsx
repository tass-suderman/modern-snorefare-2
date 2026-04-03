import { useState, useEffect } from 'react'
import LeftPane from '@/components/LeftPane'
import RightPane from '@/components/RightPane'
import NamePrompt from '@/components/NamePrompt'
import TooNarrow from '@/components/TooNarrow'

export interface Player {
  id: string
  name: string
}

export default function App() {
  const [playerName, setPlayerName] = useState<string | null>(
    () => localStorage.getItem('mw2_player_name'),
  )
  const [isTooNarrow, setIsTooNarrow] = useState(
    () => window.innerWidth < window.innerHeight,
  )

  // Check if screen is square or wider (1:1 ratio or wider)
  useEffect(() => {
    const checkRatio = () => {
      setIsTooNarrow(window.innerWidth < window.innerHeight)
    }
    window.addEventListener('resize', checkRatio)
    return () => window.removeEventListener('resize', checkRatio)
  }, [])

  const handleNameSubmit = (name: string) => {
    localStorage.setItem('mw2_player_name', name)
    setPlayerName(name)
  }

  // Build players list — current user
  const players: Player[] = playerName
    ? [{ id: 'self', name: playerName }]
    : []

  if (isTooNarrow) {
    return <TooNarrow />
  }

  return (
    <div className="mw2-lobby">
      {!playerName && <NamePrompt onSubmit={handleNameSubmit} />}
      <LeftPane />
      <RightPane players={players} />
    </div>
  )
}
