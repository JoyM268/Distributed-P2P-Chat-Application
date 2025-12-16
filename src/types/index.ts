export interface messageInterface {
	sent: boolean;
	content: string;
	time: string;
}

export interface UserMessageInterface {
	uid: string;
	name: string;
	status: "Online" | "Offline";
	img?: string | null;
	message: messageInterface[];
}

export interface FriendProfile {
	uid: string;
	name?: string;
	username?: string;
	avatar?: string;
	status?: string;
	[key: string]: any;
}

export interface WebRTCMessage {
	senderId: string;
	receiverId?: string;
	content: string;
	timestamp: number;
}
