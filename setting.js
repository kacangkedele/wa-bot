/**
 * commands/setting.js - Bot settings (welcome, autoread, anticall, statusbot)
 * By Angga Official
 */

module.exports = async (ctx) => {
    const { Skyzo, m, command, text, isOwner, msg, example } = ctx;

    switch (command) {
        case 'welcome': {
            if (!isOwner) return m.reply(msg.owner);
            if (!text) return m.reply(example('on/off\n\nKetik .statusbot untuk lihat status setting'));
            if (text.toLowerCase() === 'on') {
                global.welcomeEnabled = true;
                global.welcome = true;
                return m.reply('✅ Welcome berhasil diaktifkan');
            } else if (text.toLowerCase() === 'off') {
                global.welcomeEnabled = false;
                global.welcome = false;
                return m.reply('✅ Welcome berhasil dimatikan');
            } else {
                return m.reply(example('on/off'));
            }
        }

        case 'autoread': {
            if (!isOwner) return m.reply(msg.owner);
            if (!text) return m.reply(example('on/off\n\nKetik .statusbot untuk lihat status'));
            if (text.toLowerCase() === 'on') {
                global.autoreadEnabled = true;
                global.autoread = true;
                return m.reply('✅ Autoread berhasil diaktifkan');
            } else if (text.toLowerCase() === 'off') {
                global.autoreadEnabled = false;
                global.autoread = false;
                return m.reply('✅ Autoread berhasil dimatikan');
            } else {
                return m.reply(example('on/off'));
            }
        }

        case 'anticall':
        case 'seleb': {
            if (!isOwner) return m.reply(msg.owner);
            if (!text) return m.reply(example('on/off\n\nKetik .statusbot untuk lihat status'));
            if (text.toLowerCase() === 'on') {
                global.anticallEnabled = true;
                global.anticall = true;
                return m.reply('✅ Anticall berhasil diaktifkan');
            } else if (text.toLowerCase() === 'off') {
                global.anticallEnabled = false;
                global.anticall = false;
                return m.reply('✅ Anticall berhasil dimatikan');
            } else {
                return m.reply(example('on/off'));
            }
        }

        case 'setting':
        case 'settingbot':
        case 'option':
        case 'statusbot': {
            if (!isOwner) return m.reply(msg.owner);
            const teks = `
𝐒𝐄𝐓𝐓𝐈𝐍𝐆 𝐁𝐎𝐓

AUTOREAD : ${global.autoreadEnabled ? '✅ ON' : '❌ OFF'}
ANTICALL : ${global.anticallEnabled ? '✅ ON' : '❌ OFF'}
WELCOME  : ${global.welcomeEnabled ? '✅ ON' : '❌ OFF'}
MODE     : ${global.selfmode ? 'SELF 🔒' : 'PUBLIC 🌐'}

Ketik .autoread on/off, .anticall on/off, .welcome on/off, .self / .public
`;
            return m.reply(teks);
        }

        default:
            return false;
    }
};
