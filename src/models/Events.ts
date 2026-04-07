import type { ChatMessage } from '@/models/ChatMessage'

export interface InboundEvent {
	type: string;
	data: string | Record<string, unknown>;
	time?: string;
	playerId?: string;
	roomId?: string;
	player_id?: string;
	room_id?: string;
}

export interface OutboundEvent {
	type: string;
	data: unknown;
	player_id?: string;
	room_id?: string;
	time?: string;
}

export interface InboundChatEvent extends ChatMessage {
}

export interface InboundPlayerListEvent {
	players: Array<PlayerListEntry | string>;
}

export interface InboundMessageListEvent {
	messages: ChatMessage[];
}

export interface OutboundConnectEvent {
	name: string;
}

export interface PlayerListEntry {
	player_id?: string;
	playerId?: string;
	name: string;
}
