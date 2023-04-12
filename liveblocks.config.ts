import { LiveList, createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

type Presence = {
	isTyping: boolean;
};

type Storage = {
	todos: LiveList<{ text: string }>;
};

const client = createClient({
	publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCK_API_KEY,
});

export const {
	suspense: {
		RoomProvider,
		useOthers,
		useUpdateMyPresence,
		useStorage,
		useMutation,
	},
} = createRoomContext<Presence, Storage>(client);
