import { KvStore, KvKey, KvStoreSetOptions } from "@fedify/fedify";

class SqliteKvStore implements KvStore {
	async get<T = unknown>(key: KvKey): Promise<T | undefined> {
		// Implement get logic

	}

	async set(
		key: KvKey,
		value: unknown,
		options?: KvStoreSetOptions
	): Promise<void> {
		// Implement set logic
	}

	async delete(key: KvKey): Promise<void> {
		// Implement delete logic
	}

	private serializeKvKey(key: KvKey): String {

	}

	private deserializeKvKey(serializedKey: String): KvKey{

	}
}

export default SqliteKvStore;