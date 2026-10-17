/**
 * src/message.js - Main Message Handler
 * =====================================================
 * Parses incoming messages and routes to commands
 * By Angga Official
 * =====================================================
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const chalk = require('chalk');
const util = require('util');
const { exec, execSync } = require('child_process');
const axios = require('axios');

// Load utils & converter
const { runtime, getRandom, getTime, tanggal, telegraPh, pinterest, ucapan, generateProfilePicture, getBuffer, fetchJson } = require('./lib/function.js');
const { toAudio, toPTT, toVideo, ffmpeg } = require('./lib/converter.js');

// Initialize database files (safety check)
const dbFiles = [
    { path: global.dbowner, content: '[]' },
    { path: global.dbprem, content: '[]' },
    { path: global.dbantilink, content: '[]' },
    { path: global.dbantilink2, content: '[]' },
    { path: global.dbcontacts, content: '[]' },
];

for (const db of dbFiles) {
    if (!fs.existsSync(db.path)) fs.writeFileSync(db.path, db.content);
}

// Read database files
function readDB(file) {
    try {
        return JSON.parse(fs.readFileSync(file).toString());
    } catch (e) {
        return [];
    }
}

// Message response template (used by commands)
global.msg = {
    wait: `_Mohon tunggu sebentar... ${global.branding}_`,
    owner: `_Khusus owner bot! ${global.branding}_`,
    admin: `_Khusus admin grup! ${global.branding}_`,
    adminbot: `_Bot harus jadi admin dulu! ${global.branding}_`,
    group: `_Command ini hanya bisa dipakai di grup! ${global.branding}_`,
    premium: `_Khusus member premium! ${global.branding}_`,
    error: `_Terjadi error, coba lagi nanti. ${global.branding}_`,
};

// Example helper
function example(teks) {
    return `\nContoh penggunaan:\n${global.prefix}${global.currentCommand || 'command'} ${teks}\n`;
}

global.example = example;

// ============================================================
// MAIN MESSAGE HANDLER
// ============================================================
module.exports = async (Skyzo, m, store) => {
    try {
        // Parse message body
        const body = parseMessageBody(m);
        const budy = (typeof m.text === 'string' ? m.text : '');
        const prefix = global.prefix || '.';
        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
        const cmd = prefix + command;
        const args = body.trim().split(/ +/).slice(1);
        const makeid = crypto.randomBytes(3).toString('hex');
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted)?.mimetype || '';
        const qmsg = (quoted.msg || quoted);
        const text = q = args.join(' ');

        // Bot info
        const botNumber = Skyzo.user?.id ? Skyzo.decodeJid(Skyzo.user.id) : '';
        if (!botNumber) return;

        // Database files
        const zippokun = readDB(global.dbowner);
        const zippokuy = readDB(global.dbprem);

        // Identity checks
        const isOwner = [global.owner + '@s.whatsapp.net', ...zippokun, botNumber].includes(m.sender);
        const isPremium = [global.owner + '@s.whatsapp.net', ...zippokun, botNumber, ...zippokuy].includes(m.sender);
        const isGroup = m.chat?.endsWith('@g.us');
        const senderNumber = m.sender?.split('@')[0] || '';
        const pushname = m.pushName || senderNumber;

        // Group metadata
        let groupMetadata = {};
        if (isGroup) {
            try {
                groupMetadata = await Skyzo.groupMetadata(m.key.remoteJid);
            } catch (e) {
                groupMetadata = { participants: [] };
            }
        }
        const participant_bot = (isGroup ? groupMetadata.participants?.find((v) => v.id === botNumber) : {}) || {};
        const participant_sender = (isGroup ? groupMetadata.participants?.find((v) => v.id === m.sender) : {}) || {};
        const isBotAdmin = participant_bot?.admin != null;
        const isAdmin = participant_sender?.admin != null;

        // Antilink group protection
        const antilink = readDB(global.dbantilink);
        const antilink2 = readDB(global.dbantilink2);
        const contacts = readDB(global.dbcontacts);

        // Set global for commands access
        global.currentCommand = command;

        // Log command
        if (isCmd) {
            const time = new Date().toLocaleTimeString('id-ID');
            console.log(
                chalk.yellow.bgCyan.bold(` ${global.namabot} `),
                chalk.blue(`[${time}] [CMD]`),
                chalk.blue(`FROM:`), chalk.white(senderNumber),
                chalk.blue(`CMD:`), chalk.green(cmd),
                chalk.blue(`ARGS:`), chalk.gray(args.join(' ') || '-')
            );
        }

        // ============================================================
        // ANTILINK PROTECTION (auto-triggered before command parse)
        // ============================================================
        if (isGroup && isBotAdmin) {
            await handleAntilink(Skyzo, m, { isAdmin, isOwner, antilink, antilink2, botNumber });
        }

        // ============================================================
        // QKey messages (for quoted fake sender) - used by commands
        // ============================================================
        const qchanel = {
            key: {
                remoteJid: 'status@broadcast',
                fromMe: false,
                participant: '0@s.whatsapp.net',
            },
            message: {
                newsletterAdminInviteMessage: {
                    newsletterJid: '120363224727390375@newsletter',
                    newsletterName: 'Hore',
                    jpegThumbnail: '',
                    caption: `${global.branding}`,
                    inviteExpiration: Date.now() + 1814400000,
                },
            },
        };

        const qtext = {
            key: {
                fromMe: false,
                participant: '0@s.whatsapp.net',
                ...(m.chat ? { remoteJid: '0@s.whatsapp.net' } : {}),
            },
            message: { extendedTextMessage: { text: body } },
        };

        const qdoc = {
            key: {
                participant: '0@s.whatsapp.net',
                ...(m.chat ? { remoteJid: 'status@broadcast' } : {}),
            },
            message: {
                documentMessage: {
                    title: `${global.branding}`,
                    jpegThumbnail: '',
                },
            },
        };

        const qloc = {
            key: {
                participant: '0@s.whatsapp.net',
                ...(m.chat ? { remoteJid: 'status@broadcast' } : {}),
            },
            message: {
                locationMessage: {
                    name: `${global.branding}`,
                    jpegThumbnail: '',
                },
            },
        };

        const qloc2 = {
            key: {
                participant: '0@s.whatsapp.net',
                ...(m.chat ? { remoteJid: 'status@broadcast' } : {}),
            },
            message: {
                locationMessage: {
                    name: `Pushkon by ${global.branding}`,
                    jpegThumbnail: '',
                },
            },
        };

        const qkontak = {
            key: {
                participant: '0@s.whatsapp.net',
                ...(botNumber ? { remoteJid: 'status@broadcast' } : {}),
            },
            message: {
                contactMessage: {
                    displayName: `${global.branding}`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${global.ownerName};;;,\nFN:${global.ownerName}\nitem1.TEL;waid=${global.owner}:${global.owner}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
                    sendEphemeral: true,
                },
            },
        };

        // ============================================================
        // RESIZE / UTILITY FUNCTIONS (exported to commands)
        // ============================================================
        const resize = async (image, width, height) => {
            try {
                const Jimp = require('jimp');
                let oyy = await Jimp.read(image);
                let kiyomasa = await oyy.resize(width, height).getBufferAsync(Jimp.MIME_JPEG);
                return kiyomasa;
            } catch (e) {
                return image;
            }
        };

        function capital(string) {
            return string && typeof string === 'string'
                ? string.charAt(0).toUpperCase() + string.slice(1)
                : '';
        }

        const createSerial = (size) => {
            return crypto.randomBytes(size).toString('hex').slice(0, size);
        };

        // ============================================================
        // BUILD CONTEXT (passed to all command handlers)
        // ============================================================
        const ctx = {
            Skyzo, m, store, body, budy, prefix, isCmd, command, cmd, args,
            makeid, quoted, mime, qmsg, text, q,
            botNumber, isOwner, isPremium, isGroup, senderNumber, pushname,
            groupMetadata, isBotAdmin, isAdmin,
            zippokun, zippokuy, antilink, antilink2, contacts,
            example, resize, capital, createSerial,
            qchanel, qtext, qdoc, qloc, qloc2, qkontak,
            msg, util, axios, exec, execSync,
            runtime, getRandom, getTime, tanggal, telegraPh, pinterest,
            ucapan, generateProfilePicture, getBuffer, fetchJson,
            toAudio, toPTT, toVideo, ffmpeg,
            fs, path, crypto, chalk,
            readDB, saveDB: (file, data) => fs.writeFileSync(file, JSON.stringify(data)),
            sleep: (ms) => new Promise(r => setTimeout(r, ms)),
            proto: global.proto || {},
            generateWAMessageFromContent: require('@whiskeysockets/baileys').generateWAMessageFromContent,
            prepareWAMessageMedia: require('@whiskeysockets/baileys').prepareWAMessageMedia,
        };

        // Expose to global so commands can access them via destructuring
        Object.assign(global, {
            Skyzo, m, store, body, budy, prefix, isCmd, command, cmd, args,
            makeid, quoted, mime, qmsg, text, q,
            botNumber, isOwner, isPremium, isGroup, senderNumber, pushname,
            groupMetadata, isBotAdmin, isAdmin,
            zippokun, zippokuy, antilink, antilink2, contacts,
            example, resize, capital, createSerial,
            qchanel, qtext, qdoc, qloc, qloc2, qkontak,
            msg, util, axios, exec, execSync,
            runtime, getRandom, getTime, tanggal, telegraPh, pinterest,
            ucapan, generateProfilePicture, getBuffer, fetchJson,
            toAudio, toPTT, toVideo, ffmpeg,
            readDB, saveDB: (file, data) => fs.writeFileSync(file, JSON.stringify(data)),
            sleep: (ms) => new Promise(r => setTimeout(r, ms)),
        });

        // ============================================================
        // LOAD COMMANDS - try each command module
        // ============================================================
        const commandsDir = path.join(__dirname, '..', 'commands');

        if (isCmd && command) {
            const commandFiles = fs.readdirSync(commandsDir)
                .filter(f => f.endsWith('.js'));

            let handled = false;

            for (const file of commandFiles) {
                if (handled) break;
                try {
                    const cmdModule = require(path.join(commandsDir, file));
                    // Allow hot reload - clear cache for next time
                    delete require.cache[require.resolve(path.join(commandsDir, file))];

                    if (typeof cmdModule !== 'function') continue;

                    const result = await cmdModule(ctx);
                    if (result === true) {
                        handled = true;
                        break;
                    }
                } catch (e) {
                    console.error(`[ERROR] in command file ${file}:`, e);
                    // Don't break, try next command file
                }
            }

            if (!handled) {
                // Check for owner-eval prefixes
                if (budy.startsWith('$') && isOwner) {
                    try {
                        exec(budy.slice(2), (err, stdout, stderr) => {
                            if (err) return Skyzo.sendMessage(m.chat, { text: err.toString() }, { quoted: m });
                            if (stdout) return Skyzo.sendMessage(m.chat, { text: util.format(stdout) }, { quoted: m });
                            if (stderr) return Skyzo.sendMessage(m.chat, { text: util.format(stderr) }, { quoted: m });
                        });
                    } catch (e) {
                        await Skyzo.sendMessage(m.chat, { text: e.toString() }, { quoted: m });
                    }
                    return;
                }

                if (budy.startsWith('>') && isOwner) {
                    try {
                        let evaled = await eval(budy.slice(1));
                        if (typeof evaled !== 'string') evaled = util.inspect(evaled);
                        await Skyzo.sendMessage(m.chat, { text: util.format(evaled) }, { quoted: m });
                    } catch (e) {
                        await Skyzo.sendMessage(m.chat, { text: util.format(e) }, { quoted: m });
                    }
                    return;
                }

                if (budy.startsWith('=>') && isOwner) {
                    try {
                        const evaling = await eval(`;(async () => { ${budy.slice(2)} })();`);
                        await Skyzo.sendMessage(m.chat, { text: util.format(evaling) }, { quoted: m });
                    } catch (e) {
                        await Skyzo.sendMessage(m.chat, { text: util.format(e) }, { quoted: m });
                    }
                    return;
                }
            }
        }

        // Hot reload message.js on change
        const filePath = require.resolve(__filename);
        fs.unwatchFile && fs.watchFile(filePath, () => {
            fs.unwatchFile(filePath);
            console.log(chalk.redBright(`[INFO] Update ${__filename}`));
            delete require.cache[filePath];
            require(filePath);
        });

    } catch (err) {
        console.error('[FATAL] message handler error:', err);
        try {
            await Skyzo.sendMessage(`${global.owner}@s.whatsapp.net`, {
                text: `*Error Report*\n\n${util.format(err)}`,
            });
        } catch (_) {}
    }
};

// ============================================================
// HELPER: parse message body
// ============================================================
function parseMessageBody(m) {
    try {
        const type = m.mtype;
        switch (type) {
            case 'conversation':
                return m.message.conversation || '';
            case 'imageMessage':
                return m.message.imageMessage?.caption || '';
            case 'videoMessage':
                return m.message.videoMessage?.caption || '';
            case 'extendedTextMessage':
                return m.message.extendedTextMessage?.text || '';
            case 'buttonsResponseMessage':
                return m.message.buttonsResponseMessage?.selectedButtonId || '';
            case 'listResponseMessage':
                return m.message.listResponseMessage?.singleSelectReply?.selectedRowId || '';
            case 'interactiveResponseMessage':
                try {
                    return JSON.parse(m.message.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson || '{}').id || '';
                } catch {
                    return '';
                }
            case 'templateButtonReplyMessage':
                return m.message.templateButtonReplyMessage?.selectedId || '';
            case 'messageContextInfo':
                return m.message.buttonsResponseMessage?.selectedButtonId
                    || m.message.listResponseMessage?.singleSelectReply?.selectedRowId
                    || m.text || '';
            default:
                return '';
        }
    } catch {
        return '';
    }
}

// ============================================================
// ANTILINK HANDLER
// ============================================================
async function handleAntilink(Skyzo, m, ctx) {
    try {
        const { isAdmin, isOwner, antilink, antilink2 } = ctx;
        if (isAdmin || isOwner || m.fromMe) return;
        if (!m.text) return;

        const linkRegex = /chat\.whatsapp\.com|buka tautaniniuntukbergabungkegrupwhatsapp/gi;
        if (!linkRegex.test(m.text)) return;

        // Check if it's antilink V1 or V2
        const inV1 = antilink.includes(m.chat);
        const inV2 = antilink2.includes(m.chat);
        if (!inV1 && !inV2) return;

        // Get group invite code
        const gclink = 'https://chat.whatsapp.com/' + await Skyzo.groupInviteCode(m.chat);
        const isLinkThisGc = new RegExp(gclink, 'i');
        const isgclink = isLinkThisGc.test(m.text);
        if (isgclink) return; // skip if it's this group's own link

        const delet = m.key.participant;
        const bang = m.key.id;

        if (inV1) {
            // V1: kick + delete
            await Skyzo.sendMessage(m.chat, {
                text: `Gausah sharelink ngentod, mampus gw kick`,
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        thumbnailUrl: global.image,
                        title: `${global.branding} - Antilink`,
                        previewType: 'PHOTO',
                    },
                },
            }, { quoted: m });
            await Skyzo.sendMessage(m.chat, {
                delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet },
            });
            await Skyzo.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
        } else if (inV2) {
            // V2: delete only
            await Skyzo.sendMessage(m.chat, {
                text: `🚫🔗`,
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        thumbnailUrl: global.image,
                        title: `${global.branding} - Antilink`,
                        previewType: 'PHOTO',
                    },
                },
            }, { quoted: m });
            await Skyzo.sendMessage(m.chat, {
                delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet },
            });
        }
    } catch (err) {
        console.error('[ERROR] antilink:', err);
    }
}
