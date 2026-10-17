/**
 * src/store.js - Simple Message Store
 * Cache for messages (in-memory)
 * By Angga Official
 *
 * Note: Baileys 6.7+ doesn't export makeInMemoryStore by default,
 * so we use a simple in-memory Map as fallback.
 */

const store = {
    _messages: new Map(),
    _chats: new Map(),
    _contacts: new Map(),

    loadMessage(jid, id) {
        const key = `${jid}:${id}`;
        return this._messages.get(key);
    },

    writeToFile() {
        // No-op for in-memory store
    },

    readFromFile() {
        // No-op for in-memory store
    },

    bind() {
        // No-op for in-memory store
    },
};

module.exports = store;
