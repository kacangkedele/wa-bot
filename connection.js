/**
 * src/connection.js - Baileys Connection Handler
 * =====================================================
 * Setup koneksi WhatsApp + Pairing Code + Reconnect logic
 * By Angga Official
 * =====================================================
 */

const fs = require('fs');
const path = require('path');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, proto } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const P = require('pino');
const chalk = require('chalk');
const { execSync } = require('child_process');
const axios = require('axios');

// Pretty logging helper
const color = (text, c) => {
    if (!c) return text;
    const colors = {
        red: chalk.red,
        green: chalk.green,
        yellow: chalk.yellow,
        blue: chalk.blue,
        cyan: chalk.cyan,
        white: chalk.white,
        magenta: chalk.magenta,
    };
    return colors[c] ? colors[c](text) : text;
};

// Pairing code sudah pernah diminta?
let pairingCodeRequested = false;
let pairingCodeRetryCount = 0;
const MAX_PAIRING_RETRIES = 3;

async function startBot() {
    // Setup auth state (multi-file)
    const { state, saveCreds } = await useMultiFileAuthState(global.sessionPath);

    // Inisialisasi store (simple in-memory)
    const store = global.store || require('./store.js');

    // Buat socket Baileys
    const Skyzo = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,  // Pairing code mode
        auth: state,
        browser: global.browserName,
        markOnline: true,
        getMessage: async (key) => {
            try {
                const msg = store.loadMessage ? store.loadMessage(key.remoteJid, key.id) : null;
                return msg?.message || undefined;
            } catch (e) {
                return undefined;
            }
        },
        linkPreviewMobile: false,
        generateHighQualityLinkPreview: true,
        defaultQueryTimeoutMs: 60000,
        keepAliveIntervalMs: 30000,
    });

    // Bind store update if applicable
    if (typeof store.bind === 'function') {
        try { store.bind(Skyzo.ev); } catch (_) {}
    }

    // Save credentials on update
    Skyzo.ev.on('creds.update', saveCreds);

    // ============================================================
    // PAIRING CODE LOGIC
    // ============================================================
    Skyzo.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update || {};

        if (qr) {
            // Jangan print QR, tapi fallback kalau pairing code gagal
            console.log('\n[QR] QR Code diterima. Tapi pairing code mode aktif, abaikan.');
            console.log('[QR] Kalau pairing code gagal, ganti ke printQRInTerminal: true.');
        }

        if (connection === 'close') {
            const statusCode = new Boom(lastDisconnect?.error).output.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

            if (statusCode === DisconnectReason.loggedOut) {
                console.log('\n[INFO] Bot logged out. Hapus folder session dan start ulang.');
                console.log('[INFO] Run: rm -rf ./session && node server.js\n');
                process.exit(0);
            }

            if (statusCode === DisconnectReason.connectionLost) {
                console.log('\n[WARN] Koneksi hilang. Mencoba reconnect dalam 3 detik...');
                await sleep(3000);
                return startBot();
            }

            if (shouldReconnect) {
                console.log(`\n[WARN] Koneksi terputus (code: ${statusCode}). Reconnect dalam 3 detik...`);
                await sleep(3000);
                return startBot();
            }

            console.log(`\n[ERROR] Koneksi tertutup permanen (code: ${statusCode}).`);
            return;
        }

        if (connection === 'connecting') {
            console.log('[INFO] Menghubungkan ke WhatsApp...');
        }

        if (connection === 'open') {
            // Reset retry counter kalau berhasil connect
            pairingCodeRetryCount = 0;

            const botNumber = Skyzo.user?.id?.split(':')[0] || 'Unknown';
            console.log('\n' + chalk.greenBright('╔══════════════════════════════════════╗'));
            console.log(chalk.greenBright('║  ✓ BOT BERHASIL TERHUBUNG!            ║'));
            console.log(chalk.greenBright('╚══════════════════════════════════════╝'));
            console.log(chalk.cyan(`[BOT] Nomor  : ${botNumber}`));
            console.log(chalk.cyan(`[BOT] Status : Online & Ready`));
            console.log(chalk.cyan(`[BOT] Brand  : ${global.branding}`));
            console.log('\n[INFO] Ketik pesan di WhatsApp untuk test command, contoh: .tes\n');
        }
    });

    // ============================================================
    // PAIRING CODE - First time setup
    // ============================================================
    if (!state.creds.registered && !pairingCodeRequested) {
        const phoneNumber = (global.pairingNumber || global.owner || "").replace(/[^0-9]/g, '');

        if (!phoneNumber || phoneNumber === "ISI_NOMOR_OWNER_DISINI") {
            console.log('\n' + chalk.yellowBright('╔══════════════════════════════════════════════════╗'));
            console.log(chalk.yellowBright('║  ⚠️  PAIRING CODE TIDAK BISA DIJALANKAN          ║'));
            console.log(chalk.yellowBright('╠══════════════════════════════════════════════════╣'));
            console.log(chalk.yellowBright('║  Nomor owner masih placeholder di config.js!     ║'));
            console.log(chalk.yellowBright('║                                                  ║'));
            console.log(chalk.yellowBright('║  Edit config.js, ganti "ISI_NOMOR_OWNER_DISINI"  ║'));
            console.log(chalk.yellowBright('║  dengan nomor WhatsApp kamu (format 62xxx).     ║'));
            console.log(chalk.yellowBright('║                                                  ║'));
            console.log(chalk.yellowBright('║  Lalu jalankan: node server.js                   ║'));
            console.log(chalk.yellowBright('╚══════════════════════════════════════════════════╝\n'));
            process.exit(1);
        }

        pairingCodeRequested = true;
        console.log('\n[INFO] Meminta pairing code untuk nomor:', chalk.cyan(phoneNumber));

        try {
            // Delay 2 detik biar socket siap
            await sleep(2000);

            const code = await Skyzo.requestPairingCode(phoneNumber);
            const formatted = code?.match(/.{1,4}/g)?.join('-') || code;

            console.log('\n' + chalk.greenBright('╔════════════════════════════════════════════╗'));
            console.log(chalk.greenBright('║      PAIRING CODE BERHASIL DIBUAT!         ║'));
            console.log(chalk.greenBright('╠════════════════════════════════════════════╣'));
            console.log(chalk.greenBright('║                                            ║'));
            console.log(chalk.whiteBright(chalk.bgBlackBright(`              ${formatted}              `)));
            console.log(chalk.greenBright('║                                            ║'));
            console.log(chalk.greenBright('║  Cara pakai:                               ║'));
            console.log(chalk.greenBright('║  1. Buka WhatsApp di HP                    ║'));
            console.log(chalk.greenBright('║  2. Settings > Linked Devices              ║'));
            console.log(chalk.greenBright('║  3. Tap "Link with phone number"           ║'));
            console.log(chalk.greenBright('║  4. Masukkan kode di atas                  ║'));
            console.log(chalk.greenBright('║  5. Tunggu sampai terhubung                ║'));
            console.log(chalk.greenBright('║                                            ║'));
            console.log(chalk.greenBright('╚════════════════════════════════════════════╝\n'));
        } catch (err) {
            pairingCodeRequested = false;
            pairingCodeRetryCount++;
            console.error(`\n[ERROR] Gagal request pairing code (attempt ${pairingCodeRetryCount}):`, err?.message || err);

            if (pairingCodeRetryCount >= MAX_PAIRING_RETRIES) {
                console.error('[ERROR] Maksimal retry pairing code tercapai. Coba hapus folder ./session dan run ulang.');
                process.exit(1);
            }
            console.log('[INFO] Mencoba ulang dalam 5 detik...');
            await sleep(5000);
            return startBot();
        }
    }

    // ============================================================
    // MESSAGE UPDATES - Route ke message handler
    // ============================================================
    Skyzo.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            if (!chatUpdate.messages?.length) return;

            for (const m of chatUpdate.messages) {
                if (!m.message) continue;
                if (m.key.fromMe) {
                    // self mode: tetap proses biar owner bisa pakai
                    if (!global.selfmode) continue;
                }
                if (global.selfmode && !isOwnerMessage(m)) continue;

                // Anti-spam: skip messages older than 60s
                const msgTime = m.messageTimestamp ? Number(m.messageTimestamp) * 1000 : Date.now();
                if (Date.now() - msgTime > 60000) continue;

                await require('./message.js')(Skyzo, m, store);
            }
        } catch (err) {
            console.error('[ERROR] message handler:', err);
        }
    });

    // ============================================================
    // GROUP PARTICIPANTS UPDATE (Welcome/Leave)
    // ============================================================
    Skyzo.ev.on('group-participants.update', async (data) => {
        try {
            if (!global.welcomeEnabled) return;
            await handleGroupUpdate(Skyzo, data);
        } catch (err) {
            console.error('[ERROR] group update:', err);
        }
    });

    // ============================================================
    // CALL HANDLER (anticall)
    // ============================================================
    Skyzo.ev.on('call', async (calls) => {
        try {
            if (!global.anticallEnabled) return;
            if (!Array.isArray(calls) || calls.length === 0) return;

            for (const call of calls) {
                if (call.status === 'offer') {
                    await Skyzo.rejectCall(call.id, call.from);
                    console.log(`[ANTICALL] Rejected call from ${call.from}`);
                }
            }
        } catch (err) {
            console.error('[ERROR] call handler:', err);
        }
    });

    // ============================================================
    // Auto-read messages (kalau global.autoreadEnabled = true)
    // ============================================================
    Skyzo.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            if (!global.autoreadEnabled) return;
            for (const m of chatUpdate.messages) {
                await Skyzo.readMessages([m.key]);
            }
        } catch (err) {
            // silent fail
        }
    });

    // ============================================================
    // Presence update (auto read status)
    // ============================================================
    Skyzo.ev.on('presence.update', async ({ id, presences }) => {
        // Optional: log presence
    });

    // Expose global helpers
    global.Skyzo = Skyzo;
    global.proto = proto;

    return Skyzo;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function isOwnerMessage(m) {
    try {
        const ownerJid = global.owner + '@s.whatsapp.net';
        return m.key?.participant === ownerJid || m.key?.remoteJid === ownerJid;
    } catch {
        return false;
    }
}

async function handleGroupUpdate(Skyzo, data) {
    try {
        const { id: groupId, participants, action } = data;
        if (!participants?.length) return;

        const metadata = await Skyzo.groupMetadata(groupId).catch(() => null);
        if (!metadata) return;

        for (const participant of participants) {
            const number = participant.split('@')[0];
            if (action === 'add') {
                const welcomeText = `Welcome @${number} di grup *${metadata.subject}*!\nSelamat bergabung dan jangan lupa baca deskripsi grup ya.`;
                await Skyzo.sendMessage(groupId, {
                    text: welcomeText,
                    mentions: [participant],
                });
            } else if (action === 'remove') {
                const leaveText = `Goodbye @${number}.\nSemoga tenang di alam baka.`;
                await Skyzo.sendMessage(groupId, {
                    text: leaveText,
                    mentions: [participant],
                });
            }
        }
    } catch (err) {
        console.error('[ERROR] handleGroupUpdate:', err);
    }
}

async function getBaileysVersion() {
    try {
        const pkg = require('@whiskeysockets/baileys/package.json');
        const version = pkg.version.split('.').map(Number);
        if (version.length >= 3) return version;
        return [6, 7, 18];
    } catch {
        return [6, 7, 18];
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    startBot,
    color,
};
