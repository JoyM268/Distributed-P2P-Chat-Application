import type { WebRTCMessage } from "@/types";

const DB_NAME = "p2p_chat_db";
const STORE_NAME = "messages";
const DB_VERSION = 2;

export const initDB = (): Promise<IDBDatabase> => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => reject("Error opening database");

		request.onsuccess = (event) => {
			resolve((event.target as IDBOpenDBRequest).result);
		};

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;

			let store: IDBObjectStore;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				store = db.createObjectStore(STORE_NAME, {
					keyPath: "id",
					autoIncrement: true,
				});
			} else {
				store = (
					event.target as IDBOpenDBRequest
				).transaction!.objectStore(STORE_NAME);
			}

			if (!store.indexNames.contains("timestamp")) {
				store.createIndex("timestamp", "timestamp", { unique: false });
			}

			if (!store.indexNames.contains("user_conversation")) {
				store.createIndex(
					"user_conversation",
					["ownerId", "conversationId"],
					{ unique: false }
				);
			}
		};
	});
};

export const saveMessageToDB = async (
	ownerId: string,
	conversationId: string,
	message: WebRTCMessage
) => {
	if (!ownerId) return;

	const db = await initDB();
	return new Promise<void>((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], "readwrite");
		const store = transaction.objectStore(STORE_NAME);
		const record = { ...message, ownerId, conversationId };

		const request = store.add(record);

		request.onsuccess = () => resolve();
		request.onerror = () => reject("Error saving message");
	});
};

export const getHistoryFromDB = async (
	ownerId: string,
	conversationId: string
): Promise<WebRTCMessage[]> => {
	if (!ownerId) return [];

	const db = await initDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], "readonly");
		const store = transaction.objectStore(STORE_NAME);
		const index = store.index("user_conversation");

		const request = index.getAll([ownerId, conversationId]);

		request.onsuccess = () => {
			const results = request.result as WebRTCMessage[];
			results.sort((a, b) => a.timestamp - b.timestamp);
			resolve(results);
		};
		request.onerror = () => reject("Error loading history");
	});
};
