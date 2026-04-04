import type { OutboundEvent } from '@/models/Events';
import { useEffect, useRef, useCallback } from 'react';

export interface useWebSocketProps {
	url: string;
	onMessageReceived: (data: any) => void;
	onOpen: () => void;
	onClose: (event: CloseEvent) => void;
	reconnect?: boolean;
}

const useWebSocket = (props: useWebSocketProps) => {
  const { 
		url, 
		onMessageReceived, 
		onOpen, 
		onClose, 
		reconnect = true 
	} = props;
  const wsRef = useRef<WebSocket>(null);
  const reconnectTimer = useRef<number>(0);
  const attemptRef = useRef(0);

  const connect = useCallback(() => {
    const socket = new WebSocket(url);
    wsRef.current = socket;

    socket.onopen = () => {
      attemptRef.current = 0;
      onOpen();
    };

    socket.onmessage = (event) => {
      onMessageReceived(JSON.parse(event.data));
    };

    socket.onclose = (event) => {
      onClose(event);
      if (reconnect && event.code !== 1000) {
        scheduleReconnect();
      }
    };

    socket.onerror = () => socket.close();
  }, [url, onMessageReceived, onOpen, onClose, reconnect]);
		

	const scheduleReconnect = useCallback(() => {
    const attempt = attemptRef.current;
    if (attempt >= 10) return; // stop after 10 attempts

    const baseDelay = Math.min(1000 * 2 ** attempt, 30000);
    const jitter = Math.random() * 1000;
    const delay = baseDelay + jitter;

    reconnectTimer.current = setTimeout(() => {
      attemptRef.current += 1;
      connect();
    }, delay);
	}, [connect]);

	useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      // wsRef.current?.close(1000, "hook cleanup");
    };
  }, [connect]);

  const send = useCallback((data: OutboundEvent) => {
		data.playerId = localStorage.getItem('mw2_player_id') || undefined;
		data.roomId = localStorage.getItem('mw2_room_id') || undefined;
		data.data = JSON.stringify(data.data);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return { send, wsRef };
}

export default useWebSocket;
