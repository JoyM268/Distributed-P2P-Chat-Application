import { Input } from "./ui/input";
import { SearchIcon, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import type { FriendProfile } from "@/types";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";

export default function DiscoveredPeers({
	selectUser,
	selectedFriendId,
	friends,
	loading,
	toggleAddPeers,
}: {
	selectUser: (uid: string) => void;
	selectedFriendId?: string | null;
	friends: FriendProfile[];
	loading: boolean;
	toggleAddPeers: () => void;
}) {
	const [search, setSearch] = useState<string>("");

	const userSearch = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (q === "") return friends;

		return friends.filter((friend) =>
			(friend.name || "").toLowerCase().includes(q)
		);
	}, [search, friends]);

	return (
		<>
			<div className="px-4 py-4 border-b border-gray-200">
				<div className="relative border border-gray-400 rounded-md">
					<SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
					<Input
						placeholder="Search Friends..."
						className="pl-8"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
			</div>

			<div className="px-4 pt-4 pb-2">
				<span className="text-sm font-medium text-gray-800">
					My Friends
				</span>
			</div>

			<div className="px-4 pb-4 flex-1 overflow-y-auto">
				{loading && (
					<div className="flex justify-center pt-24 gap-2">
						<Spinner />
						<div className="text-sm text-gray-500">Loading...</div>
					</div>
				)}

				{!loading && friends.length === 0 && (
					<div className="pt-24 flex flex-col items-center justify-center gap-3">
						<div className="text-sm text-gray-800 text-center">
							No friends found.
						</div>
						<Button
							className="bg-blue-500 hover:bg-blue-500/85 cursor-pointer sm:hidden"
							onClick={toggleAddPeers}
						>
							<UserPlus /> Add Friend
						</Button>
					</div>
				)}

				<div className="flex flex-col gap-2">
					{userSearch.map((friend) => {
						const isSelected = friend.uid === selectedFriendId;

						return (
							<div
								key={friend.uid}
								className={`flex items-center gap-3 py-2 px-2 rounded-lg cursor-pointer transition-colors ${
									isSelected
										? "bg-blue-500 text-white"
										: "hover:bg-gray-100 text-black"
								}`}
								onClick={() => selectUser(friend.uid)}
							>
								<div className="relative">
									<div
										className={`p-1.5 absolute z-50 bottom-0 rounded-full right-0 ${
											friend.status?.toLocaleLowerCase() ===
											"online"
												? "bg-green-400"
												: "bg-red-500"
										}`}
									></div>
									<Avatar
										className={`w-10 h-10 border border-gray-400 font-semibold select-none ${
											!isSelected
												? "text-gray-600"
												: "text-blue-500"
										}`}
									>
										<AvatarFallback className="bg-white">
											{friend.name
												? friend.name
														.charAt(0)
														.toUpperCase()
												: "?"}
										</AvatarFallback>
									</Avatar>
								</div>
								<div className="flex flex-col">
									<span className="font-semibold">
										{friend.name || "Unknown User"}
									</span>
									<span
										className={`text-xs ${
											isSelected
												? "text-gray-200"
												: friend.status === "online" ||
												  friend.status === "Online"
												? "text-green-600"
												: "text-red-600"
										}`}
									>
										{friend.status || "Offline"}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}
