/**
 * commands/downloader.js - Downloader commands
 * tiktok, facebook, ytmp3, yts, mediafire, play
 * By Angga Official
 */

const ytdl = require('ytdl-core');
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');
const { promisify } = require('util');
const streamPipeline = promisify(pipeline);

module.exports = async (ctx) => {
    const { Skyzo, m, command, args, text, isPremium, isOwner, msg, example, fetchJson } = ctx;

    switch (command) {
        case 'yts':
        case 'ytsearch': {
            if (!isPremium) return m.reply('Premium only! Hubungi owner untuk premium.');
            if (!text) return m.reply(example('Dj Tiktok / judul lagu'));
            await m.reply(msg.wait);
            try {
                const search = await yts(text);
                if (!search.all || search.all.length === 0) {
                    return m.reply('Tidak ditemukan hasil untuk: ' + text);
                }
                let teks = `*YTS Search Results*\n\n`;
                for (const vid of search.all.slice(0, 10)) {
                    teks += `𝗧𝗶𝘁𝗹𝗲 : ${vid.title}\n𝗖𝗵𝗮𝗻𝗻𝗲𝗹 : ${vid.author?.name || 'unknown'}\n𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻 : ${vid.timestamp || 'unknown'}\n𝗨𝗥𝗟 : ${vid.url}\n\n`;
                }
                return m.reply(teks);
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
        }

        case 'ytmp3':
        case 'ytdl': {
            if (!text) return m.reply(example('linknya\nContoh: .ytmp3 https://youtube.com/watch?v=xxx'));
            if (!text.includes('https')) return m.reply('Invalid link');
            if (!text.includes('youtube.com') && !text.includes('youtu.be')) return m.reply('Invalid YouTube link');
            await m.reply(msg.wait);
            const judul = path.join('./all/tmp', `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.mp3`);
            try {
                const info = await ytdl.getInfo(text);
                const { title, thumbnail, author, lengthSeconds } = info.videoDetails;
                await streamPipeline(
                    ytdl(text, { quality: 'highestaudio', filter: 'audioonly' }),
                    fs.createWriteStream(judul)
                );
                await Skyzo.sendMessage(m.chat, {
                    audio: fs.readFileSync(judul),
                    mimetype: 'audio/mpeg',
                    contextInfo: {
                        mentionedJid: [m.sender],
                        externalAdReply: {
                            thumbnailUrl: thumbnail,
                            title: title.slice(0, 50),
                            body: `Duration: ${lengthSeconds}s | ${author?.name || ''}`,
                            sourceUrl: text,
                            renderLargerThumbnail: true,
                            mediaType: 1,
                        },
                    },
                }, { quoted: m });
                fs.unlinkSync(judul);
            } catch (err) {
                if (fs.existsSync(judul)) fs.unlinkSync(judul);
                return m.reply('Error: ' + err.message);
            }
            return;
        }

        case 'ytplay':
        case 'play': {
            if (!isPremium) return m.reply('Premium only!');
            if (!text) return m.reply(example('Dj tiktok / judul lagu'));
            await m.reply(msg.wait);
            try {
                const search = await yts(text);
                if (!search.videos || search.videos.length === 0) {
                    return m.reply('Tidak ditemukan lagu untuk: ' + text);
                }
                const vid = search.videos[0];
                const { title, thumbnail, timestamp, author, url } = vid;
                const acak = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.mp3`;
                const filePath = path.join('./all/tmp', acak);
                await streamPipeline(
                    ytdl(url, { filter: 'audioonly', quality: 'highestaudio' }),
                    fs.createWriteStream(filePath)
                );
                await Skyzo.sendMessage(m.chat, {
                    audio: fs.readFileSync(filePath),
                    mimetype: 'audio/mpeg',
                    contextInfo: {
                        externalAdReply: {
                            thumbnailUrl: thumbnail,
                            title: title.slice(0, 50),
                            body: `Duration: ${timestamp} | Author: ${author?.name || ''}`,
                            sourceUrl: url,
                            renderLargerThumbnail: true,
                            mediaType: 1,
                        },
                    },
                }, { quoted: m });
                fs.unlinkSync(filePath);
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
            return;
        }

        case 'tiktok':
        case 'tt': {
            if (!text) return m.reply(example('linknya\nContoh: .tiktok https://tiktok.com/@user/video/xxx'));
            if (!/tiktok\.com/.test(text)) return m.reply('Invalid TikTok link');
            await m.reply(msg.wait);
            try {
                const res = await fetchJson(`https://aemt.me/download/tiktokslide?url=${encodeURIComponent(text)}`);
                if (!res?.status) return m.reply('Failed to download. Pastikan link valid.');
                const data = res.result?.data || res.result;
                if (!data) return m.reply('No data received from API');
                if (data.duration == 0 && data.images?.length) {
                    // Slide post
                    for (const img of data.images) {
                        await Skyzo.sendMessage(m.chat, {
                            image: { url: img },
                            caption: `✅ Downloaded by ${global.branding}`,
                        }, { quoted: m });
                    }
                } else if (data.play) {
                    await Skyzo.sendMessage(m.chat, {
                        video: { url: data.play },
                        mimetype: 'video/mp4',
                        caption: `✅ Downloaded by ${global.branding}`,
                    }, { quoted: m });
                } else {
                    return m.reply('No video/image found');
                }
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
            return;
        }

        case 'tiktokaudio':
        case 'tiktokmp3': {
            if (!text) return m.reply(example('linknya\nContoh: .tiktokaudio https://tiktok.com/xxx'));
            if (!text.includes('tiktok.com')) return m.reply('Link tautan tidak valid!');
            await m.reply(msg.wait);
            try {
                const res = await fetchJson(`https://aemt.me/download/tiktokdl?url=${encodeURIComponent(text)}`);
                if (!res?.status || !res?.result?.music) return m.reply('Failed to download audio');
                await Skyzo.sendMessage(m.chat, {
                    audio: { url: res.result.music },
                    mimetype: 'audio/mpeg',
                }, { quoted: m });
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
            return;
        }

        case 'facebook':
        case 'fb':
        case 'fbdl': {
            if (!text) return m.reply(example('link video Facebook'));
            if (!/facebook\.com|fb\.watch/.test(text)) return m.reply('Invalid Facebook link');
            await m.reply(msg.wait);
            try {
                const res = await fetchJson(`https://aemt.me/download/fbdown?url=${encodeURIComponent(text)}`);
                if (!res?.status) return m.reply('Failed to download video');
                const urls = res.result?.url?.urls || [];
                if (urls.length === 0) return m.reply('No video found');
                const url = res.result.url.isHdAvailable ? urls[0]?.hd : urls[0]?.sd;
                if (!url) return m.reply('No video URL found');
                await Skyzo.sendMessage(m.chat, {
                    video: { url },
                    mimetype: 'video/mp4',
                    caption: `✅ Downloaded by ${global.branding}`,
                }, { quoted: m });
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
            return;
        }

        case 'mediafire':
        case 'mediafiredl': {
            if (!isPremium) return m.reply('Premium only!');
            if (!text) return m.reply(example('linknya\nContoh: .mediafire https://mediafire.com/xxx'));
            if (!text.includes('mediafire.com')) return m.reply('Invalid MediaFire link');
            await m.reply(msg.wait);
            try {
                const res = await fetchJson(`https://aemt.me/mediafire?url=${encodeURIComponent(text)}`);
                if (!res?.status || !res?.result?.url) return m.reply('Failed to download');
                const r = res.result;
                if (r.filesize && r.filesize.includes('GB')) return m.reply('Ukuran file terlalu besar');
                if (r.filesize && parseFloat(r.filesize.split('MB')[0]) >= 100) return m.reply('Ukuran file terlalu besar');
                await Skyzo.sendMessage(m.chat, {
                    document: { url: r.url },
                    fileName: r.filename || 'file',
                    mimetype: 'application/octet-stream',
                    caption: `✅ Downloaded by ${global.branding}`,
                }, { quoted: m });
            } catch (err) {
                return m.reply('Error: ' + err.message);
            }
            return;
        }

        default:
            return false;
    }
};
