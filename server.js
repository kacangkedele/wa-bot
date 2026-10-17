/**
 * server.js - Main Entry Point
 * =====================================================
 * WhatsApp Bot with Pairing Code
 * By Angga Official
 * =====================================================
 * Cara pakai (Termux):
 *   1. npm install
 *   2. node server.js
 *   3. Masukkan pairing code yang muncul di WhatsApp
 * =====================================================
 */

// Load config pertama kali
require('./config.js');

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const P = require('pino');

// Pastikan folder session ada
if (!fs.existsSync(global.sessionPath)) {
    fs.mkdirSync(global.sessionPath, { recursive: true });
}

// Pastikan folder tmp ada
if (!fs.existsSync('./all/tmp')) {
    fs.mkdirSync('./all/tmp', { recursive: true });
}

// Pastikan file database ada, kalau nggak bikin dengan default
const dbFiles = [
    { path: global.dbowner, content: '[]' },
    { path: global.dbprem, content: '[]' },
    { path: global.dbantilink, content: '[]' },
    { path: global.dbantilink2, content: '[]' },
    { path: global.dbcontacts, content: '[]' },
];

for (const db of dbFiles) {
    if (!fs.existsSync(db.path)) {
        fs.writeFileSync(db.path, db.content);
        console.log(`[DB] Created: ${db.path}`);
    }
}

// Pastikan teksjpm.js ada
if (!fs.existsSync(global.dbteksjpm)) {
    fs.writeFileSync(global.dbteksjpm, `export const teksjpm = \`Halo! Bot Angga Official aktif. Fitur lengkap, jalankan command .menu untuk lihat semua fitur.\`;\n`);
    console.log(`[DB] Created: ${global.dbteksjpm}`);
}

// Inisialisasi Baileys connection
const { startBot } = require('./src/connection.js');

// Global store for messages
global.store = require('./src/store.js');

// Welcome message state
global.welcomeEnabled = global.welcome || false;

// Anti-call state
global.anticallEnabled = global.anticall || false;

// Auto-read state
global.autoreadEnabled = global.autoread || false;

// Print banner
console.log(`
╔════════════════════════════════════════╗
║      ${global.branding} - WA Bot       ║
║         Pairing Code Edition            ║
╚════════════════════════════════════════╝

Author : ${global.ownerName}
Bot    : ${global.namabot}
Session: ${global.sessionPath}

Starting bot...
`);

// Cek nomor owner
if (global.owner === "ISI_NOMOR_OWNER_DISINI") {
    console.warn('\n⚠️  PERINGATAN: Nomor owner masih placeholder!');
    console.warn('   Edit file config.js, ganti "ISI_NOMOR_OWNER_DISINI" dengan nomor WhatsApp kamu.');
    console.warn('   Format: 62xxx (contoh: 62895411941384)\n');
}

// Start bot
startBot().catch(err => {
    console.error('[FATAL] Failed to start bot:', err);
    process.exit(1);
});

// Watch for file changes (auto-reload server.js)
let isRestarting = false;
fs.watchFile(__filename, () => {
    if (isRestarting) return;
    isRestarting = true;
    console.log('\n[INFO] server.js updated, restarting...\n');
    spawnSync(process.argv[0], process.argv.slice(1), { stdio: 'inherit' });
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('[UNCAUGHT EXCEPTION]', err);
});

process.on('unhandledRejection', (err) => {
    console.error('[UNHANDLED REJECTION]', err);
});
