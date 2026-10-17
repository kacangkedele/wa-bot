/**
 * commands/owner.js - Owner & Premium management
 * By Angga Official
 */

module.exports = async (ctx) => {
    const {
        Skyzo, m, command, args, text, isOwner, isGroup,
        zippokun, zippokuy, saveDB, msg, example,
    } = ctx;

    switch (command) {
        case 'addown':
        case 'addowner': {
            if (!isOwner) return m.reply(msg.owner);
            let users = m.mentionedJid?.[0]
                ? m.mentionedJid
                : m.quoted
                    ? [m.quoted.sender]
                    : text
                        ? [text.replace(/[^0-9]/g, '') + '@s.whatsapp.net']
                        : [];
            if (!users.length || !text) {
                return m.reply(example('nomor\n\nContoh: .addown 628123456789'));
            }
            if (users.filter(v => zippokun.includes(v)).length) {
                return Skyzo.sendMessage(m.chat, {
                    text: `${users.map(v => `@${v.split('@')[0]}`).join(', ')} sudah jadi owner.`,
                    mentions: users,
                }, { quoted: m });
            }
            const newOwners = [...zippokun, ...users];
            saveDB(global.dbowner, newOwners);
            return m.reply('✅ Successfully added owner by ' + global.branding);
        }

        case 'delown':
        case 'delowner': {
            if (!isOwner) return m.reply(msg.owner);
            let users = m.mentionedJid?.[0]
                ? m.mentionedJid
                : m.quoted
                    ? [m.quoted.sender]
                    : text
                        ? [text.replace(/[^0-9]/g, '') + '@s.whatsapp.net']
                        : [];
            if (!users.length || !text) {
                return m.reply(example('nomor\n\nContoh: .delown 628123456789'));
            }
            if (users.filter(v => !zippokun.includes(v)).length) {
                return Skyzo.sendMessage(m.chat, {
                    text: `${users.map(v => `@${v.split('@')[0]}`).join(', ')} belum masuk ke list owner!`,
                    mentions: users,
                }, { quoted: m });
            }
            const filtered = zippokun.filter(v => !users.includes(v));
            saveDB(global.dbowner, filtered);
            return m.reply('✅ Successfully removed owner by ' + global.branding);
        }

        case 'listown':
        case 'listowner': {
            const list = zippokun.length > 0
                ? zippokun.map(v => `- @${v.split('@')[0]}`).join('\n')
                : '(kosong)';
            return Skyzo.sendMessage(m.chat, {
                text: `𝐋𝐈𝐒𝐓 𝐎𝐖𝐍𝐄𝐑\n\n${list}\n\nTotal: ${zippokun.length}`,
                mentions: zippokun,
            }, { quoted: m });
        }

        case 'addprem':
        case 'addpremium': {
            if (!isOwner) return m.reply(msg.owner);
            let users = m.mentionedJid?.[0]
                ? m.mentionedJid
                : m.quoted
                    ? [m.quoted.sender]
                    : text
                        ? [text.replace(/[^0-9]/g, '') + '@s.whatsapp.net']
                        : [];
            if (!users.length || !text) {
                return m.reply(example('nomor\n\nContoh: .addprem 628123456789'));
            }
            if (users.filter(v => zippokuy.includes(v)).length) {
                return Skyzo.sendMessage(m.chat, {
                    text: `${users.map(v => `@${v.split('@')[0]}`).join(', ')} sudah masuk ke list premium!`,
                    mentions: users,
                }, { quoted: m });
            }
            const newPrems = [...zippokuy, ...users];
            saveDB(global.dbprem, newPrems);
            return m.reply('✅ Successfully added premium by ' + global.branding);
        }

        case 'delprem':
        case 'delpremium': {
            if (!isOwner) return m.reply(msg.owner);
            let users = m.mentionedJid?.[0]
                ? m.mentionedJid
                : m.quoted
                    ? [m.quoted.sender]
                    : text
                        ? [text.replace(/[^0-9]/g, '') + '@s.whatsapp.net']
                        : [];
            if (!users.length || !text) {
                return m.reply('Tag seseorang atau ketik nomor!');
            }
            if (users.filter(v => !zippokuy.includes(v)).length) {
                return Skyzo.sendMessage(m.chat, {
                    text: `${users.map(v => `@${v.split('@')[0]}`).join(', ')} belum masuk ke list premium!`,
                    mentions: users,
                }, { quoted: m });
            }
            const filtered = zippokuy.filter(v => !users.includes(v));
            saveDB(global.dbprem, filtered);
            return m.reply('✅ Successfully removed premium by ' + global.branding);
        }

        case 'listprem':
        case 'listpremium': {
            const list = zippokuy.length > 0
                ? zippokuy.map(v => `- @${v.split('@')[0]}`).join('\n')
                : '(kosong)';
            return Skyzo.sendMessage(m.chat, {
                text: `𝐋𝐈𝐒𝐓 𝐏𝐑𝐄𝐌𝐈𝐔𝐌\n\n${list}\n\nTotal: ${zippokuy.length}`,
                mentions: zippokuy,
            }, { quoted: m });
        }

        default:
            return false;
    }
};
