/**
 * commands/payment.js - Payment info commands
 * payment, danapay, ovopay, gopaypay, shopeepay, qrispay, bripay
 * By Angga Official
 */

const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');
const fs = require('fs');

module.exports = async (ctx) => {
    const { Skyzo, m, command, isOwner, qdoc, qkontak } = ctx;

    if (command !== 'payment' && !isOwner) {
        // Public bisa lihat payment info
    }

    switch (command) {
        case 'p':
        case 'pay':
        case 'payment':
        case 'sendpayment':
        case 'listpayment': {
            if (!isOwner) return m.reply(ctx.msg.owner);
            const teksnya = `Pilih metode payment yang tersedia 👇`;
            try {
                const buttons = [];
                if (global.dana) buttons.push({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Dana', title: 'Dana', id: '.danapay' }) });
                if (global.ovo) buttons.push({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Ovo', title: 'Ovo', id: '.ovopay' }) });
                if (global.gopay) buttons.push({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Gopay', title: 'Gopay', id: '.gopaypay' }) });
                if (global.shopeepay) buttons.push({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'ShopeePay', title: 'ShopeePay', id: '.shopeepay' }) });
                buttons.push({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'QRIS All Pay', title: 'QRIS', id: '.qrispay' }) });
                if (global.bri) buttons.push({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'BRI', title: 'BRI', id: '.bripay' }) });

                if (buttons.length === 0) {
                    return m.reply('Belum ada metode payment yang diset. Owner belum konfigurasi payment.');
                }

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
                }, { userJid: m.sender, quoted: qdoc });
                await Skyzo.relayMessage(msgii.key.remoteJid, msgii.message, { messageId: msgii.key.id });
            } catch (e) {
                // Fallback ke teks biasa
                let text = 'Metode Payment:\n';
                if (global.dana) text += '• Dana (ketik .danapay)\n';
                if (global.ovo) text += '• Ovo (ketik .ovopay)\n';
                if (global.gopay) text += '• Gopay (ketik .gopaypay)\n';
                if (global.shopeepay) text += '• ShopeePay (ketik .shopeepay)\n';
                text += '• QRIS All Pay (ketik .qrispay)\n';
                if (global.bri) text += '• BRI (ketik .bripay)\n';
                return m.reply(text);
            }
            return;
        }

        case 'danapay': {
            if (!global.dana) return m.reply('Dana tidak tersedia. Hubungi owner.');
            return Skyzo.sendText(m.chat, `*DANA*\nNomor : ${global.dana}\nA/N   : ${global.ownerName}\n\n${global.syarat1}\n${global.syarat2}`, { quoted: qkontak });
        }

        case 'ovopay': {
            if (!global.ovo) return m.reply('Ovo tidak tersedia. Hubungi owner.');
            return Skyzo.sendText(m.chat, `*OVO*\nNomor : ${global.ovo}\nA/N   : ${global.ownerName}\n\n${global.syarat1}\n${global.syarat2}`, { quoted: qkontak });
        }

        case 'gopaypay': {
            if (!global.gopay) return m.reply('Gopay tidak tersedia. Hubungi owner.');
            return Skyzo.sendText(m.chat, `*GOPAY*\nNomor : ${global.gopay}\nA/N   : ${global.ownerName}\n\n${global.syarat1}\n${global.syarat2}`, { quoted: qkontak });
        }

        case 'shopeepay': {
            if (!global.shopeepay) return m.reply('ShopeePay tidak tersedia. Hubungi owner.');
            return Skyzo.sendText(m.chat, `*SHOPEEPAY*\nNomor : ${global.shopeepay}\nA/N   : ${global.ownerName}\n\n${global.syarat1}\n${global.syarat2}`, { quoted: qkontak });
        }

        case 'qrispay': {
            if (!global.qris) return m.reply('QRIS tidak tersedia. Hubungi owner.');
            try {
                const teks = `*QRIS ALL PAYMENT*\nKode : ${global.qris}\nA/N : ${global.ownerName}\n\n${global.syarat1}\n${global.syarat2}`;
                await Skyzo.sendMessage(m.chat, {
                    image: { url: global.qris },
                    caption: teks,
                }, { quoted: qkontak });
            } catch (e) {
                return Skyzo.sendText(m.chat, `*QRIS ALL PAYMENT*\nKode : ${global.qris}\nA/N : ${global.ownerName}\n\n${global.syarat1}\n${global.syarat2}`, { quoted: qkontak });
            }
            return;
        }

        case 'bripay': {
            if (!global.bri) return m.reply('BRI tidak tersedia. Hubungi owner.');
            return Skyzo.sendText(m.chat, `*BRI*\nNo. Rek : ${global.bri}\nA/N    : ${global.ownerName}\n\n${global.syarat1}\n${global.syarat2}`, { quoted: qkontak });
        }

        default:
            return false;
    }
};
