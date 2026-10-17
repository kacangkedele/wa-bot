/**
 * commands/converter.js - Media converter commands
 * toaudio, tomp3, tovn, toptv, tts, toimage, sticker, tourl
 * By Angga Official
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { fromBuffer } = require('file-type');

module.exports = async (ctx) => {
    const { Skyzo, m, command, args, text, isPremium, msg, example, mime, qmsg, telegraPh, toAudio, toPTT, getRandom } = ctx;

    switch (command) {
        case 'toaudio':
        case 'tomp3': {
            if (!/video/.test(mime) && !/audio/.test(mime)) {
                return m.reply(example('dengan mengirim/reply video atau audio'));
            }
            if (qmsg?.seconds && qmsg.seconds > 30) return m.reply('Durasi video maksimal 30 detik');
            await m.reply(msg.wait);
            try {
                const media = await Skyzo.downloadMediaMessage(qmsg);
                const anu = await toAudio(media, 'mp4');
                await Skyzo.sendMessage(m.chat, {
                    audio: anu,
                    mimetype: 'audio/mpeg',
                }, { quoted: m });
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
            return;
        }

        case 'tovn':
        case 'toptt': {
            if (!/video|audio/.test(mime)) {
                return m.reply(example('dengan mengirim/reply audio/video'));
            }
            await m.reply(msg.wait);
            try {
                const media = await Skyzo.downloadMediaMessage(qmsg);
                const anu = await toPTT(media, 'mp4');
                await Skyzo.sendMessage(m.chat, {
                    audio: anu,
                    mimetype: 'audio/mpeg',
                    ptt: true,
                }, { quoted: m });
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
            return;
        }

        case 'toptv': {
            if (!/video/.test(mime)) {
                return m.reply(example('dengan mengirim/reply video'));
            }
            if (qmsg?.seconds && qmsg.seconds > 30) return m.reply('Max duration: 30s');
            try {
                const proto = require('@whiskeysockets/baileys').proto;
                const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');
                const ptv = await generateWAMessageFromContent(m.chat, proto.Message.fromObject({ ptvMessage: qmsg }), { userJid: m.chat, quoted: m });
                await Skyzo.relayMessage(m.chat, ptv.message, { messageId: ptv.key.id });
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
            return;
        }

        case 'toimage':
        case 'toimg': {
            if (!/webp/.test(mime)) {
                return m.reply(example('sambil reply sticker'));
            }
            await m.reply(msg.wait);
            const media = await Skyzo.downloadAndSaveMediaMessage(qmsg);
            const ran = path.join('./all/tmp', `${getRandom('.png')}`);
            exec(`ffmpeg -i ${media} ${ran}`, async (err) => {
                if (fs.existsSync(media)) fs.unlinkSync(media);
                if (err) return m.reply('Error: ' + err.message);
                const buffer = fs.readFileSync(ran);
                await Skyzo.sendMessage(m.chat, { image: buffer }, { quoted: m });
                if (fs.existsSync(ran)) fs.unlinkSync(ran);
            });
            return;
        }

        case 'tts': {
            if (!text) return m.reply(example('jangan lupa minum susu'));
            if (text.length >= 300) return m.reply('Jumlah huruf harus di bawah 300!');
            await m.reply(msg.wait);
            try {
                const id = 'id_001';
                const { data } = await axios.post('https://tiktok-tts.weilnet.workers.dev/api/generation', {
                    text: text,
                    voice: id,
                }, { headers: { 'Content-Type': 'application/json' }, timeout: 30000 });
                if (!data?.data) return m.reply('Failed to generate audio');
                await Skyzo.sendMessage(m.chat, {
                    audio: Buffer.from(data.data, 'base64'),
                    mimetype: 'audio/mp4',
                }, { quoted: m });
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
            return;
        }

        case 'sticker':
        case 'stiker':
        case 'sgif':
        case 's': {
            if (!/image|video/.test(mime)) {
                return m.reply(example('dengan mengirim/reply foto/video'));
            }
            if (/video/.test(mime) && qmsg?.seconds && qmsg.seconds > 15) {
                return m.reply('Durasi video maksimal 15 detik!');
            }
            await m.reply(msg.wait);
            try {
                const media = await Skyzo.downloadAndSaveMediaMessage(qmsg);
                await Skyzo.sendStimg(m.chat, media, m, { packname: global.packname, author: global.author });
                if (fs.existsSync(media)) fs.unlinkSync(media);
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
            return;
        }

        case 'tourl':
        case 'telegraph': {
            if (!isPremium) return m.reply('Premium only!');
            if (!/image/.test(mime)) {
                return m.reply(example('dengan mengirim/reply foto'));
            }
            await m.reply(msg.wait);
            try {
                const fotonya = await Skyzo.downloadAndSaveMediaMessage(qmsg);
                const urlimage = await telegraPh(fotonya);
                await m.reply(`✅ Done by ${global.branding}\n${urlimage}`);
                if (fs.existsSync(fotonya)) fs.unlinkSync(fotonya);
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
            return;
        }

        default:
            return false;
    }
};
