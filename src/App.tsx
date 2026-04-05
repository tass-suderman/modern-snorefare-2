import { useState, useEffect } from 'react'
import LeftPane from '@/components/LeftPane'
import RightPane from '@/components/RightPane'
import NamePrompt from '@/components/NamePrompt'
import TooNarrow from '@/components/TooNarrow'
import ChatWindow from '@/components/ChatWindow'
import useLobby from '@/hooks/useLobby'

export default function App() {
  const [isTooNarrow, setIsTooNarrow] = useState(() => window.innerWidth < window.innerHeight)
  const { chatMessages, joinLobby, playerList, playerName, sendChatMessage } = useLobby({ url: 'ws://localhost:8080/' })

  // Check if screen is square or wider (1:1 ratio or wider)
  useEffect(() => {
    const checkRatio = () => {
      setIsTooNarrow(window.innerWidth < window.innerHeight)
    }
    window.addEventListener('resize', checkRatio)
    return () => window.removeEventListener('resize', checkRatio)
  }, [])

  if (isTooNarrow) {
    return <TooNarrow />
  }

  return (
    <div className="mw2-lobby">
      {!playerName && <NamePrompt onSubmit={joinLobby} />}
      <LeftPane />
      <RightPane players={playerList} />
      {playerName && <ChatWindow messages={chatMessages} sendMessage={sendChatMessage} />}
    </div>
  )
}
