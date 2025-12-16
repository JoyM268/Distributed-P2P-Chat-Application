import type { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function AddPeers({
	addPeers,
	setAddPeers,
}: {
	addPeers: boolean;
	setAddPeers: Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<Dialog open={addPeers} onOpenChange={setAddPeers}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="font-semibold">
						Add Peers
					</DialogTitle>
				</DialogHeader>
				<div className="mt-1 flex flex-col gap-2 mb-2">
					<Label htmlFor="username">Enter the Username</Label>
					<Input
						id="username"
						placeholder="Username"
						className="border border-gray-500"
					/>
				</div>
				<DialogFooter>
					<DialogClose>
						<Button variant="outline" className="cursor-pointer">
							Cancel
						</Button>
					</DialogClose>
					<Button
						className="bg-blue-500 text-white hover:bg-blue-500/85 cursor-pointer"
						type="submit"
						onClick={() => setAddPeers(false)}
					>
						Add
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
