import type { WebRTCMessage } from "@/types";

const DB_NAME = "p2p_chat_db";
const STORE_NAME = "messages";
const DB_VERSION = 1;

export const initDB = (): Promise<IDBDatabase> => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => reject("Error opening database");

		request.onsuccess = (event) => {
			resolve((event.target as IDBOpenDBRequest).result);
		};

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;

			if (!db.objectStoreNames.contains(STORE_NAME)) {
				const store = db.createObjectStore(STORE_NAME, {
					keyPath: "id",
					autoIncrement: true,
				});

				store.createIndex("conversationId", "conversationId", {
					unique: false,
				});
				store.createIndex("timestamp", "timestamp", { unique: false });
			}
		};
	});
};

export const saveMessageToDB = async (
	conversationId: string,
	message: WebRTCMessage
) => {
	const db = await initDB();
	return new Promise<void>((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], "readwrite");
		const store = transaction.objectStore(STORE_NAME);
		const record = { ...message, conversationId };

		const request = store.add(record);

		request.onsuccess = () => resolve();
		request.onerror = () => reject("Error saving message");
	});
};

export const getHistoryFromDB = async (
	conversationId: string
): Promise<WebRTCMessage[]> => {
	const db = await initDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], "readonly");
		const store = transaction.objectStore(STORE_NAME);
		const index = store.index("conversationId");

		const request = index.getAll(conversationId);

		request.onsuccess = () => {
			const results = request.result as WebRTCMessage[];
			results.sort((a, b) => a.timestamp - b.timestamp);
			resolve(results);
		};
		request.onerror = () => reject("Error loading history");
	});
};
