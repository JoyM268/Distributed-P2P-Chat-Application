export interface UserInterface {
	name: string;
	status: "Online" | "Offline";
	img?: string | null;
}

export interface ProfileInterface {
	name: string;
	img: string | null;
}

export interface messageInterface {
	sent: boolean;
	content: string;
	time: string;
}

export interface UserMessageInterface {
	name: string;
	status: "Online" | "Offline";
	img?: string | null;
	message: messageInterface[];
}
