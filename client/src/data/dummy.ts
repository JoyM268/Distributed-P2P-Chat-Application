import type {
	UserInterface,
	ProfileInterface,
	UserMessageInterface,
} from "@/types";

export const userData: UserInterface[] = [
	{
		name: "Joy Mascarenhas",
		status: "Online",
		img: "https://avatars.githubusercontent.com/u/125041935?v=4",
	},
	{
		name: "Abdul Basith",
		status: "Offline",
		img: "https://media.licdn.com/dms/image/v2/D5635AQHCjP7XciGh5Q/profile-framedphoto-shrink_400_400/B56Zpxehb_I0Ag-/0/1762840418274?e=1766041200&v=beta&t=3JEmlFxPNlErbh-D1RJn6TDo6EzO6qLUHH6WeHe-u80",
	},
	{
		name: "Pratham M",
		status: "Online",
		img: "https://prathammanabasannanavar.github.io/Profile/assets/profilePhoto1.jpg",
	},
	{
		name: "KK Sagar",
		status: "Offline",
		img: null,
	},
	{
		name: "Bhanushankar",
		status: "Online",
		img: null,
	},
];

export const messageData: UserMessageInterface[] = [
	{
		name: "Pratham M",
		status: "Online",
		img: "https://prathammanabasannanavar.github.io/Profile/assets/profilePhoto1.jpg",
		message: [
			{
				sent: true,
				content: "Hi Pratham",
				time: "10:30 AM",
			},
			{
				sent: false,
				content: "Hi Joy",
				time: "10:33 AM",
			},
			{
				sent: true,
				content: "How are you ?",
				time: "10:38 AM",
			},
			{
				sent: true,
				content: "Fine",
				time: "10:38 AM",
			},
		],
	},

	{
		name: "Abdul Basith",
		status: "Offline",
		img: "https://media.licdn.com/dms/image/v2/D5635AQHCjP7XciGh5Q/profile-framedphoto-shrink_400_400/B56Zpxehb_I0Ag-/0/1762840418274?e=1766041200&v=beta&t=3JEmlFxPNlErbh-D1RJn6TDo6EzO6qLUHH6WeHe-u80",
		message: [
			{
				sent: true,
				content: "Hi Abdul",
				time: "10:30 AM",
			},
			{
				sent: false,
				content: "Hi Joy",
				time: "10:33 AM",
			},
		],
	},
	{
		name: "KK Sagar",
		status: "Offline",
		img: null,
		message: [],
	},
];

export const profileData: ProfileInterface = {
	name: "Gouse Azam",
	img: "https://github.com/shadcn.png",
};
