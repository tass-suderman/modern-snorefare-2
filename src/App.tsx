import { useState, useEffect } from 'react'
import LeftPane from '@/components/LeftPane'
import RightPane from '@/components/RightPane'
import NamePrompt from '@/components/NamePrompt'
import TooNarrow from '@/components/TooNarrow'
import ChatWindow from '@/components/ChatWindow'
import useWebSocket from '@/hooks/useWebSocket'
import type { Player } from '@/models/Player'
import type { ChatMessage } from '@/models/ChatMessage'
import type { 
	InboundChatEvent, 
	InboundEvent, 
	InboundPlayerListEvent, 
	InboundMessageListEvent, 
	OutboundConnectEvent, 
	OutboundEvent 
} from './models/Events'

export default function App() {
  const [playerName, setPlayerName] = useState<string | null>("")
  const [isTooNarrow, setIsTooNarrow] = useState(() => window.innerWidth < window.innerHeight)
  const [messages, setMessages] = useState<ChatMessage[]>([])
	const [players, setPlayers] = useState<Player[]>([{ name: playerName || 'Player' }])

	const onMessageReceived = (data: InboundEvent) => {
		console.log('Received:', data)
		const type = data.type;
		localStorage.setItem('mw2_player_id', data.playerId)
		localStorage.setItem('mw2_room_id', data.roomId)
		switch (type) {
			case 'chat':
				const chatEvent = JSON.parse(data.data) as InboundChatEvent;
				setMessages([...messages, {time: new Date(data.time), name: chatEvent.name, message: chatEvent.message }])
				break;
			case 'connect':
				const connectEvent = JSON.parse(data.data) as OutboundConnectEvent;
				setPlayerName(connectEvent.name); 
				// TODO do something if this fails. maybe add a random number suffix if player names clash on BE
				break;
			case 'health': 
				// I dont think we want this yet. consider later
				break;
			case 'message':
				const messageEvent = JSON.parse(data.data) as InboundMessageListEvent;
				setMessages(messageEvent.messages);
				break;
			case 'player':
				const playerEvent = JSON.parse(data.data) as InboundPlayerListEvent;
				setPlayers(playerEvent.players.map(name => ({ name })));
				break;
			default:
				console.warn('Unknown event type:', type);
				break;
		}
	}

	const onOpen = () => {
		console.log('WebSocket connected')
	}

	const onClose = (event: CloseEvent) => {
		console.log('WebSocket closed:', event)
	}

	const url = 'ws://localhost:8080/'

	const socket = useWebSocket({ url, onMessageReceived, onOpen, onClose });

	const onMessageSend = (data: OutboundEvent) => {
		console.log('Sending:', data)
		socket.send(data);
	}

  // Check if screen is square or wider (1:1 ratio or wider)
  useEffect(() => {
    const checkRatio = () => {
      setIsTooNarrow(window.innerWidth < window.innerHeight)
    }
    window.addEventListener('resize', checkRatio)
    return () => window.removeEventListener('resize', checkRatio)
  }, [])

  const handleNameSubmit = (name: string) => {
    setPlayerName(name)
		socket.send({ type: 'connect', data: JSON.stringify({ name } as OutboundConnectEvent) } as OutboundEvent)
  }

  if (isTooNarrow) {
    return <TooNarrow />
  }

  return (
    <div className="mw2-lobby">
      {!playerName && <NamePrompt onSubmit={handleNameSubmit} />}
      <LeftPane />
      <RightPane players={players} />
      {playerName && <ChatWindow messages={messages} sendMessage={(message) => onMessageSend({type: 'chat', data: JSON.stringify({message: message, name: playerName, time: new Date().toISOString()})})}/>}
    </div>
  )
}
