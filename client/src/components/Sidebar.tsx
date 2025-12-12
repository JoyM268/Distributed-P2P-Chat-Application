import type {
	UserInterface,
	UserMessageInterface,
	ProfileInterface,
} from "@/types";
import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LogOut, SearchIcon } from "lucide-react";
import { Input } from "./ui/input";

function Sidebar({
	isOpen,
	users,
	selectUser,
	userMessage,
	profile,
	toggleLogoutWarning,
}: {
	isOpen: boolean;
	users: UserInterface[];
	selectUser: (name: string) => void;
	userMessage: UserMessageInterface | null;
	profile: ProfileInterface;
	toggleLogoutWarning: () => void;
}) {
	const [search, setSearch] = useState<string>("");

	const userSearch = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (q === "") return users;
		return users.filter((user) => user.name.toLowerCase().includes(q));
	}, [search, users]);

	return (
		<motion.div
			initial={false}
			animate={{ x: isOpen ? 0 : "-100%" }}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
			className="border-r border-gray-400 min-w-xs h-screen sticky left-0 flex flex-col overflow-hidden"
		>
			<div className="border-b border-gray-400 px-3 py-3 flex items-center justify-between">
				<div className="flex gap-3 items-center">
					<Avatar className="w-10 h-10 border border-gray-500 text-black">
						{profile.img && (
							<AvatarImage src={profile.img} alt={profile.name} />
						)}
						<AvatarFallback>
							{profile.name.charAt(0)}
						</AvatarFallback>
					</Avatar>

					<span className="font-semibold">{profile.name}</span>
				</div>

				<div
					className="rounded-full justify-center flex items-center hover:bg-gray-100 cursor-pointer p-2"
					onClick={() => toggleLogoutWarning()}
				>
					<LogOut size={20} />
				</div>
			</div>

			<div className="px-4 py-4 border-b border-gray-200">
				<div className="relative border border-gray-400 rounded-md">
					<SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
					<Input
						placeholder="Search Peers..."
						className="pl-8"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
			</div>

			<div className="px-4 pt-4 pb-2">
				<span className="text-sm font-medium">Discovered Peers</span>
			</div>

			<div className="px-4 pb-4 flex-1 overflow-y-auto">
				<div className="flex flex-col gap-2">
					{userSearch.map((user) => (
						<div
							key={user.name}
							className={`flex items-center gap-3 py-2 px-2 rounded-lg cursor-pointer ${
								user.name != userMessage?.name
									? "hover:bg-gray-100"
									: "bg-blue-500 text-gray-100"
							}`}
							onClick={() => selectUser(user.name)}
						>
							<Avatar className="w-10 h-10 text-black border border-gray-400">
								{user.img && (
									<AvatarImage
										src={user.img}
										alt={user.name}
									/>
								)}
								<AvatarFallback>
									{user.name.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<span className="font-semibold">
									{user.name}
								</span>
								<span
									className={`text-xs ${
										user.name === userMessage?.name
											? "text-white"
											: user.status == "Online"
											? "text-green-600"
											: "text-red-600"
									}`}
								>
									{user.status}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</motion.div>
	);
}

export default Sidebar;
