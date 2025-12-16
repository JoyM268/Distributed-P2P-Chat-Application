import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import useFriends from "@/hooks/useFriends";
import { useAuth } from "@/context/AuthContext";

export default function DiscoveredPeers({
	selectUser,
	selectedFriendId,
}: {
	selectUser: (uid: string) => void;
	selectedFriendId?: string | null;
}) {
	const { currentUser } = useAuth();
	const { friends, loading } = useFriends({
		currentUserId: currentUser?.uid || null,
	});

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
				<span className="text-sm font-medium">My Friends</span>
			</div>

			<div className="px-4 pb-4 flex-1 overflow-y-auto">
				{loading && (
					<div className="text-sm text-gray-500 text-center py-4">
						Loading...
					</div>
				)}

				{!loading && friends.length === 0 && (
					<div className="text-sm text-gray-500 text-center py-4">
						No friends found.
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
								<Avatar className="w-10 h-10 border border-gray-400 text-black">
									<AvatarFallback className="bg-white">
										{friend.name
											? friend.name
													.charAt(0)
													.toUpperCase()
											: "?"}
									</AvatarFallback>
								</Avatar>

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
