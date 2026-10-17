/**
 * src/lib/function.js - Utility Functions
 * =====================================================
 * Helper functions used across all commands
 * By Angga Official
 * =====================================================
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');
const { exec } = require('child_process');
const FileType = require('file-type');

// ============================================================
// RUNTIME - format bot uptime
// ============================================================
function runtime(seconds) {
    if (!seconds || seconds < 0) seconds = 0;
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
}

// ============================================================
// RANDOM STRING / FILENAME
// ============================================================
function getRandom(ext = '') {
    return `${Math.random().toString(36).slice(2, 10)}${ext}`;
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// ============================================================
// TIME / DATE helpers (Indonesia locale)
// ============================================================
function getTime() {
    return new Date().toISOString();
}

function tanggal(n, language = 'id') {
    try {
        const d = new Date(n);
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch {
        return 'Tanggal tidak valid';
    }
}

function ucapan() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'Selamat pagi';
    if (hour >= 11 && hour < 15) return 'Selamat siang';
    if (hour >= 15 && hour < 18) return 'Selamat sore';
    if (hour >= 18 && hour < 22) return 'Selamat malam';
    return 'Selamat malam larut';
}

// ============================================================
// TELEGRAPH - upload image to telegra.ph
// ============================================================
async function telegraPh(filePath) {
    try {
        if (!fs.existsSync(filePath)) throw new Error('File not found');
        const FormData = require('form-data');
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));
        const { data } = await axios.post('https://telegra.ph/upload', form, {
            headers: form.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 30000,
        });
        if (data?.[0]?.error) throw new Error(data[0].error);
        if (!data?.[0]?.src) throw new Error('Upload failed');
        return 'https://telegra.ph' + data[0].src;
    } catch (err) {
        console.error('[telegraPh] error:', err.message);
        throw err;
    }
}

// ============================================================
// PINTEREST SEARCH
// ============================================================
async function pinterest(query) {
    try {
        if (!query) throw new Error('Query required');
        const { data } = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=/search/pins/?q=${encodeURIComponent(query)}&data={"options":{"query":"${encodeURIComponent(query)}","scope":"pins"}}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
            },
            timeout: 15000,
        });
        const results = (data?.resource_response?.data?.results || [])
            .filter(v => v?.images?.orig?.url)
            .map(v => v.images.orig.url);
        return results;
    } catch (err) {
        console.error('[pinterest] error:', err.message);
        return [];
    }
}

// ============================================================
// FETCH JSON helper
// ============================================================
async function fetchJson(url, options) {
    try {
        const { data } = await axios.get(url, {
            ...options,
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
                ...(options?.headers || {}),
            },
        });
        return data;
    } catch (err) {
        throw err;
    }
}

// ============================================================
// GET BUFFER (download file as Buffer)
// ============================================================
async function getBuffer(url, options) {
    try {
        const { data } = await axios.get(url, {
            ...options,
            responseType: 'arraybuffer',
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0',
                ...(options?.headers || {}),
            },
        });
        return Buffer.from(data);
    } catch (err) {
        throw err;
    }
}

// ============================================================
// GENERATE PROFILE PICTURE (resize + crop to square aspect)
// ============================================================
async function generateProfilePicture(media) {
    try {
        const Jimp = require('jimp');
        const buffer = fs.existsSync(media) ? await fs.promises.readFile(media) : media;
        const image = await Jimp.read(buffer);
        const minSize = Math.min(image.bitmap.width, image.bitmap.height);
        const x = Math.floor((image.bitmap.width - minSize) / 2);
        const y = Math.floor((image.bitmap.height - minSize) / 2);
        const cropped = image.crop(x, y, minSize, minSize);
        const resized = await cropped.resize(640, 640).getBufferAsync(Jimp.MIME_JPEG);
        return { img: resized, preview: resized };
    } catch (err) {
        console.error('[generateProfilePicture] error:', err.message);
        throw err;
    }
}

// ============================================================
// TO RUPIAH (format number to Rupiah currency)
// ============================================================
function toRupiah(number) {
    try {
        let num = Number(number);
        if (isNaN(num)) return '0';
        return 'Rp ' + num.toLocaleString('id-ID');
    } catch {
        return 'Rp 0';
    }
}

// ============================================================
// SLEEP
// ============================================================
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================
// IS URL helper
// ============================================================
function isUrl(url) {
    if (!url || typeof url !== 'string') return false;
    try {
        new URL(url);
        return /^https?:\/\//.test(url);
    } catch {
        return false;
    }
}

// ============================================================
// IS JSON helper
// ============================================================
function isJson(str) {
    try {
        JSON.parse(str);
        return true;
    } catch {
        return false;
    }
}

// ============================================================
// FORMAT SIZE (bytes to human readable)
// ============================================================
function formatSize(bytes) {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

// ============================================================
// COLOR (chalk wrapper)
// ============================================================
function color(text, c) {
    try {
        const chalk = require('chalk');
        const colors = {
            red: chalk.red, green: chalk.green, yellow: chalk.yellow,
            blue: chalk.blue, cyan: chalk.cyan, white: chalk.white,
            magenta: chalk.magenta, gray: chalk.gray,
        };
        return colors[c] ? colors[c](text) : text;
    } catch {
        return text;
    }
}

// ============================================================
// Get file type from buffer
// ============================================================
async function getFileType(buffer) {
    try {
        const result = await FileType.fromBuffer(buffer);
        return result;
    } catch {
        return null;
    }
}

// ============================================================
// EXPORTS
// ============================================================
module.exports = {
    runtime,
    getRandom,
    makeid,
    getTime,
    tanggal,
    ucapan,
    telegraPh,
    pinterest,
    fetchJson,
    getBuffer,
    generateProfilePicture,
    toRupiah,
    sleep,
    isUrl,
    isJson,
    formatSize,
    color,
    getFileType,
};
