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
