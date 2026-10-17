/**
 * commands/group.js - Group management commands
 * antilink, hidetag, tagall, kick, promote, demote, open, close, etc.
 * By Angga Official
 */

const fs = require('fs');

module.exports = async (ctx) => {
    const {
        Skyzo, m, command, args, text, isOwner, isGroup, isAdmin, isBotAdmin,
        groupMetadata, antilink, antilink2, saveDB, msg, example, generateProfilePicture,
    } = ctx;

    switch (command) {
        case 'antilink': {
            if (!isGroup) return m.reply(msg.group);
            if (!isAdmin && !isOwner) return m.reply(msg.admin);
            if (!isBotAdmin) return m.reply(msg.adminbot);
            if (!args[0]) return m.reply(example('on/off'));
            if (/on/.test(args[0].toLowerCase())) {
                if (antilink.includes(m.chat)) return m.reply('Antilink sudah aktif di grup ini');
                if (antilink2.includes(m.chat)) {
                    const posi = antilink2.indexOf(m.chat);
                    antilink2.splice(posi, 1);
                    saveDB(global.dbantilink2, antilink2);
                }
                antilink.push(m.chat);
                saveDB(global.dbantilink, antilink);
                return m.reply('✅ Antilink berhasil diaktifkan');
            } else if (/off/.test(args[0].toLowerCase())) {
                if (!antilink.includes(m.chat)) return m.reply('Antilink belum aktif di grup ini');
                const posi = antilink.indexOf(m.chat);
                antilink.splice(posi, 1);
                saveDB(global.dbantilink, antilink);
                return m.reply('✅ Antilink berhasil dimatikan');
            } else {
                return m.reply(example('on/off'));
            }
        }

        case 'antilinkV2':
        case 'antilinkv2': {
            if (!isGroup) return m.reply(msg.group);
            if (!isAdmin && !isOwner) return m.reply(msg.admin);
            if (!isBotAdmin) return m.reply(msg.adminbot);
            if (!args[0]) return m.reply(example('on/off'));
            if (/on/.test(args[0].toLowerCase())) {
                if (antilink2.includes(m.chat)) return m.reply('Antilink-V2 sudah aktif di grup ini');
                if (antilink.includes(m.chat)) {
                    const posi = antilink.indexOf(m.chat);
                    antilink.splice(posi, 1);
                    saveDB(global.dbantilink, antilink);
                }
                antilink2.push(m.chat);
                saveDB(global.dbantilink2, antilink2);
                return m.reply('✅ Antilink-V2 berhasil diaktifkan');
            } else if (/off/.test(args[0].toLowerCase())) {
                if (!antilink2.includes(m.chat)) return m.reply('Antilink-V2 belum aktif di grup ini');
                const posi = antilink2.indexOf(m.chat);
                antilink2.splice(posi, 1);
                saveDB(global.dbantilink2, antilink2);
                return m.reply('✅ Antilink-V2 berhasil dimatikan');
            } else {
                return m.reply(example('on/off'));
            }
        }

        case 'statusgc': {
            if (!isGroup) return m.reply(msg.group);
            if (!isAdmin && !isOwner) return m.reply(msg.admin);
            const anti1 = antilink.includes(m.chat) ? '✅ ON' : '❌ OFF';
            const anti2 = antilink2.includes(m.chat) ? '✅ ON' : '❌ OFF';
            return m.reply(`𝐒𝐓𝐀𝐓𝐔𝐒 𝐆𝐑𝐔𝐏\n\nAntilink V1 : ${anti1}\nAntilink V2 : ${anti2}`);
        }

        case 'setppgc': {
            if (!isGroup) return m.reply(msg.group);
            if (!isBotAdmin) return m.reply(msg.adminbot);
            if (!isAdmin && !isOwner) return m.reply(msg.admin);
            if (!/image/g.test(ctx.mime)) return m.reply(example('dengan mengirim/reply foto'));
            try {
                const media = await Skyzo.downloadAndSaveMediaMessage(ctx.qmsg);
                await Skyzo.updateProfilePicture(m.chat, { url: media });
                fs.unlinkSync(media);
                return m.reply('✅ Foto profil grup berhasil diubah');
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
        }

        case 'setnamegc':
        case 'setnamagc': {
            if (!isGroup) return m.reply(msg.group);
            if (!isBotAdmin) return m.reply(msg.adminbot);
            if (!isAdmin && !isOwner) return m.reply(msg.admin);
            if (!text) return m.reply(example('teksnya'));
            try {
                await Skyzo.groupUpdateSubject(m.chat, text);
                return m.reply('✅ Nama grup berhasil diubah');
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
        }

        case 'setdesc':
        case 'setdesk': {
            if (!isGroup) return m.reply(msg.group);
            if (!isBotAdmin) return m.reply(msg.adminbot);
            if (!isAdmin && !isOwner) return m.reply(msg.admin);
            if (!text) return m.reply(example('teksnya'));
            try {
                await Skyzo.groupUpdateDescription(m.chat, text);
                return m.reply('✅ Deskripsi grup berhasil diubah');
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
        }

        case 'open':
        case 'buka':
        case 'ngoceh': {
            if (!isGroup) return m.reply(msg.group);
            if (!isBotAdmin) return m.reply(msg.adminbot);
            if (!isAdmin && !isOwner) return m.reply(msg.admin);
            try {
                await Skyzo.groupSettingUpdate(m.chat, 'not_announcement');
                return m.reply('✅ Grup dibuka, semua member bisa pesan');
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
        }

        case 'close':
        case 'tutup':
        case 'bisu': {
            if (!isGroup) return m.reply(msg.group);
            if (!isBotAdmin) return m.reply(msg.adminbot);
            if (!isAdmin && !isOwner) return m.reply(msg.admin);
            try {
                await Skyzo.groupSettingUpdate(m.chat, 'announcement');
                return m.reply('✅ Grup ditutup, hanya admin bisa pesan');
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
        }

        case 'd':
        case 'del':
        case 'delete': {
            if (isGroup) {
                if (!isAdmin && !isOwner) return m.reply(msg.admin);
                if (!m.quoted) return m.reply('Reply pesan yang ingin dihapus');
                try {
                    await Skyzo.sendMessage(m.chat, {
                        delete: {
                            remoteJid: m.chat,
                            fromMe: m.quoted.sender === ctx.botNumber,
                            id: m.quoted.id,
                            participant: m.quoted.sender,
                        },
                    });
                } catch (err) {
                    return m.reply('Error: ' + err.message);
                }
            } else {
                if (!isOwner) return m.reply(msg.owner);
                if (!m.quoted) return m.reply('Reply pesan yang ingin dihapus');
                try {
                    await Skyzo.sendMessage(m.chat, {
                        delete: {
                            remoteJid: m.chat,
                            fromMe: false,
                            id: m.quoted.id,
                            participant: m.quoted.sender,
                        },
                    });
                } catch (err) {
                    return m.reply('Error: ' + err.message);
                }
            }
            return;
        }

        case 'demote':
        case 'budak': {
            if (!isGroup) return m.reply(msg.group);
            if (!isAdmin && !isOwner) return m.reply(msg.admin);
            if (!isBotAdmin) return m.reply(msg.adminbot);
            if (!m.quoted && !text) return m.reply(example('62882xxxxxxxx'));
            let target;
            if (m.mentionedJid?.[0]) target = m.mentionedJid[0];
            else if (m.quoted) target = m.quoted.sender;
            else target = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            try {
                await Skyzo.groupParticipantsUpdate(m.chat, [target], 'demote');
                return m.reply(`✅ ${target.split('@')[0]} sekarang jadi member biasa`);
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
        }

        case 'promote':
        case 'bos': {
            if (!isGroup) return m.reply(msg.group);
            if (!isAdmin && !isOwner) return m.reply(msg.admin);
            if (!isBotAdmin) return m.reply(msg.adminbot);
            if (!m.quoted && !text) return m.reply(example('62882xxxxxxxx'));
            let target;
            if (m.mentionedJid?.[0]) target = m.mentionedJid[0];
            else if (m.quoted) target = m.quoted.sender;
            else target = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            try {
                await Skyzo.groupParticipantsUpdate(m.chat, [target], 'promote');
                return m.reply(`✅ ${target.split('@')[0]} sekarang jadi admin`);
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
        }

        case 'add':
        case 'addmember':
        case 'culik': {
            if (!isGroup) return m.reply(msg.group);
            if (!isAdmin && !isOwner) return m.reply(msg.admin);
            if (!isBotAdmin) return m.reply(msg.adminbot);
            if (!args[0]) return m.reply(example('62882xxxxxxxx'));
            const numStr = text.replace(/[^0-9]/g, '');
            const target = numStr + '@s.whatsapp.net';
            try {
                const cek = await Skyzo.onWhatsApp(numStr);
                if (cek.length < 1) return m.reply('Nomor tidak terdaftar di WhatsApp');
                const result = await Skyzo.groupParticipantsUpdate(m.chat, [target], 'add');
                if (result[0].status === 200) return m.reply('✅ Berhasil ditambahkan');
                if (result[0].status === 408) return m.reply('❌ Gagal menambahkan, user keluar baru-baru ini');
                if (result[0].status === 409) return m.reply('❌ User sudah bergabung');
                if (result[0].status === 403) return m.reply('❌ Gagal menambahkan, user membatasi invite');
                return m.reply('❌ Gagal menambahkan, status: ' + result[0].status);
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
        }

        case 'k':
        case 'kik':
        case 'kick':
        case 'babi': {
            if (!isGroup) return m.reply(msg.group);
            if (!isAdmin && !isOwner) return m.reply(msg.admin);
            if (!isBotAdmin) return m.reply(msg.adminbot);
            if (!m.quoted && !text && !m.mentionedJid?.length) {
                return m.reply(example('nomor/@tag'));
            }
            let target;
            if (m.mentionedJid?.[0]) target = m.mentionedJid[0];
            else if (m.quoted) target = m.quoted.sender;
            else target = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            try {
                await Skyzo.groupParticipantsUpdate(m.chat, [target], 'remove');
                return Skyzo.sendMessage(m.chat, {
                    text: `Beban ilang 1`,
                    mentions: [target],
                }, { quoted: m });
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
        }

        case 'hidetag':
        case 'h': {
            if (!isGroup) return m.reply(msg.group);
            if (!isAdmin && !isOwner) return m.reply(msg.admin);
            if (!m.quoted && !text) return m.reply(example('teksnya / reply teks'));
            const teks = m.quoted ? m.quoted.text : text;
            const member = groupMetadata.participants.map(e => e.id);
            return Skyzo.sendMessage(m.chat, { text: teks, mentions: [...member] });
        }

        case 'tagall':
        case 'tag': {
            if (!isGroup) return m.reply(msg.group);
            if (!isAdmin && !isOwner) return m.reply(msg.admin);
            if (!text) return m.reply(example('pesan/tagall-nya'));
            const member = groupMetadata.participants.map(e => e.id);
            let teks = `${text}\n\n`;
            member.forEach(e => {
                if (e !== m.sender) teks += `@${e.split('@')[0]}\n`;
            });
            return Skyzo.sendMessage(m.chat, { text: teks, mentions: [...member] });
        }

        case 'leave':
        case 'leavegc':
        case 'keluar':
        case 'nolep':
        case 'out': {
            if (!isOwner) return m.reply(msg.owner);
            if (!isGroup) return m.reply(msg.group);
            await m.reply('✅ Bot meninggalkan grup. Adios!');
            await new Promise(r => setTimeout(r, 1500));
            try {
                await Skyzo.groupLeave(m.chat);
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
            return;
        }

        case 'leavegc2':
        case 'leave2': {
            if (!isOwner) return m.reply(msg.owner);
            let gcall = [];
            try {
                gcall = Object.values(await Skyzo.groupFetchAllParticipating().catch(() => ({})));
            } catch (e) {
                gcall = [];
            }
            if (!args[0]) {
                let listgc = `*List Semua Grup Chat Bot:*\n\n`;
                gcall.forEach((u, i) => {
                    listgc += `*Nomor Grup => ${i + 1}*\n*• Nama :* ${u.subject}\n*• ID :* ${u.id}\n*• Member :* ${u.participants.length}\n*• Status :* ${u.announce ? 'Tertutup' : 'Terbuka'}\n*• Owner :* ${u.owner ? u.owner.split('@')[0] : 'Sudah keluar'}\n\n`;
                });
                return m.reply(listgc);
            }
            const idx = Number(args[0]) - 1;
            if (isNaN(idx) || idx < 0 || idx >= gcall.length) return m.reply('Grup tidak ditemukan');
            try {
                await m.reply(`✅ Bot meninggalkan grup: ${gcall[idx].subject}`);
                await Skyzo.groupLeave(gcall[idx].id);
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
            return;
        }

        case 'idgc': {
            if (!isGroup) return m.reply(msg.group);
            return m.reply(`ID Grup: ${m.chat}`);
        }

        case 'listgc':
        case 'listgrup':
        case 'cekid': {
            if (!isOwner) return m.reply(msg.owner);
            let gcall = [];
            try {
                gcall = Object.values(await Skyzo.groupFetchAllParticipating().catch(() => ({})));
            } catch (e) {
                gcall = [];
            }
            if (gcall.length === 0) return m.reply('Bot belum join grup apapun');
            let listgc = `*LIST ALL CHAT GROUP*\n\n`;
            gcall.forEach((u, i) => {
                listgc += `${i + 1}. ${u.subject}\n  • ID: ${u.id}\n  • Member: ${u.participants.length}\n  • Status: ${u.announce ? 'Tertutup' : 'Terbuka'}\n  • Owner: ${u.owner ? u.owner.split('@')[0] : 'Sudah keluar'}\n\n`;
            });
            return m.reply(listgc);
        }

        case 'join':
        case 'joingc': {
            if (!isOwner) return m.reply(msg.owner);
            let teks = m.quoted ? m.quoted.text : text;
            if (!teks) return m.reply(example('link grup WhatsApp'));
            if (!teks.includes('whatsapp.com')) return m.reply('Invalid link');
            const result = teks.split('https://chat.whatsapp.com/')[1]?.split(' ')[0]?.trim();
            if (!result) return m.reply('Invalid link');
            try {
                await Skyzo.groupAcceptInvite(result);
                return m.reply('✅ Berhasil join grup');
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
        }

        default:
            return false;
    }
};
