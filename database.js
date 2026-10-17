/**
 * src/lib/database.js - JSON Database Helpers
 * Thread-safe read/write helpers for JSON files
 * By Angga Official
 */

const fs = require('fs');
const path = require('path');

/**
 * Read JSON file safely
 * @param {string} file - File path
 * @param {any} defaultValue - Default value if file not exists or invalid
 * @returns {any}
 */
function readDB(file, defaultValue = []) {
    try {
        if (!fs.existsSync(file)) {
            fs.writeFileSync(file, JSON.stringify(defaultValue));
            return defaultValue;
        }
        const content = fs.readFileSync(file).toString().trim();
        if (!content) return defaultValue;
        return JSON.parse(content);
    } catch (err) {
        console.error(`[readDB] ${file}:`, err.message);
        return defaultValue;
    }
}

/**
 * Write JSON file (pretty-printed)
 * @param {string} file - File path
 * @param {any} data - Data to write
 */
function writeDB(file, data) {
    try {
        const dir = path.dirname(file);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error(`[writeDB] ${file}:`, err.message);
        return false;
    }
}

/**
 * Add value to a JSON array file
 * @param {string} file
 * @param {any} value
 */
function pushToDB(file, value) {
    const data = readDB(file, []);
    if (!Array.isArray(data)) return false;
    data.push(value);
    writeDB(file, data);
    return true;
}

/**
 * Remove value from a JSON array file
 * @param {string} file
 * @param {any} value - Value to remove (using indexOf)
 */
function removeFromDB(file, value) {
    const data = readDB(file, []);
    if (!Array.isArray(data)) return false;
    const idx = data.indexOf(value);
    if (idx === -1) return false;
    data.splice(idx, 1);
    writeDB(file, data);
    return true;
}

/**
 * Check if value exists in a JSON array file
 * @param {string} file
 * @param {any} value
 * @returns {boolean}
 */
function inDB(file, value) {
    const data = readDB(file, []);
    return Array.isArray(data) && data.includes(value);
}

module.exports = {
    readDB,
    writeDB,
    pushToDB,
    removeFromDB,
    inDB,
};
