/**
 * commands/ai.js - AI & GPT commands
 * chatgpt, ai, openai
 * By Angga Official
 */

module.exports = async (ctx) => {
    const { Skyzo, m, command, text, msg, example, fetchJson } = ctx;

    switch (command) {
        case 'chatgpt':
        case 'gpt': {
            if (!text) return m.reply(example('cara memasak nasi'));
            await m.reply(msg.wait);
            try {
                const e = await fetchJson(`https://aemt.me/gpt4?text=${encodeURIComponent(text)}`);
                if (!e.status) return m.reply(JSON.stringify(e, null, 2));
                const teks = `*© GPT - Chat Version*\n\n${e.result}`;
                return m.reply(teks);
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
        }

        case 'ai':
        case 'openai': {
            if (!text) return m.reply(example('cerita tentang kucing'));
            await m.reply(msg.wait);
            try {
                const e = await fetchJson(`https://aemt.me/openai?text=${encodeURIComponent(text)}`);
                if (!e.status) return m.reply(JSON.stringify(e, null, 2));
                const teks = `*© AI - ${global.branding}*\n\n${e.result}`;
                return m.reply(teks);
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
        }

        default:
            return false;
    }
};
