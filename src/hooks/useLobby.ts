import { useCallback, useRef, useState } from 'react'
import useWebSocket from '@/hooks/useWebSocket'
import type { ChatMessage } from '@/models/ChatMessage'
import type { InboundChatEvent, InboundEvent, InboundMessageListEvent, InboundPlayerListEvent, OutboundConnectEvent, OutboundEvent, PlayerListEntry } from '@/models/Events'
import type { Player } from '@/models/Player'

interface UseLobbyProps {
  url: string
}

const parseEventData = <T,>(rawData: InboundEvent['data']): T => {
  return (typeof rawData === 'string' ? JSON.parse(rawData) : rawData) as T
}

const normalizeMessage = (message: ChatMessage): ChatMessage => ({
  ...message,
  time: new Date(message.time),
})

const normalizePlayer = (player: PlayerListEntry | string): Player => {
  if (typeof player === 'string') {
    return { id: player, name: player }
  }

  return {
    id: player.player_id ?? player.playerId ?? player.name,
    name: player.name,
  }
}

export default function useLobby({ url }: UseLobbyProps) {
  const [playerName, setPlayerName] = useState<string | null>(null)
  const [playerList, setPlayerList] = useState<Player[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const connectionIdsRef = useRef<{ playerId?: string; roomId?: string }>({})

  const handleLobbyEvent = useCallback((event: InboundEvent) => {
    console.log('Received:', event)
    const playerId = event.player_id ?? event.playerId
    const roomId = event.room_id ?? event.roomId

    if (playerId || roomId) {
      connectionIdsRef.current = {
        playerId: playerId ?? connectionIdsRef.current.playerId,
        roomId: roomId ?? connectionIdsRef.current.roomId,
      }
    }

    switch (event.type) {
      case 'chat': {
        const chatEvent = parseEventData<InboundChatEvent>(event.data)
        setChatMessages((current) => [
          ...current,
          {
            time: new Date(event.time ?? Date.now()),
            name: chatEvent.name,
            message: chatEvent.message,
          },
        ])
        break
      }
      case 'connect': {
        const connectEvent = parseEventData<OutboundConnectEvent>(event.data)
        setPlayerName(connectEvent.name)
        break
      }
      case 'connect-success':
      case 'health':
        break
      case 'message': {
        const messageEvent = parseEventData<InboundMessageListEvent>(event.data)
        setChatMessages(messageEvent.messages.map(normalizeMessage))
        break
      }
      case 'player':
      case 'player-list': {
        const playerEvent = parseEventData<InboundPlayerListEvent>(event.data)
        setPlayerList(playerEvent.players.map(normalizePlayer))
        break
      }
      default:
        console.warn('Unknown event type:', event.type)
    }
  }, [])

  const handleSocketOpen = useCallback(() => {
    console.log('WebSocket connected')
  }, [])

  const handleSocketClose = useCallback((event: CloseEvent) => {
    console.log('WebSocket closed:', event)
  }, [])

  const { send } = useWebSocket({
    url,
    onMessageReceived: handleLobbyEvent,
    onOpen: handleSocketOpen,
    onClose: handleSocketClose,
  })

  const sendLobbyEvent = useCallback((event: OutboundEvent, includeConnectionIds = true) => {
    if (!includeConnectionIds) {
      send(event)
      return
    }

    send({
      ...event,
      player_id: connectionIdsRef.current.playerId,
      room_id: connectionIdsRef.current.roomId,
    })
  }, [send])

  const joinLobby = useCallback((name: string) => {
    connectionIdsRef.current = {}
    setPlayerName(name)
    sendLobbyEvent({ type: 'connect', data: { name } as OutboundConnectEvent }, false)
  }, [sendLobbyEvent])

  const sendChatMessage = useCallback((message: string) => {
    if (!playerName) {
      return
    }

    sendLobbyEvent({
      type: 'chat',
      data: {
        message,
        name: playerName,
      },
    })
  }, [playerName, sendLobbyEvent])

  return {
    chatMessages,
    joinLobby,
    playerList,
    playerName,
    sendChatMessage,
  }
}
