/**
 * config.js - Configuration Center
 * ===================================================
 * Edit file ini sesuai kebutuhan kamu.
 * By Angga Official
 */

// ============================================================
// SECTION 1: OWNER & BOT IDENTITY
// ============================================================

// GANTI dengan nomor WhatsApp kamu (format: 62xxx, tanpa tanda + atau spasi)
// Contoh: "ISI_NOMOR_OWNER_DISINI"
global.owner = "ISI_NOMOR_OWNER_DISINI"; // ⚠️ WAJIB GANTI!
global.ownerName = "Angga";
global.namabot = "Angga Bot";
global.botName = "Angga Official";
global.branding = "Angga Official";
global.packname = "Angga Official";
global.author = "Angga";

// Nomor yang ditampilkan di command "owner" (".owner", ".creator")
// Default pakai global.owner, otomatis terformat
global.ownerNumber = global.owner;

// ============================================================
// SECTION 2: DATABASE PATHS
// ============================================================

global.dbowner = "./all/database/owner.json";
global.dbprem = "./all/database/premium.json";
global.dbantilink = "./all/database/antilink.json";
global.dbantilink2 = "./all/database/antilink2.json";
global.dbcontacts = "./all/database/contacts.json";
global.dbteksjpm = "./all/database/teksjpm.js";

// ============================================================
// SECTION 3: BOT MODE & TOGGLES
// ============================================================

global.autoread = false;       // Auto-read messages (private/group)
global.autoread2 = false;      // Auto-read status
global.anticall = false;       // Reject incoming calls
global.welcome = false;        // Welcome new group members
global.selfmode = false;       // true = only owner can use; false = public

// ============================================================
// SECTION 4: JPM & Pushkontak Delay
// ============================================================

global.delayjpm = 4000;          // delay antar kirim pesan JPM (ms)
global.delaypushkontak = 3000;   // delay antar push kontak (ms)

// ============================================================
// SECTION 5: Pterodactyl Panel (Placeholder - isi sendiri)
// ============================================================

global.domain = "https://panel.kamu.com";     // URL panel Pterodactyl
global.domain2 = "panel.kamu.com";            // URL tanpa https
global.apikey = "ptla_xxxxxxxx";              // Application API key (ptla_...)
global.capikey = "ptlc_xxxxxxxx";             // Client API key (ptlc_...)
global.egg = "5";                              // Egg ID
global.loc = "1";                             // Location ID
global.idsaluran = "-";                       // WhatsApp Channel ID (untuk jpmtesti)

// ============================================================
// SECTION 6: Payment Methods (Placeholder - isi sendiri)
// ============================================================

global.dana = false;       // ganti dengan nomor Dana (contoh: "08123456789")
global.ovo = false;        // ganti dengan nomor Ovo
global.gopay = false;      // ganti dengan nomor Gopay
global.shopeepay = false;  // ganti dengan nomor ShopeePay
global.qris = false;       // ganti dengan kode QRIS / URL QRIS
global.bri = false;        // ganti dengan nomor rekening BRI

global.syarat1 = "Note: Pembayaran hanya 1x untuk semua transaksi. Tidak ada biaya tambahan.";
global.syarat2 = "Kirim bukti transfer ke owner setelah pembayaran berhasil.";

// ============================================================
// SECTION 7: Default Media & Links
// ============================================================

global.image = "https://telegra.ph/file/caa9288c34034e5bb8d28.png"; // default thumb
global.thumb = "https://telegra.ph/file/caa9288c34034e5bb8d28.png";
global.gcwa = "https://chat.whatsapp.com/BkzEf70UB2K0MDImEX62hh";   // group WA utama
global.ytch = "https://www.youtube.com/@Bacotamatpro03";
global.tele = "t.me/CobaDuluBaru";

// ============================================================
// SECTION 8: Styling / Fancy chars (untuk command "tes")
// ============================================================

global.kbh = "𝐁"; global.knh = "𝐎"; global.lay = "𝐓"; global.koz = "𝐎";
global.nio = "𝐍"; global.ytt = "𝐋"; global.jmi = "𝐈"; global.pxs = "𝐍";
global.men = "𝐄"; global.wkm = "𝐄"; global.zhl = "𝐇"; global.epe = "𝐄";

// ============================================================
// SECTION 9: Session Folder
// ============================================================

global.sessionPath = "./session";

// ============================================================
// SECTION 10: Pairing Code Settings
// ============================================================

// Nomor untuk request pairing code (format: 62xxx, tanpa + atau spasi)
// Akan dipakai saat pertama kali bot start sebelum tersambung
global.pairingNumber = global.owner; // default = owner number

// Browser info untuk Baileys
global.browserName = ["Angga Bot", "Chrome", "1.0.0"];

// ============================================================
// END OF CONFIG
// ============================================================

module.exports = {
    owner: global.owner,
    ownerName: global.ownerName,
    namabot: global.namabot,
    botName: global.botName,
    branding: global.branding,
    packname: global.packname,
    author: global.author,
    ownerNumber: global.ownerNumber,
    dbowner: global.dbowner,
    dbprem: global.dbprem,
    dbantilink: global.dbantilink,
    dbantilink2: global.dbantilink2,
    dbcontacts: global.dbcontacts,
    dbteksjpm: global.dbteksjpm,
    autoread: global.autoread,
    autoread2: global.autoread2,
    anticall: global.anticall,
    welcome: global.welcome,
    selfmode: global.selfmode,
    delayjpm: global.delayjpm,
    delaypushkontak: global.delaypushkontak,
    domain: global.domain,
    domain2: global.domain2,
    apikey: global.apikey,
    capikey: global.capikey,
    egg: global.egg,
    loc: global.loc,
    idsaluran: global.idsaluran,
    dana: global.dana,
    ovo: global.ovo,
    gopay: global.gopay,
    shopeepay: global.shopeepay,
    qris: global.qris,
    bri: global.bri,
    syarat1: global.syarat1,
    syarat2: global.syarat2,
    image: global.image,
    thumb: global.thumb,
    gcwa: global.gcwa,
    ytch: global.ytch,
    tele: global.tele,
    sessionPath: global.sessionPath,
    pairingNumber: global.pairingNumber,
    browserName: global.browserName,
};
