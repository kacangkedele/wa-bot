#!/bin/bash
# ============================================================
# install.sh - One-command installer for Termux
# By Angga Official
# ============================================================
set -e

echo "╔══════════════════════════════════════════╗"
echo "║   Angga Official - WhatsApp Bot Setup    ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Update package list
echo "[1/5] Updating Termux packages..."
pkg update -y && pkg upgrade -y

# Install system dependencies
echo ""
echo "[2/5] Installing system dependencies..."
pkg install -y nodejs-lts git ffmpeg imagemagick libwebp python

# Verify Node.js
echo ""
echo "[3/5] Verifying Node.js..."
NODE_VERSION=$(node -v 2>/dev/null || echo "none")
if [ "$NODE_VERSION" = "none" ]; then
    echo "❌ Node.js installation failed!"
    exit 1
fi
echo "✅ Node.js installed: $NODE_VERSION"

# Install npm dependencies
echo ""
echo "[4/5] Installing npm dependencies (this may take a few minutes)..."
npm install

# Check config
echo ""
echo "[5/5] Checking configuration..."
if grep -q "ISI_NOMOR_OWNER_DISINI" config.js 2>/dev/null; then
    echo ""
    echo "⚠️  PERINGATAN: Nomor owner masih placeholder!"
    echo "   Edit file config.js dan ganti ISI_NOMOR_OWNER_DISINI"
    echo "   dengan nomor WhatsApp kamu (format: 62xxx)"
    echo ""
    echo "   Contoh:"
    echo '   global.owner = "62895411941384";'
    echo ""
    echo "   Setelah edit, jalankan:"
    echo "   node server.js"
else
    echo "✅ Nomor owner sudah diset!"
    echo ""
    echo "Setup selesai! Jalankan:"
    echo "  node server.js"
fi

echo ""
echo "════════════════════════════════════════════"
echo "By Angga Official"
echo "════════════════════════════════════════════"
