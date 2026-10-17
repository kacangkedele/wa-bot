/**
 * commands/tools.js - Utility commands
 * remini, tohd, qc, pinterest, setppbot, setpppanjang, setbio, public, self, get, sc, clearsession
 * By Angga Official
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec, execSync } = require('child_process');
const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');

module.exports = async (ctx) => {
    const {
        Skyzo, m, command, args, text, isOwner, isGroup, isPremium,
        botNumber, mime, qmsg, msg, example, telegraPh, pinterest,
        generateProfilePicture, fetchJson, getRandom, qchanel,
    } = ctx;

    switch (command) {
        case 'remini':
        case 'tohd':
        case 'hd':
        case 'genshin': {
            if (!/image/.test(mime)) return m.reply(example('dengan mengirim/reply foto'));
            await m.reply(msg.wait);
            let tingkat = 4;
            if (/tohd|hd/.test(command)) tingkat = 2;
            try {
                const res = await Skyzo.downloadAndSaveMediaMessage(qmsg);
                const urlnya = await telegraPh(res);
                const image = await fetchJson(`https://aemt.me/remini?url=${encodeURIComponent(urlnya)}&resolusi=${tingkat}`);
                if (!image.status) return m.reply('Error: API gagal proses gambar');
                await Skyzo.sendMessage(m.chat, {
                    image: { url: image.url },
                    caption: `✅ Done by ${global.branding}`,
                }, { quoted: m });
                if (fs.existsSync(res)) fs.unlinkSync(res);
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
            return;
        }

        case 'qc': {
            if (!text) return m.reply(example('teksnya'));
            const warna = ['#000000', '#ff2414', '#22b4f2', '#eb13f2'];
            let ppuser;
            try {
                ppuser = await Skyzo.profilePictureUrl(m.sender, 'image');
            } catch (e) {
                ppuser = 'https://telegra.ph/file/caa9288c34034e5bb8d28.png';
            }
            const reswarna = warna[Math.floor(Math.random() * warna.length)];
            await m.reply(msg.wait);
            const obj = {
                type: 'quote',
                format: 'png',
                backgroundColor: reswarna,
                width: 512,
                height: 768,
                scale: 2,
                messages: [{
                    entities: [],
                    avatar: true,
                    from: {
                        id: 1,
                        name: m.pushName,
                        photo: { url: ppuser },
                    },
                    text: text,
                    replyMessage: {},
                }],
            };
            try {
                const json = await axios.post('https://quote.btch.bz/generate', obj, {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 30000,
                });
                if (!json.data?.result?.image) return m.reply('Error: API quote gagal');
                const buffer = Buffer.from(json.data.result.image, 'base64');
                await Skyzo.sendStimg?.(m.chat, buffer, m, { packname: global.packname });
                if (!Skyzo.sendStimg) {
                    // Fallback: kirim sebagai gambar
                    await Skyzo.sendMessage(m.chat, { image: buffer }, { quoted: m });
                }
            } catch (error) {
                return m.reply('Error: ' + error.message);
            }
            return;
        }

        case 'pinterest':
        case 'pin': {
            if (!isPremium) return m.reply('Premium only!');
            if (!text) return m.reply(example('Elaina sexy pose'));
            await m.reply(msg.wait);
            try {
                const res = await pinterest(text);
                if (res.length < 1) return m.reply('Photo not found');
                let jumlah = Math.min(5, res.length);
                for (let i = 0; i < jumlah; i++) {
                    await Skyzo.sendMessage(m.chat, { image: { url: res[i] } }, { quoted: m });
                }
            } catch (e) {
                return m.reply('Error: ' + e.message);
            }
            return;
        }

        case 'setpp':
        case 'setppbot': {
            if (!isOwner) return m.reply(msg.owner);
            if (!/image/.test(mime)) return m.reply(example('dengan mengirim/reply foto'));
            try {
                const media = await Skyzo.downloadAndSaveMediaMessage(qmsg);
                await Skyzo.updateProfilePicture(botNumber, { url: media });
                if (fs.existsSync(media)) fs.unlinkSync(media);
                return m.reply('✅ Foto profil bot berhasil diubah');
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
        }

        case 'setppbotpanjang':
        case 'setpppanjang': {
            if (!isOwner) return m.reply(msg.owner);
            if (!/image/.test(mime)) return m.reply(example('dengan mengirim/reply foto'));
            try {
                const medis = await Skyzo.downloadAndSaveMediaMessage(qmsg, 'ppbot.jpeg', false);
                const { img } = await generateProfilePicture(medis);
                await Skyzo.query({
                    tag: 'iq',
                    attrs: {
                        to: botNumber,
                        type: 'set',
                        xmlns: 'w:profile:picture',
                    },
                    content: [
                        {
                            tag: 'picture',
                            attrs: { type: 'image' },
                            content: img,
                        },
                    ],
                });
                if (fs.existsSync(medis)) fs.unlinkSync(medis);
                return m.reply('✅ Foto profil bot (panjang) berhasil diubah');
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
        }

        case 'setbio':
        case 'setbiobot': {
            if (!isOwner) return m.reply(msg.owner);
            if (!text) return m.reply(example('teksnya'));
            try {
                await Skyzo.updateProfileStatus(text);
                return m.reply('✅ Bio bot berhasil diubah');
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
        }

        case 'public':
        case 'publik': {
            if (!isOwner) return m.reply(msg.owner);
            global.selfmode = false;
            Skyzo.public = true;
            return m.reply('✅ Bot sekarang dalam mode public');
        }

        case 'self':
        case 'private':
        case 'priv':
        case 'prib': {
            if (!isOwner) return m.reply(msg.owner);
            global.selfmode = true;
            Skyzo.public = false;
            return m.reply('✅ Bot sekarang dalam mode self/private');
        }

        case 'get': {
            if (!isOwner) return m.reply(msg.owner);
            if (!text) return m.reply('Linknya mana?\nContoh: .get https://example.com/api/data');
            try {
                const check = await fetchJson(text);
                return m.reply(JSON.stringify(check, null, 2));
            } catch (e) {
                return m.reply('Error: ' + e.message);
            }
        }

        case 'sc':
        case 'scbot':
        case 'scriptbot': {
            if (isOwner) {
                // Owner: kirim script sebagai zip
                await m.reply('Generating script zip, tunggu sebentar...');
                try {
                    const a = new Date().toISOString().replace(/[:.]/g, '-');
                    const name = `script_${a}`;
                    const ls = fs.readdirSync('.').filter(
                        pe => !['node_modules', 'session', 'package-lock.json', 'yarn.lock'].includes(pe)
                    );
                    execSync(`zip -r ${name}.zip ${ls.join(' ')}`, { stdio: 'ignore' });
                    await Skyzo.sendMessage(m.sender, {
                        document: fs.readFileSync(`./${name}.zip`),
                        fileName: `${name}.zip`,
                        mimetype: 'application/zip',
                    }, { quoted: m });
                    fs.unlinkSync(`./${name}.zip`);
                    if (m.chat !== m.sender) return m.reply('✅ File script dikirim ke private chat');
                } catch (err) {
                    return m.reply('Error: ' + err.message);
                }
            } else {
                return m.reply(`Script ${global.branding}:\nhttps://github.com/ (Hubungi owner untuk link asli)\n\n© ${global.branding}`);
            }
            return;
        }

        case 'clearsession': {
            if (!isOwner) return m.reply(msg.owner);
            try {
                const sessionDir = global.sessionPath;
                if (!fs.existsSync(sessionDir)) return m.reply('Tidak ada folder session');
                const files = fs.readdirSync(sessionDir);
                let count = 0;
                for (const file of files) {
                    if (file === 'creds.json') continue; // jangan hapus creds
                    try {
                        fs.unlinkSync(path.join(sessionDir, file));
                        count++;
                    } catch (_) {}
                }
                return m.reply(`✅ Berhasil hapus ${count} file session (creds.json dipertahankan)`);
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
        }

        case 'runtime':
        case 'ping':
        case 'speed': {
            const { runtime } = ctx;
            const uptime = process.uptime();
            const memory = process.memoryUsage();
            const usedMB = (memory.heapUsed / 1024 / 1024).toFixed(2);
            const totalMB = (memory.heapTotal / 1024 / 1024).toFixed(2);
            return m.reply(
                `*Bot Status*\n\n` +
                `Runtime: ${runtime(uptime)}\n` +
                `Memory: ${usedMB} / ${totalMB} MB\n` +
                `Status: Online ✅\n\n` +
                `© ${global.branding}`
            );
        }

        default:
            return false;
    }
};
