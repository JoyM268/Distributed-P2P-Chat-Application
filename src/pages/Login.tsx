import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { signInWithEmailAndPassword, auth, db } from "@/services/firebase";
import { FirebaseError } from "firebase/app";
import { NavLink } from "react-router-dom";
import { ref, get, child } from "firebase/database";
import { toast } from "sonner";

export default function Login({
	setMenu,
}: {
	setMenu: Dispatch<SetStateAction<boolean>>;
}) {
	const [identifier, setIdentifier] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		setMenu(false);
	}, [setMenu]);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);
		if (identifier.trim().length === 0 || password.length === 0) {
			toast.error("Email/username or password cannot be empty.");
			setLoading(false);
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const isEmail = emailRegex.test(identifier);

		let loginEmail = identifier.trim();

		try {
			if (!isEmail) {
				const username = identifier;
				const dbRef = ref(db);
				const usernameSnapshot = await get(
					child(dbRef, `usernames/${username}`)
				);

				if (!usernameSnapshot.exists()) {
					throw new Error("Invalid username or password.");
				}

				const userId = usernameSnapshot.val();

				const userSnapshot = await get(
					child(dbRef, `users/${userId}/email`)
				);

				if (!userSnapshot.exists()) {
					throw new Error("Invalid username or password.");
				}

				loginEmail = userSnapshot.val();
			}

			await signInWithEmailAndPassword(auth, loginEmail, password);
			toast.success("Successfully logged in.");
		} catch (err) {
			console.error("Login Error:", err);

			if (err instanceof FirebaseError) {
				if (
					err.code === "auth/invalid-credential" ||
					err.code === "auth/user-not-found" ||
					err.code === "auth/wrong-password"
				) {
					toast.error("Invalid username or password.");
				} else if (err.code === "auth/too-many-requests") {
					toast.error("Too many failed attempts. Try again later.");
				} else {
					toast.error(err.message);
				}
			} else if (err instanceof Error) {
				toast.error(err.message);
			} else {
				toast.error("An unknown error occurred.");
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="pt-32 flex flex-col w-full text-center items-center gap-6 px-6">
			<div className="flex flex-col gap-1 select-none">
				<h1 className="sm:text-3xl font-semibold text-2xl">
					Welcome Back
				</h1>
				<p className="text-gray-700 sm:text-sm text-xs">
					Sign in to continue to your conversations.
				</p>
			</div>
			<form
				className="max-w-7xl min-w-full sm:min-w-sm flex flex-col gap-5"
				onSubmit={handleSubmit}
			>
				<div className="flex flex-col gap-1 ">
					<Label
						className="sm:text-base text-sm select-none text-left"
						htmlFor="identifier"
					>
						Email/Username
					</Label>
					<Input
						id="identifier"
						type="text"
						value={identifier}
						placeholder="Email/Username"
						className="sm:text-base text-sm"
						onChange={(e) => setIdentifier(e.target.value)}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label
						htmlFor="password"
						className="sm:text-base text-sm select-none text-left"
					>
						Password
					</Label>
					<Input
						id="password"
						type="password"
						value={password}
						className="sm:text-base text-sm"
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
					/>
				</div>
				<Button
					className="bg-blue-500 mt-1 cursor-pointer hover:bg-blue-500/85 sm:text-base text-sm select-none"
					disabled={loading}
				>
					{loading ? "Loading..." : "Login"}
				</Button>
			</form>
			<div className="text-gray-600 text-xs -mt-3 select-none">
				Don't have an account?{" "}
				<NavLink to="/signup" className="text-blue-500 cursor-pointer">
					Signup
				</NavLink>
			</div>
		</div>
	);
}
