/**
 * commands/menu.js - All menu commands
 * By Angga Official
 */

const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = require('@whiskeysockets/baileys');
const fs = require('fs');
const axios = require('axios');

module.exports = async (ctx) => {
    const { Skyzo, m, command, isOwner, isPremium, qchanel, msg, fetchJson } = ctx;

    switch (command) {
        case '.angganesia':
        case 'angganesia':
        case 'menu': {
            const teksnya = `
𝐇𝐄𝐋𝐋𝐎 🙋

◦ 𝘉𝘰𝘵 𝘕𝘢𝘮𝘦 : ${global.namabot}
◦ 𝘖𝘸𝘯𝘦𝘳 𝘕𝘢𝘮𝘦 : ${global.ownerName}
◦ 𝘉𝘳𝘢𝘯𝘥𝘪𝘯𝘨 : ${global.branding}
◦ 𝘝𝘦𝘳𝘴𝘪𝘰𝘯 : v3.0.0

Ketik command berikut untuk akses menu:
• .allmenu - Lihat semua fitur
• .mainmenu - Menu utama
• .downloadmenu - Menu download
• .convertmenu - Menu konverter
• .panelmenu - Menu panel
• .pushkontakmenu - Menu pushkontak
• .grupmenu - Menu grup
• .ownermenu - Menu owner

© ${global.branding}
`;
            return Skyzo.sendMessage(m.chat, {
                text: teksnya,
                mentions: [m.sender],
            }, { quoted: qchanel });
        }

        case 'allmenu': {
            const teks = `
𝐀𝐋𝐋 𝐌𝐄𝐍𝐔 - ${global.branding}

*𝗠𝗮𝗶𝗻 𝗠𝗲𝗻𝘂*
• play
• tourl
• yts
• tohd
• chatgpt
• ai
• remini
• sticker
• pinterest
• qc

*𝗟𝗶𝘀𝘁 𝗣𝗿𝗼𝗱𝘂𝗸*
• panel
• other

*𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗠𝗲𝗻𝘂*
• tiktok
• tiktokmp3
• tiktokaudio
• facebook
• ytmp3
• mediafire

*𝗖𝗩 𝗠𝗲𝗻𝘂*
• toaudio
• tomp3
• tovn
• toptv
• tts
• toimage
• sticker

*𝗣𝗮𝗻𝗲𝗹 𝗠𝗲𝗻𝘂*
• addadmin
• addpanel
• adduser
• listserver
• listadmin
• listmember
• deladmin
• delpanel
• deluser

*𝗣𝘂𝘀𝗵𝗸𝗼𝗻 𝗠𝗲𝗻𝘂*
• pushkontak
• pushkontak1
• pushkontak2
• savekontak
• savekontak2
• listgc
• idgc
• jpm
• jpm2
• jpmpoll
• jpmtesti
• jpmhidetag
• startjpm
• setteksjpm
• teksjpm

*𝗚𝗿𝗼𝘂𝗽 𝗠𝗲𝗻𝘂*
• addmember
• antilink
• antilinkV2
• hidetag
• tagall
• delete
• open / close
• setnamagc
• setdeskgc
• setppgc
• kick
• promote
• demote
• leavegc
• leavegc2

*𝗢𝘄𝗻𝗲𝗿 𝗠𝗲𝗻𝘂*
• addown / delown / listown
• addprem / delprem / listprem
• clearsession
• anticall
• autoread
• welcome
• setppbot
• setpppanjang
• setbiobot
• public / self
• get

© ${global.branding}
`;
            return Skyzo.sendMessage(m.chat, {
                text: teks,
                mentions: [m.sender],
            }, { quoted: qchanel });
        }

        case 'mainmenu': {
            const teks = `
*𝗠𝗮𝗶𝗻 𝗠𝗲𝗻𝘂*

• play
• tourl
• yts
• tohd
• chatgpt
• ai
• remini
• sticker
• pinterest
• qc

© ${global.branding}
`;
            return Skyzo.sendMessage(m.chat, { text: teks, mentions: [m.sender] }, { quoted: qchanel });
        }

        case 'downloadmenu': {
            const teks = `
*𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗠𝗲𝗻𝘂*

• tiktok
• tiktokmp3
• tiktokaudio
• facebook
• ytmp3
• mediafire

© ${global.branding}
`;
            return Skyzo.sendMessage(m.chat, { text: teks, mentions: [m.sender] }, { quoted: qchanel });
        }

        case 'produkmenu': {
            const teks = `
*𝗟𝗶𝘀𝘁 𝗣𝗿𝗼𝗱𝘂𝗸*

• panel
• other

© ${global.branding}
`;
            return Skyzo.sendMessage(m.chat, { text: teks, mentions: [m.sender] }, { quoted: qchanel });
        }

        case 'pushkontakmenu': {
            const teks = `
*𝗣𝘂𝘀𝗵𝗸𝗼𝗻 𝗠𝗲𝗻𝘂*

• pushkontak
• pushkontak1
• pushkontak2
• savekontak
• savekontak2
• listgc
• idgc
• jpm
• jpm2
• jpmpoll
• jpmtesti
• jpmhidetag
• startjpm
• setteksjpm
• teksjpm

© ${global.branding}
`;
            return Skyzo.sendMessage(m.chat, { text: teks, mentions: [m.sender] }, { quoted: qchanel });
        }

        case 'convertmenu': {
            const teks = `
*𝗖𝗩 𝗠𝗲𝗻𝘂*

• toaudio
• tomp3
• tovn
• toptv
• tts
• toimage
• tourl
• sticker / s

© ${global.branding}
`;
            return Skyzo.sendMessage(m.chat, { text: teks, mentions: [m.sender] }, { quoted: qchanel });
        }

        case 'panelmenu': {
            const teks = `
*𝗣𝗮𝗻𝗲𝗹 𝗠𝗲𝗻𝘂*

• addadmin
• addpanel
• adduser
• listserver
• listadmin
• listmember
• deladmin
• delpanel
• deluser

© ${global.branding}
`;
            return Skyzo.sendMessage(m.chat, { text: teks, mentions: [m.sender] }, { quoted: qchanel });
        }

        case 'grupmenu': {
            const teks = `
*𝗚𝗿𝗼𝘂𝗽 𝗠𝗲𝗻𝘂*

• addmember
• antilink
• antilinkV2
• hidetag
• tagall
• delete
• open / close
• setnamagc
• setdeskgc
• setppgc
• kick
• promote
• demote
• leavegc
• leavegc2

© ${global.branding}
`;
            return Skyzo.sendMessage(m.chat, { text: teks, mentions: [m.sender] }, { quoted: qchanel });
        }

        case 'ownermenu': {
            const teks = `
*𝗢𝘄𝗻𝗲𝗿 𝗠𝗲𝗻𝘂*

• addown / delown / listown
• addprem / delprem / listprem
• clearsession
• anticall
• autoread
• welcome
• payment
• setppbot
• setpppanjang
• setbiobot
• public / self
• get
• sc

© ${global.branding}
`;
            return Skyzo.sendMessage(m.chat, { text: teks, mentions: [m.sender] }, { quoted: qchanel });
        }

        default:
            return false;
    }
};
