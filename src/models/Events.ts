import type { ChatMessage } from '@/models/ChatMessage'

export interface InboundEvent {
	type: string;
	data: string;
	time: string;
	playerId: string;
	roomId: string;
}

export interface OutboundEvent {
	type: string;
	data: string;
	playerId?: string;
	roomId?: string;
}

export interface InboundChatEvent extends ChatMessage {
}

export interface InboundPlayerListEvent {
	players: string[];
}

export interface InboundMessageListEvent {
	messages: ChatMessage[];
}

export interface OutboundConnectEvent {
	name: string;
}
