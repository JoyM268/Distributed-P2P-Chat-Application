import { useEffect, useRef, useState, useCallback } from "react";
import { db } from "@/services/firebase";
import { ref, onChildAdded, push, remove, off } from "firebase/database";
import { saveMessageToDB } from "@/services/chatHistory";
import type { WebRTCMessage } from "@/types";

interface Friend {
	uid: string;
	name?: string;
	status?: string;
}

interface SignalPayload {
	type: "offer" | "answer" | "candidate";
	sdp?: string;
	candidate?: string;
	sdpMid?: string | null;
	sdpMLineIndex?: number | null;
}

const RTC_CONFIG = {
	iceServers: [
		{
			urls: [
				"stun:stun1.l.google.com:19302",
				"stun:stun2.l.google.com:19302",
			],
		},
	],
};

export default function useWebRTC(
	currentUserId: string | null,
	friends: Friend[]
) {
	const peersRef = useRef<{ [key: string]: RTCPeerConnection }>({});
	const channelsRef = useRef<{ [key: string]: RTCDataChannel }>({});

	const [messages, setMessages] = useState<WebRTCMessage[]>([]);

	const sendSignal = useCallback(
		async (toUid: string, type: string, payload: unknown) => {
			if (!currentUserId) return;
			const signalRef = ref(db, `signaling/${toUid}`);
			await push(signalRef, {
				type,
				payload,
				senderId: currentUserId,
			});
		},
		[currentUserId]
	);

	const setupDataChannel = useCallback(
		(peerId: string, channel: RTCDataChannel) => {
			channelsRef.current[peerId] = channel;

			channel.onopen = () =>
				console.log(`P2P Channel Open with ${peerId}`);

			channel.onmessage = async (event) => {
				try {
					const parsed = JSON.parse(event.data);

					const msg: WebRTCMessage = {
						senderId: peerId,
						content: parsed.content,
						timestamp: parsed.timestamp || Date.now(),
					};

					setMessages((prev) => [...prev, msg]);
					await saveMessageToDB(peerId, msg);
					console.log(`Received & Saved message from ${peerId}`);
				} catch (e) {
					console.error("Failed to parse or save message", e);
				}
			};
		},
		[]
	);

	const createPeerConnection = useCallback(
		(peerId: string, isInitiator: boolean) => {
			if (peersRef.current[peerId]) return peersRef.current[peerId];

			const pc = new RTCPeerConnection(RTC_CONFIG);
			peersRef.current[peerId] = pc;

			pc.onicecandidate = (event) => {
				if (event.candidate) {
					sendSignal(peerId, "candidate", event.candidate.toJSON());
				}
			};

			pc.ondatachannel = (event) => {
				setupDataChannel(peerId, event.channel);
			};

			if (isInitiator) {
				const channel = pc.createDataChannel("chat");
				setupDataChannel(peerId, channel);

				pc.createOffer()
					.then((offer) => pc.setLocalDescription(offer))
					.then(() => {
						sendSignal(peerId, "offer", {
							type: "offer",
							sdp: pc.localDescription?.sdp,
						});
					})
					.catch((err) =>
						console.error("Error creating offer:", err)
					);
			}

			return pc;
		},
		[sendSignal, setupDataChannel]
	);

	const handleSignal = useCallback(
		async (
			senderId: string,
			data: { type: string; payload: SignalPayload }
		) => {
			const { type, payload } = data;
			let pc = peersRef.current[senderId];

			if (!pc && type === "offer") {
				pc = createPeerConnection(senderId, false)!;
			}

			if (!pc) return;

			try {
				if (type === "offer" && payload.sdp) {
					await pc.setRemoteDescription(
						new RTCSessionDescription({
							type: "offer",
							sdp: payload.sdp,
						})
					);
					const answer = await pc.createAnswer();
					await pc.setLocalDescription(answer);
					sendSignal(senderId, "answer", {
						type: "answer",
						sdp: answer.sdp,
					});
				} else if (type === "answer" && payload.sdp) {
					await pc.setRemoteDescription(
						new RTCSessionDescription({
							type: "answer",
							sdp: payload.sdp,
						})
					);
				} else if (type === "candidate") {
					await pc.addIceCandidate(new RTCIceCandidate(payload));
				}
			} catch (e) {
				console.error("Signaling Error:", e);
			}
		},
		[createPeerConnection, sendSignal]
	);

	useEffect(() => {
		if (!currentUserId) return;

		friends.forEach((friend) => {
			const peerId = friend.uid;
			const isOnline = friend.status?.toLowerCase() === "online";
			const hasConnection = !!peersRef.current[peerId];

			if (!isOnline && hasConnection) {
				console.log(`Closing P2P with ${friend.name}`);
				const pc = peersRef.current[peerId];
				pc.close();
				delete peersRef.current[peerId];
				delete channelsRef.current[peerId];
				return;
			}

			if (isOnline && !hasConnection) {
				if (currentUserId < peerId) {
					console.log(`Initiating Call to ${friend.name}`);
					createPeerConnection(peerId, true);
				} else {
					console.log(`Waiting for call from ${friend.name}`);
				}
			}
		});
	}, [friends, currentUserId, createPeerConnection]);

	useEffect(() => {
		if (!currentUserId) return;

		const signalingRef = ref(db, `signaling/${currentUserId}`);

		onChildAdded(signalingRef, async (snapshot) => {
			const data = snapshot.val();
			if (!data || !data.senderId) return;

			await handleSignal(data.senderId, data);
			remove(snapshot.ref);
		});

		return () => off(signalingRef);
	}, [currentUserId, handleSignal]);

	const sendMessage = useCallback(async (peerId: string, content: string) => {
		const channel = channelsRef.current[peerId];

		if (channel && channel.readyState === "open") {
			const timestamp = Date.now();
			const msgPayload = { content, timestamp };

			channel.send(JSON.stringify(msgPayload));

			const myMsg: WebRTCMessage = {
				senderId: "me",
				receiverId: peerId,
				content,
				timestamp,
			};

			setMessages((prev) => [...prev, myMsg]);

			await saveMessageToDB(peerId, myMsg);
			console.log(`Sent & Saved message to ${peerId}`);

			return true;
		} else {
			console.warn(`Cannot send to ${peerId}: Channel not open`);
			return false;
		}
	}, []);

	return { sendMessage, messages };
}
