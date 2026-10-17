/**
 * commands/pushkontak.js - Push Contact & JPM (broadcast to groups)
 * By Angga Official
 */

const fs = require('fs');
const path = require('path');

module.exports = async (ctx) => {
    const {
        Skyzo, m, command, args, text, isOwner, isGroup, msg, example,
        contacts, saveDB, qloc, qloc2, qchanel, createSerial, sleep, capital,
    } = ctx;

    switch (command) {
        case 'savekontak': {
            if (!isOwner) return m.reply(msg.owner);
            if (!isGroup) return m.reply(msg.group);
            try {
                const groupMetadata = ctx.groupMetadata;
                const halls = groupMetadata.participants
                    .filter(v => v.id.endsWith('.net'))
                    .map(v => v.id);
                for (const mem of halls) {
                    if (mem !== m.sender) {
                        if (!contacts.includes(mem)) contacts.push(mem);
                    }
                }
                saveDB(global.dbcontacts, contacts);
                const uniqueContacts = [...new Set(contacts)];
                const vcardContent = uniqueContacts.map(contact => {
                    return [
                        'BEGIN:VCARD',
                        'VERSION:3.0',
                        `FN:WA[${createSerial(2)}] ${contact.split('@')[0]}`,
                        `TEL;type=CELL;type=VOICE;waid=${contact.split('@')[0]}:+${contact.split('@')[0]}`,
                        'END:VCARD',
                        '',
                    ].join('\n');
                }).join('');
                fs.writeFileSync('./all/database/contacts.vcf', vcardContent, 'utf8');
                if (m.chat !== m.sender) {
                    await m.reply('✅ File kontak berhasil dikirim ke private chat');
                }
                await Skyzo.sendMessage(m.sender, {
                    document: fs.readFileSync('./all/database/contacts.vcf'),
                    fileName: 'contacts.vcf',
                    caption: `✅ Contact file created by ${global.branding}`,
                    mimetype: 'text/vcard',
                }, { quoted: m });
                contacts.splice(0, contacts.length);
                saveDB(global.dbcontacts, contacts);
                fs.writeFileSync('./all/database/contacts.vcf', '');
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
            return;
        }

        case 'savekontak2': {
            if (!isOwner) return m.reply(msg.owner);
            if (!text) return m.reply(example('idgrup\n\nKetik .listgc untuk lihat semua ID grup'));
            const idnya = text.includes('@g.us') ? text : text + '@g.us';
            let groupMetadataa;
            try {
                groupMetadataa = await Skyzo.groupMetadata(idnya);
            } catch (e) {
                return m.reply('Invalid ID Group');
            }
            try {
                const participants = groupMetadataa.participants;
                const halls = participants
                    .filter(v => v.id.endsWith('.net'))
                    .map(v => v.id);
                for (const mem of halls) {
                    if (mem !== m.sender && !contacts.includes(mem)) {
                        contacts.push(mem);
                    }
                }
                saveDB(global.dbcontacts, contacts);
                const uniqueContacts = [...new Set(contacts)];
                const vcardContent = uniqueContacts.map(contact => {
                    return [
                        'BEGIN:VCARD',
                        'VERSION:3.0',
                        `FN:WA[${createSerial(2)}] ${contact.split('@')[0]}`,
                        `TEL;type=CELL;type=VOICE;waid=${contact.split('@')[0]}:+${contact.split('@')[0]}`,
                        'END:VCARD',
                        '',
                    ].join('\n');
                }).join('');
                fs.writeFileSync('./all/database/contacts.vcf', vcardContent, 'utf8');
                if (m.chat !== m.sender) await m.reply('✅ File kontak dikirim ke private chat');
                await Skyzo.sendMessage(m.sender, {
                    document: fs.readFileSync('./all/database/contacts.vcf'),
                    fileName: 'contacts.vcf',
                    caption: `✅ Contact file created by ${global.branding}`,
                    mimetype: 'text/vcard',
                }, { quoted: m });
                contacts.splice(0, contacts.length);
                saveDB(global.dbcontacts, contacts);
                fs.writeFileSync('./all/database/contacts.vcf', '');
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
            return;
        }

        case 'pushkontak':
        case 'pushkon': {
            if (!isOwner) return m.reply(msg.owner);
            if (!isGroup) return m.reply(msg.group);
            if (!text) return m.reply(example('pesannya'));
            const teks = text;
            const groupMetadata = ctx.groupMetadata;
            const halls = groupMetadata.participants
                .filter(v => v.id.endsWith('.net'))
                .map(v => v.id);
            await m.reply(`Processing kirim ke ${halls.length} member...`);
            for (const mem of halls) {
                if (mem !== m.sender) {
                    try {
                        if (!contacts.includes(mem)) contacts.push(mem);
                        saveDB(global.dbcontacts, contacts);
                        await Skyzo.sendMessage(mem, { text: teks }, { quoted: qloc2 });
                        await sleep(global.delaypushkontak || 3000);
                    } catch (e) {
                        console.error('[pushkontak] failed to', mem, e.message);
                    }
                }
            }
            try {
                const uniqueContacts = [...new Set(contacts)];
                const vcardContent = uniqueContacts.map(contact => {
                    return [
                        'BEGIN:VCARD',
                        'VERSION:3.0',
                        `FN:WA[${createSerial(2)}] ${contact.split('@')[0]}`,
                        `TEL;type=CELL;type=VOICE;waid=${contact.split('@')[0]}:+${contact.split('@')[0]}`,
                        'END:VCARD',
                        '',
                    ].join('\n');
                }).join('');
                fs.writeFileSync('./all/database/contacts.vcf', vcardContent, 'utf8');
                if (m.chat !== m.sender) await m.reply(`✅ Berhasil kirim ke ${halls.length} member, kontak dikirim ke private chat`);
                await Skyzo.sendMessage(m.sender, {
                    document: fs.readFileSync('./all/database/contacts.vcf'),
                    fileName: 'contacts.vcf',
                    caption: `✅ Contact file by ${global.branding}`,
                    mimetype: 'text/vcard',
                }, { quoted: m });
                contacts.splice(0, contacts.length);
                saveDB(global.dbcontacts, contacts);
                fs.writeFileSync('./all/database/contacts.vcf', '');
            } catch (err) {
                return m.reply('Error saving contacts: ' + err.message);
            }
            return;
        }

        case 'pushkontak1': {
            if (!isOwner) return m.reply(msg.owner);
            if (!text || !text.includes('|')) {
                return m.reply(example('idgrup|pesan\n\nKetik .listgc untuk lihat semua ID grup'));
            }
            const [idnya, teks] = text.split('|');
            if (!idnya || !teks) return m.reply('Format salah! idgrup|pesan');
            const fullId = idnya.endsWith('@g.us') ? idnya : idnya + '@g.us';
            let groupMetadataa;
            try {
                groupMetadataa = await Skyzo.groupMetadata(fullId);
            } catch (e) {
                return m.reply('Invalid ID Group');
            }
            const participants = groupMetadataa.participants;
            const halls = participants
                .filter(v => v.id.endsWith('.net'))
                .map(v => v.id);
            await m.reply(`Processing kirim ke ${halls.length} member...`);
            for (const mem of halls) {
                if (mem !== m.sender) {
                    try {
                        if (!contacts.includes(mem)) contacts.push(mem);
                        saveDB(global.dbcontacts, contacts);
                        await Skyzo.sendMessage(mem, { text: teks.trim() }, { quoted: qloc2 });
                        await sleep(global.delaypushkontak || 3000);
                    } catch (e) {
                        console.error('[pushkontak1] failed to', mem, e.message);
                    }
                }
            }
            try {
                const uniqueContacts = [...new Set(contacts)];
                const vcardContent = uniqueContacts.map(contact => {
                    return [
                        'BEGIN:VCARD',
                        'VERSION:3.0',
                        `FN:WA[${createSerial(2)}] ${contact.split('@')[0]}`,
                        `TEL;type=CELL;type=VOICE;waid=${contact.split('@')[0]}:+${contact.split('@')[0]}`,
                        'END:VCARD',
                        '',
                    ].join('\n');
                }).join('');
                fs.writeFileSync('./all/database/contacts.vcf', vcardContent, 'utf8');
                if (m.chat !== m.sender) await m.reply(`✅ Berhasil kirim ke ${halls.length} member, kontak dikirim ke private chat`);
                await Skyzo.sendMessage(m.sender, {
                    document: fs.readFileSync('./all/database/contacts.vcf'),
                    fileName: 'contacts.vcf',
                    caption: `✅ Contact file by ${global.branding}`,
                    mimetype: 'text/vcard',
                }, { quoted: m });
                contacts.splice(0, contacts.length);
                saveDB(global.dbcontacts, contacts);
                fs.writeFileSync('./all/database/contacts.vcf', '');
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
            return;
        }

        case 'pushkontak2': {
            if (!isOwner) return m.reply(msg.owner);
            if (!text || !text.includes('|')) {
                return m.reply(example('idgrup|jeda|pesan\n\nJeda 1 detik = 1000\nKetik .listgc untuk lihat semua ID grup'));
            }
            const parts = text.split('|');
            if (parts.length < 3) {
                return m.reply('Format salah! idgrup|jeda|pesan');
            }
            const idnya = parts[0];
            const delay = Number(parts[1]);
            const teks = parts.slice(2).join('|');
            if (!idnya.endsWith('@g.us') && !idnya.endsWith('@s.whatsapp.net')) {
                return m.reply('Invalid group ID format');
            }
            const fullId = idnya.endsWith('@g.us') ? idnya : idnya + '@g.us';
            if (isNaN(delay)) return m.reply('Invalid delay format');
            if (!teks) return m.reply('Pesan tidak boleh kosong');
            let groupMetadataa;
            try {
                groupMetadataa = await Skyzo.groupMetadata(fullId);
            } catch (e) {
                return m.reply('Invalid group ID');
            }
            const participants = groupMetadataa.participants;
            const halls = participants
                .filter(v => v.id.endsWith('.net'))
                .map(v => v.id);
            await m.reply(`Processing kirim ke ${halls.length} member...`);
            for (const mem of halls) {
                if (mem !== m.sender) {
                    try {
                        if (!contacts.includes(mem)) contacts.push(mem);
                        saveDB(global.dbcontacts, contacts);
                        await Skyzo.sendMessage(mem, { text: teks.trim() }, { quoted: qloc2 });
                        await sleep(delay);
                    } catch (e) {
                        console.error('[pushkontak2] failed to', mem, e.message);
                    }
                }
            }
            try {
                const uniqueContacts = [...new Set(contacts)];
                const vcardContent = uniqueContacts.map(contact => {
                    return [
                        'BEGIN:VCARD',
                        'VERSION:3.0',
                        `FN:WA[${createSerial(2)}] ${contact.split('@')[0]}`,
                        `TEL;type=CELL;type=VOICE;waid=${contact.split('@')[0]}:+${contact.split('@')[0]}`,
                        'END:VCARD',
                        '',
                    ].join('\n');
                }).join('');
                fs.writeFileSync('./all/database/contacts.vcf', vcardContent, 'utf8');
                if (m.chat !== m.sender) await m.reply(`✅ Berhasil kirim ke ${halls.length} member`);
                await Skyzo.sendMessage(m.sender, {
                    document: fs.readFileSync('./all/database/contacts.vcf'),
                    fileName: 'contacts.vcf',
                    caption: `✅ Contact file by ${global.branding}`,
                    mimetype: 'text/vcard',
                }, { quoted: m });
                contacts.splice(0, contacts.length);
                saveDB(global.dbcontacts, contacts);
                fs.writeFileSync('./all/database/contacts.vcf', '');
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
            return;
        }

        case 'setteksjpm': {
            if (!isOwner) return m.reply(msg.owner);
            if (text || m.quoted) {
                const newteks = m.quoted ? m.quoted.text : text;
                fs.writeFileSync(global.dbteksjpm, newteks.toString());
                return m.reply('✅ Text JPM berhasil diubah');
            } else {
                return m.reply(example('dengan reply/kirim teks\n\nUntuk lihat teks jpm: .teksjpm'));
            }
        }

        case 'teksjpm': {
            if (!isOwner) return m.reply(msg.owner);
            const teksnya = fs.readFileSync(global.dbteksjpm).toString();
            return m.reply(teksnya);
        }

        case 'startjpm': {
            if (!isOwner) return m.reply(msg.owner);
            const teksnya = fs.readFileSync(global.dbteksjpm).toString();
            if (teksnya.length < 1) return m.reply('Text JPM belum diset. Ketik .setteksjpm <teks>');
            let total = 0;
            const getGroups = await Skyzo.groupFetchAllParticipating().catch(() => ({}));
            const usergc = Object.keys(getGroups);
            await m.reply(`Processing kirim ke ${usergc.length} grup...`);
            for (const jid of usergc) {
                try {
                    await Skyzo.sendMessage(jid, { text: teksnya }, { quoted: qloc });
                    total += 1;
                } catch (e) {
                    console.error('[startjpm] failed', jid, e.message);
                }
                await sleep(4000);
            }
            return m.reply(`✅ Berhasil kirim ke ${total} grup`);
        }

        case 'jpm': {
            if (!isOwner) return m.reply(msg.owner);
            if (!text && !m.quoted) return m.reply(example('teksnya atau reply teks'));
            const teks = m.quoted ? m.quoted.text : text;
            let total = 0;
            const getGroups = await Skyzo.groupFetchAllParticipating().catch(() => ({}));
            const usergc = Object.values(getGroups).map(g => g.id);
            await m.reply(`Processing kirim teks ke ${usergc.length} grup...`);
            for (const jid of usergc) {
                try {
                    await Skyzo.sendMessage(jid, { text: teks }, { quoted: qchanel });
                    total += 1;
                } catch (e) {
                    console.error('[jpm] failed', jid, e.message);
                }
                await sleep(global.delayjpm || 4000);
            }
            return m.reply(`✅ Berhasil kirim ke ${total} grup`);
        }

        case 'jpm2': {
            if (!isOwner) return m.reply(msg.owner);
            if (!text) return m.reply(example('teksnya dengan balas/kirim foto'));
            if (!/image/.test(ctx.mime)) return m.reply(example('teksnya dengan balas/kirim foto'));
            const image = await Skyzo.downloadAndSaveMediaMessage(ctx.qmsg);
            let total = 0;
            const getGroups = await Skyzo.groupFetchAllParticipating().catch(() => ({}));
            const usergc = Object.values(getGroups).map(g => g.id);
            await m.reply(`Processing kirim foto+teks ke ${usergc.length} grup...`);
            for (const jid of usergc) {
                try {
                    await Skyzo.sendMessage(jid, {
                        image: fs.readFileSync(image),
                        caption: text,
                        contextInfo: { forwardingScore: 1, isForwarded: true },
                    }, { quoted: qchanel });
                    total += 1;
                } catch (e) {
                    console.error('[jpm2] failed', jid, e.message);
                }
                await sleep(global.delayjpm || 4000);
            }
            if (fs.existsSync(image)) fs.unlinkSync(image);
            return m.reply(`✅ Berhasil kirim ke ${total} grup`);
        }

        case 'jpmhidetag': {
            if (!isOwner) return m.reply(msg.owner);
            if (!text && !m.quoted) return m.reply(example('teksnya atau reply teks'));
            const teks = m.quoted ? m.quoted.text : text;
            let total = 0;
            const getGroups = await Skyzo.groupFetchAllParticipating().catch(() => ({}));
            const usergc = Object.values(getGroups).map(g => g.id);
            await m.reply(`Processing kirim hidetag ke ${usergc.length} grup...`);
            for (const jid of usergc) {
                try {
                    const groupInfo = getGroups[jid];
                    const mentions = groupInfo?.participants?.map(e => e.id) || [];
                    await Skyzo.sendMessage(jid, { text: teks, mentions }, { quoted: qchanel });
                    total += 1;
                } catch (e) {
                    console.error('[jpmhidetag] failed', jid, e.message);
                }
                await sleep(global.delayjpm || 4000);
            }
            return m.reply(`✅ Berhasil kirim ke ${total} grup`);
        }

        case 'jpmpol':
        case 'jpmpoll':
        case 'jpmpolling': {
            if (!isOwner) return m.reply(msg.owner);
            if (!text || !text.includes('|')) return m.reply(example('teks1|teks2|teks3'));
            const anu = text.split('|');
            if (anu.length < 3) return m.reply(example('teks1|teks2|teks3'));
            let total = 0;
            const getGroups = await Skyzo.groupFetchAllParticipating().catch(() => ({}));
            const usergc = Object.values(getGroups).map(g => g.id);
            await m.reply(`Processing kirim poll ke ${usergc.length} grup...`);
            for (const jid of usergc) {
                try {
                    await Skyzo.sendPoll?.(jid, anu[0], anu.filter(e => e !== anu[0]));
                    total += 1;
                } catch (e) {
                    console.error('[jpmpoll] failed', jid, e.message);
                }
                await sleep(4000);
            }
            return m.reply(`✅ Berhasil kirim ke ${total} grup`);
        }

        case 'jpmtesti': {
            if (!isOwner) return m.reply(msg.owner);
            if (!text) return m.reply(example('teks dengan balas/kirim foto'));
            if (!/image/.test(ctx.mime)) return m.reply(example('teks dengan balas/kirim foto'));
            if (global.idsaluran === '-' || !global.idsaluran) {
                return m.reply('Mohon isi ID Saluran di config.js');
            }
            const image = await Skyzo.downloadAndSaveMediaMessage(ctx.qmsg);
            let total = 0;
            const getGroups = await Skyzo.groupFetchAllParticipating().catch(() => ({}));
            const usergc = Object.values(getGroups).map(g => g.id);
            await m.reply(`Processing kirim testimoni ke ${usergc.length} grup...`);
            for (const jid of usergc) {
                try {
                    await Skyzo.sendMessage(jid, {
                        image: fs.readFileSync(image),
                        caption: text,
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: global.idsaluran,
                                serverMessageId: 100,
                                newsletterName: `Testimoni by ${global.branding}`,
                            },
                        },
                    }, { quoted: qchanel });
                    total += 1;
                } catch (e) {
                    console.error('[jpmtesti] failed', jid, e.message);
                }
                await sleep(global.delayjpm || 4000);
            }
            if (fs.existsSync(image)) fs.unlinkSync(image);
            return m.reply(`✅ Berhasil kirim ke ${total} grup`);
        }

        case 'tespol': {
            if (!isOwner) return m.reply(msg.owner);
            if (!isGroup) return m.reply(msg.group);
            if (!text || !text.includes('|')) return m.reply(example('teks1|teks2|teks3'));
            const anu = text.split('|');
            if (anu.length < 3) return m.reply(example('teks1|teks2|teks3'));
            try {
                await Skyzo.sendPoll?.(m.chat, anu[0], anu.filter(e => e !== anu[0]));
            } catch (e) {
                return m.reply('Poll tidak didukung: ' + e.message);
            }
            return;
        }

        default:
            return false;
    }
};
