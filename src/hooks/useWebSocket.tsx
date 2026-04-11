import type { OutboundEvent } from '@/models/Events';
import { useEffect, useRef, useCallback, useState } from 'react';

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
  const [isOpen, setIsOpen] = useState(false);

  const connect = useCallback(() => {
    const socket = new WebSocket(url);
    wsRef.current = socket;

    socket.onopen = () => {
      attemptRef.current = 0;
      setIsOpen(true);
      onOpen();
    };

    socket.onmessage = (event) => {
      onMessageReceived(JSON.parse(event.data));
    };

    socket.onclose = (event) => {
      setIsOpen(false);
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
		const payload: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(data)) {
			if (value !== undefined) {
				payload[key] = value;
			}
		}

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);

  return { isOpen, send, wsRef };
}

export default useWebSocket;
