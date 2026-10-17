/**
 * commands/panel.js - Pterodactyl Panel management
 * addadmin, adduser, addpanel (cp1gb-cp10gb, cpunli), listserver, listadmin, listmember, deladmin, deluser, delpanel
 * By Angga Official
 *
 * NOTE: Set global.domain, global.apikey, global.capikey di config.js
 */

const fs = require('fs');
const fetch = require('node-fetch');
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = require('@whiskeysockets/baileys');

module.exports = async (ctx) => {
    const { Skyzo, m, command, args, text, isOwner, isPremium, isGroup, msg, example, qchanel } = ctx;

    // Helper: post/put/get to Pterodactyl API
    async function panelApi(endpoint, method, body) {
        const url = `${global.domain}/api/application/${endpoint}`;
        const opts = {
            method: method || 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + global.apikey,
            },
        };
        if (body) opts.body = JSON.stringify(body);
        const res = await fetch(url, opts);
        const text = await res.text();
        let json;
        try { json = JSON.parse(text); } catch { json = { raw: text }; }
        if (!res.ok) return { errors: json.errors || [{ detail: text }] };
        return json;
    }

    async function panelApi2(endpoint, method, body) {
        const url = `${global.domain}/api/${endpoint}`;
        const opts = {
            method: method || 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + global.apikey,
            },
        };
        if (body) opts.body = JSON.stringify(body);
        const res = await fetch(url, opts);
        const text = await res.text();
        let json;
        try { json = JSON.parse(text); } catch { json = { raw: text }; }
        if (!res.ok) return { errors: json.errors || [{ detail: text }] };
        return json;
    }

    // Helper: send panel detail via interactive message
    async function sendPanelDetail(jid, teks) {
        try {
            const msgii = generateWAMessageFromContent(jid, {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2,
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.create({
                            contextInfo: { mentionedJid: [m.sender] },
                            body: proto.Message.InteractiveMessage.Body.create({ text: teks }),
                            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                buttons: [{
                                    name: 'cta_url',
                                    buttonParamsJson: JSON.stringify({
                                        display_text: 'Link Login',
                                        url: global.domain,
                                        merchant_url: 'https://www.google.com',
                                    }),
                                }],
                            }),
                        }),
                    },
                },
            }, { userJid: m.sender, quoted: qchanel });
            await Skyzo.relayMessage(jid, msgii.message, { messageId: msgii.key.id });
        } catch (e) {
            // fallback to plain text
            await Skyzo.sendMessage(jid, { text: teks }, { quoted: m });
        }
    }

    switch (command) {
        case 'cadmin':
        case 'addadmin':
        case 'adp':
        case 'toadmin': {
            if (!text) return m.reply(example('username'));
            if (!isOwner) return m.reply(msg.owner);
            const username = text.toLowerCase();
            const email = username + '@' + (global.domain2 || 'panel.com');
            const name = username + 'admin';
            const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let password = 'ADMIN-';
            for (let i = 0; i < 5; i++) password += randomChars.charAt(Math.floor(Math.random() * randomChars.length));

            const body = {
                email,
                username,
                first_name: 'admin',
                last_name: global.branding,
                root_admin: true,
                language: 'en',
                password,
            };
            const data = await panelApi('users', 'POST', body);
            if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2));
            const user = data.attributes;
            const orang = isGroup ? m.sender : m.chat;
            if (isGroup) await m.reply('✅ Admin panel berhasil dibuat');
            const teks = `
𝐃𝐄𝐓𝐀𝐈𝐋 𝐀𝐃𝐌𝐈𝐍 𝐏𝐀𝐍𝐄𝐋

👤 Username : ${user.username}
🔐 Password : ${password}
🌐 Domain   : ${global.domain2}

© ${global.branding}
`;
            await sendPanelDetail(orang, teks);
            return;
        }

        case 'cusr':
        case 'adduser':
        case 'cuser':
        case 'touser':
        case 'addusr': {
            if (!text) return m.reply(example('username'));
            if (!isOwner) return m.reply(msg.owner);
            const username = text.toLowerCase();
            const email = username + '@' + (global.domain2 || 'panel.com');
            const name = username + 'member';
            const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let password = 'USER-';
            for (let i = 0; i < 5; i++) password += randomChars.charAt(Math.floor(Math.random() * randomChars.length));

            const body = {
                email,
                username,
                first_name: 'member',
                last_name: global.branding,
                root_admin: false,
                language: 'en',
                password,
            };
            const data = await panelApi('users', 'POST', body);
            if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2));
            const user = data.attributes;
            const orang = isGroup ? m.sender : m.chat;
            if (isGroup) await m.reply('✅ User panel berhasil dibuat');
            const teks = `
𝐃𝐄𝐓𝐀𝐈𝐋 𝐀𝐊𝐔𝐍 𝐏𝐀𝐍𝐄𝐋

👤 Username : ${user.username}
🔐 Password : ${password}
🌐 Domain   : ${global.domain2}

© ${global.branding}
`;
            await sendPanelDetail(orang, teks);
            return;
        }

        case 'cpanel':
        case 'addpanel':
        case 'resellervcloudx': {
            if (!isPremium) return m.reply('Premium only!');
            if (!global.apikey || global.apikey === 'ptla_xxxxxxxx') return m.reply('Apikey panel belum diset di config.js');
            if (!args[0]) return m.reply(example('nama server'));
            global.panel = [text.toLowerCase()];
            const teksnya = `Sedang membuat akun panel, silakan pilih RAM yang diinginkan:`;
            try {
                const rams = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                const buttons = rams.map(r => ({
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: `Ram ${r}GB`,
                        title: `Ram ${r}GB`,
                        id: `.cp${r}gb`,
                    }),
                }));
                buttons.push({
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: 'Ram Unlimited',
                        title: 'Ram Unlimited',
                        id: '.cpunli',
                    }),
                });
                const msgii = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                contextInfo: { mentionedJid: [m.sender] },
                                body: proto.Message.InteractiveMessage.Body.create({ text: teksnya }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons }),
                            }),
                        },
                    },
                }, { userJid: m.sender, quoted: qchanel });
                await Skyzo.relayMessage(msgii.key.remoteJid, msgii.message, { messageId: msgii.key.id });
            } catch (e) {
                return m.reply('Failed: ' + e.message + '\n\nKetik manual: .cp1gb / .cp2gb / ... / .cp10gb / .cpunli');
            }
            return;
        }

        case 'cp1gb':
        case 'cp2gb':
        case 'cp3gb':
        case 'cp4gb':
        case 'cp5gb':
        case 'cp6gb':
        case 'cp7gb':
        case 'cp8gb':
        case 'cp9gb':
        case 'cp10gb':
        case 'cpunli': {
            if (!isPremium) return m.reply('Premium only!');
            if (!global.panel || global.panel == null) return m.reply('Username tidak ditemukan. Ketik .addpanel <nama> dulu');
            if (!global.apikey || global.apikey === 'ptla_xxxxxxxx') return m.reply('Apikey panel belum diset');

            let ram, disknya, cpu;
            const gb = parseInt(command.replace('cp', '').replace('gb', ''));
            if (command === 'cpunli') {
                ram = 0; disknya = 0; cpu = 0;
            } else if (gb >= 1 && gb <= 10) {
                ram = String(gb * 1024);
                disknya = String(gb * 1024);
                cpu = String(gb * 50);
            } else {
                return m.reply('Invalid RAM size');
            }

            const username = global.panel[0].toLowerCase();
            const email = username + '@' + (global.domain2 || 'panel.com');
            const name = username + 'vcloudx';
            const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let password = 'USR-';
            for (let i = 0; i < 5; i++) password += randomChars.charAt(Math.floor(Math.random() * randomChars.length));

            // Create user
            const userBody = {
                email, username,
                first_name: 'member',
                last_name: global.branding,
                language: 'en',
                password,
            };
            const userData = await panelApi('users', 'POST', userBody);
            if (userData.errors) return m.reply(JSON.stringify(userData.errors[0], null, 2));
            const user = userData.attributes;
            const usr_id = user.id;

            // Get egg startup
            const eggData = await panelApi(`nests/5/eggs/${global.egg}`, 'GET');
            if (eggData.errors) return m.reply(JSON.stringify(eggData.errors[0], null, 2));
            const startup_cmd = eggData.attributes?.startup || 'npm start';

            // Create server
            const serverBody = {
                name,
                description: `Server by ${global.branding}`,
                user: usr_id,
                egg: parseInt(global.egg),
                docker_image: 'ghcr.io/parkervcp/yolks:nodejs_18',
                startup: startup_cmd,
                environment: {
                    INST: 'npm',
                    USER_UPLOAD: '0',
                    AUTO_UPDATE: '0',
                    CMD_RUN: 'npm start',
                },
                limits: {
                    memory: parseInt(ram),
                    swap: 0,
                    disk: parseInt(disknya),
                    io: 500,
                    cpu: parseInt(cpu),
                },
                feature_limits: { databases: 2, backups: 3, allocations: 1 },
                deploy: { locations: [parseInt(global.loc)], dedicated_ip: false, port_range: [] },
            };
            const serverData = await panelApi2('application/servers', 'POST', serverBody);
            if (serverData.errors) return m.reply(JSON.stringify(serverData.errors[0], null, 2));
            const server = serverData.attributes;

            const orang = isGroup ? m.sender : m.chat;
            if (isGroup) await m.reply('✅ Panel berhasil dibuat');
            const teks = `
𝐃𝐄𝐓𝐀𝐈𝐋 𝐏𝐀𝐍𝐄𝐋 𝐀𝐍𝐃𝐀

👤 Username : ${user.username}
🔐 Password : ${password}
🌐 Domain   : ${global.domain2}
📝 Resource: ${ram === 0 ? '∞' : gb + 'GB'} / ${cpu === 0 ? '∞' : cpu + '%'}
🆔 Server ID: ${server.id}

© ${global.branding}
`;
            await sendPanelDetail(orang, teks);
            global.panel = null;
            return;
        }

        case 'listadmin': {
            if (!isOwner) return m.reply(msg.owner);
            const data = await panelApi('users?page=1', 'GET');
            if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2));
            const users = data.data;
            if (!users || users.length === 0) return m.reply('Belum ada user');
            let teks = '𝐋𝐈𝐒𝐓 𝐀𝐃𝐌𝐈𝐍\n\n';
            for (const i of users) {
                if (i.attributes.root_admin !== true) continue;
                teks += `• ${i.attributes.first_name}\n  ID: ${i.attributes.id}\n\n`;
            }
            return m.reply(teks);
        }

        case 'listmember':
        case 'listmemb':
        case 'listuser':
        case 'listusr': {
            if (!isOwner) return m.reply(msg.owner);
            const data = await panelApi('users?page=1', 'GET');
            if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2));
            const users = data.data;
            if (!users || users.length === 0) return m.reply('Belum ada user');
            let teks = '𝐋𝐈𝐒𝐓 𝐌𝐄𝐌𝐁𝐄𝐑\n\n';
            for (const i of users) {
                if (i.attributes.root_admin !== false) continue;
                teks += `• ${i.attributes.username}\n  ID: ${i.attributes.id}\n\n`;
            }
            return m.reply(teks);
        }

        case 'deladmin':
        case 'deladm': {
            if (!isOwner) return m.reply(msg.owner);
            if (!args[0]) return m.reply(example('id\n\nKetik .listadmin untuk lihat ID admin'));
            const data = await panelApi('users?page=1', 'GET');
            if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2));
            const users = data.data;
            let idadmin = null;
            for (const e of users) {
                if (String(e.attributes.id) === String(args[0]) && e.attributes.root_admin === true) {
                    idadmin = e.attributes.id;
                    break;
                }
            }
            if (idadmin == null) return m.reply('ID admin tidak ditemukan');
            const delData = await panelApi(`users/${idadmin}`, 'DELETE');
            if (delData.errors) return m.reply(JSON.stringify(delData.errors[0], null, 2));
            return m.reply('✅ Admin berhasil dihapus');
        }

        case 'deluser':
        case 'delusr':
        case 'dusr': {
            if (!isOwner) return m.reply(msg.owner);
            if (!args[0]) return m.reply(example('id\n\nKetik .listuser untuk lihat ID user'));
            const data = await panelApi('users?page=1', 'GET');
            if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2));
            const users = data.data;
            let idadmin = null;
            for (const e of users) {
                if (String(e.attributes.id) === String(args[0]) && e.attributes.root_admin === false) {
                    idadmin = e.attributes.id;
                    break;
                }
            }
            if (idadmin == null) return m.reply('ID user tidak ditemukan');
            const delData = await panelApi(`users/${idadmin}`, 'DELETE');
            if (delData.errors) return m.reply(JSON.stringify(delData.errors[0], null, 2));
            return m.reply('✅ User berhasil dihapus');
        }

        case 'listp':
        case 'listserver': {
            if (!isOwner) return m.reply(msg.owner);
            if (!global.apikey || global.apikey === 'ptla_xxxxxxxx') return m.reply('Apikey panel belum diset');
            const data = await panelApi('servers?page=1', 'GET');
            if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2));
            const servers = data.data;
            if (!servers || servers.length === 0) return m.reply('Belum ada server');
            let msgText = '𝐋𝐈𝐒𝐓 𝐏𝐀𝐍𝐄𝐋 & 𝐇𝐎𝐒𝐓\n\n';
            for (const server of servers) {
                const s = server.attributes;
                const memLimit = s.limits?.memory ?? 0;
                const cpuLimit = s.limits?.cpu ?? 0;
                const memStr = memLimit === 0 ? '∞' : (String(memLimit).length > 3 ? `${Math.floor(memLimit / 1024)}GB` : `${memLimit}MB`);
                const cpuStr = cpuLimit === 0 ? '∞' : `${cpuLimit}%`;
                msgText += `• ${s.name}\n  RAM: ${memStr} / ${cpuStr}\n  ID: ${s.id}\n\n`;
            }
            msgText += `Total servers: ${data.meta?.pagination?.count || servers.length}`;
            return Skyzo.sendMessage(m.chat, { text: msgText }, { quoted: m });
        }

        case 'delpanel':
        case 'delserver':
        case 'delsrvr': {
            if (!isOwner) return m.reply(msg.owner);
            if (!global.apikey || global.apikey === 'ptla_xxxxxxxx') return m.reply('Apikey panel belum diset');
            if (!args[0]) return m.reply(example('idserver\n\nKetik .listserver untuk lihat ID server'));

            // Get all servers
            const serverData = await panelApi('servers?page=1', 'GET');
            if (serverData.errors) return m.reply(JSON.stringify(serverData.errors[0], null, 2));
            const servers = serverData.data;
            const sections = [];
            for (const server of servers) {
                const s = server.attributes;
                if (String(args[0]) === String(s.id)) {
                    sections.push(s.name.toLowerCase());
                    await panelApi(`servers/${s.id}`, 'DELETE');
                }
            }
            // Delete associated users
            const userData = await panelApi('users?page=1', 'GET');
            if (!userData.errors && userData.data) {
                for (const user of userData.data) {
                    const u = user.attributes;
                    if (sections.includes(u.username.toLowerCase())) {
                        await panelApi(`users/${u.id}`, 'DELETE');
                    }
                }
            }
            if (sections.length === 0) return m.reply('Server tidak ditemukan');
            return m.reply('✅ Panel & user terkait berhasil dihapus');
        }

        default:
            return false;
    }
};
