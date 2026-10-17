/**
 * src/lib/converter.js - Media Converters
 * =====================================================
 * toAudio, toPTT, toVideo - using ffmpeg
 * By Angga Official
 * =====================================================
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const ffmpegPath = require('fluent-ffmpeg');
const { tmpdir } = require('os');

const execAsync = promisify(exec);

// Find ffmpeg binary
let ffmpegBin = 'ffmpeg';
try {
    const fluent = require('fluent-ffmpeg');
    if (fluent && typeof fluent.setFfmpegPath === 'function') {
        fluent.setFfmpegPath(ffmpegBin);
    }
} catch (_) {}

const exec2 = (cmd) => new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
        if (err) return reject(err);
        resolve(stdout);
    });
});

// ============================================================
// TO AUDIO (video/audio → mp3 audio)
// ============================================================
async function toAudio(buffer, ext = 'mp4') {
    try {
        const tmpFile = path.join(tmpdir(), `input_${Date.now()}.${ext}`);
        const outFile = path.join(tmpdir(), `output_${Date.now()}.mp3`);
        fs.writeFileSync(tmpFile, buffer);

        const cmd = `ffmpeg -y -i ${tmpFile} -vn -ac 2 -codec:a libmp3lame -b:a 128k ${outFile}`;
        await exec2(cmd);

        const result = fs.readFileSync(outFile);
        fs.unlinkSync(tmpFile);
        if (fs.existsSync(outFile)) fs.unlinkSync(outFile);
        return result;
    } catch (err) {
        console.error('[toAudio] error:', err.message);
        throw err;
    }
}

// ============================================================
// TO PTT (audio → push-to-talk / voice message)
// ============================================================
async function toPTT(buffer, ext = 'mp4') {
    try {
        const tmpFile = path.join(tmpdir(), `ptt_input_${Date.now()}.${ext}`);
        const outFile = path.join(tmpdir(), `ptt_output_${Date.now()}.opus`);
        fs.writeFileSync(tmpFile, buffer);

        // Convert to opus format for PTT
        const cmd = `ffmpeg -y -i ${tmpFile} -vn -c:a libopus -b:a 32k -ar 16000 -ac 1 ${outFile}`;
        await exec2(cmd);

        const result = fs.readFileSync(outFile);
        fs.unlinkSync(tmpFile);
        if (fs.existsSync(outFile)) fs.unlinkSync(outFile);
        return result;
    } catch (err) {
        console.error('[toPTT] error:', err.message);
        throw err;
    }
}

// ============================================================
// TO VIDEO (image + audio → video, or convert format)
// ============================================================
async function toVideo(buffer, ext = 'mp4') {
    try {
        const tmpFile = path.join(tmpdir(), `vid_input_${Date.now()}.${ext}`);
        const outFile = path.join(tmpdir(), `vid_output_${Date.now()}.mp4`);
        fs.writeFileSync(tmpFile, buffer);

        const cmd = `ffmpeg -y -i ${tmpFile} -c:v libx264 -c:a aac -movflags +faststart -preset fast ${outFile}`;
        await exec2(cmd);

        const result = fs.readFileSync(outFile);
        fs.unlinkSync(tmpFile);
        if (fs.existsSync(outFile)) fs.unlinkSync(outFile);
        return result;
    } catch (err) {
        console.error('[toVideo] error:', err.message);
        throw err;
    }
}

// ============================================================
// FFMPEG exec helper (raw ffmpeg command)
// ============================================================
function ffmpeg(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) return reject(err);
            resolve(stdout);
        });
    });
}

module.exports = {
    toAudio,
    toPTT,
    toVideo,
    ffmpeg,
    exec2,
};
