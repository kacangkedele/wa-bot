/**
 * commands/main.js - Main/Misc commands (tes, halo, motivasi, dll)
 * By Angga Official
 */

module.exports = async (ctx) => {
    const { Skyzo, m, command, isOwner, msg, text } = ctx;

    switch (command) {
        case 'tes':
        case 'test':
        case 'testbot':
        case 'on':
        case 'online': {
            return m.reply('Bot aktif & online ✅ - ' + global.branding);
        }

        case 'bot': {
            return m.reply('Ada?');
        }

        case 'halo':
        case 'hai':
        case 'Halo':
        case 'Hai': {
            return m.reply('Hai juga! Ada yang bisa dibantu?');
        }

        case "assalamu'alaikum":
        case 'Assalamu alaikum':
        case 'Assalamualaikum':
        case 'assalamualaikum':
        case 'p':
        case 'P':
        case 'salam': {
            return m.reply("Waalaikumsalam");
        }

        case 'motivasi':
        case 'motivation': {
            const quotes = [
                'Jangan pernah menyerah pada apa yang ingin kamu capai. Orang sukses adalah orang yang tidak pernah menyerah.',
                'Kesuksesan adalah perpaduan antara kerja keras, ketekunan, dan kepercayaan diri.',
                'Hari ini adalah hari yang tepat untuk memulai. Besok mungkin terlambat.',
                'Kegagalan adalah kesuksesan yang tertunda. Tetap semangat!',
                'Jadilah versi terbaik dari dirimu, bukan tiruan orang lain.',
                'Cintai prosesnya, maka hasilnya akan menghampiri.',
                'Pemimpin masa depan adalah mereka yang berani mengambil risiko hari ini.',
            ];
            const quote = quotes[Math.floor(Math.random() * quotes.length)];
            return m.reply(`*Motivasi*\n\n${quote}\n\n© ${global.branding}`);
        }

        case 'motivasi1': {
            return m.reply('Ingatlah: sehitam-hitamnya batang, yang keluar pasti putih.');
        }

        case 'motivasi2': {
            return m.reply('Jaga kesehatan ya, minum susu tiap hari.');
        }

        case 'japanese':
        case 'japanesse':
        case 'loli':
        case 'jepang': {
            return m.reply('Astaghfirullah, jaga iman ya kak.');
        }

        case 'kamu':
        case 'lu':
        case 'gw':
        case 'diriku':
        case 'aku': {
            return m.reply('Wujud asli kamu adalah keajaiban dunia.');
        }

        case 'menu': {
            return m.reply(`Salah format! 😅

Coba ketik: .AnggaNesia atau .allmenu untuk lihat semua fitur.
Atau pilih kategori menu yang lebih spesifik di .allmenu.`);
        }

        case 'meny': {
            return m.reply('Yahaha typo ya dek, coba cek lagi command-nya.');
        }

        case 'owner':
        case 'creator': {
            try {
                const ownerNum = global.owner.replace(/[^0-9]/g, '');
                const vcard = `BEGIN:VCARD\nVERSION:3.0\nN:${global.ownerName};;;\nFN:${global.ownerName}\nTEL;type=CELL;type=VOICE;waid=${ownerNum}:${ownerNum}\nEND:VCARD`;
                return Skyzo.sendMessage(m.chat, {
                    contacts: {
                        displayName: global.ownerName,
                        contacts: [{ vcard }],
                    },
                }, { quoted: m });
            } catch (err) {
                return m.reply('Owner: ' + global.owner);
            }
        }

        case 'linkgc': {
            return m.reply(global.gcwa || 'https://chat.whatsapp.com/');
        }

        case 'panel':
        case 'listpanel':
        case 'listpnl': {
            return m.reply(`🔗 Group diskusi & update:\n${global.gcwa || 'https://chat.whatsapp.com/'}`);
        }

        case 'listsuntik':
        case 'suntik': {
            return m.reply(`1k 5subs
2k 10subs
3k 15subs
4k 20subs
5k 25subs
6k 30subs
7k 35subs
8k 40subs
9k 45subs
10k 50subs
11k 55subs`);
        }

        case 'other': {
            return m.reply(`
${global.branding}

LIST PRODUK:
• VPS (DIGITAL OCEAN, LINODE, VULTR)
• JASA INSTAL PANEL PTERODACTYL
• JASA INSTAL WINGS
• JASA INSTAL THEME
• JASA FIX NODE MERAH
• HOSTING BOT WA
• HOSTING MINECRAFT
• HOSTING PRIVATE MINECRAFT PREMIUM
• RESELLER | ADMIN | PT | OWN PANEL BOT WA
• JASA RENAME/FIX/TAMBAH FITUR SC
• MURBAN/MURUNBAN WA
• BAN/UNBAN WA
• NOKOS INDO/LUAR
• MURID NOKOS
• MURID TEMPOR WA
• MURID SADAP/PHISING APK/WEB
• SC THEME PTERODACTYL
• SC BOT WHATSAPP
• SUBDOMAIN
• RESELLER SUBDOMAIN
• DOMAIN

----
> DLL Tanyakan Saja

_SOCIAL MEDIA_
YT  : ${global.ytch}
TELE: ${global.tele}

_Only_
wa.me/${global.owner}
`);
        }

        default:
            return false;
    }
};
