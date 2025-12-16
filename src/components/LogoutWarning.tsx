import type { Dispatch, SetStateAction } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogTitle,
} from "./ui/alert-dialog";

export default function LogoutWarning({
	logout,
	logoutWarning,
	setLogoutWarning,
}: {
	logout: () => void;
	logoutWarning: boolean;
	setLogoutWarning: Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<AlertDialog open={logoutWarning} onOpenChange={setLogoutWarning}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want to log out?
					</AlertDialogTitle>
					<AlertDialogDescription style={{ color: "black" }}>
						This will end your current session. You will need to
						enter your credentials to log in again.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={logout}
						className="cursor-pointer bg-blue-500 hover:bg-blue-500/90"
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
