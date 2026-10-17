# Angga Official - WhatsApp Bot

WhatsApp Bot lengkap dengan pairing code, jalan di Termux, struktur folder GitHub-friendly.

## 🚀 Quick Start (Termux)

### 1. Install dependencies di Termux
```bash
pkg update && pkg upgrade -y
pkg install -y nodejs-lts git ffmpeg imagemagick libwebp python python-dev build-essential
```

### 2. Clone / extract script
```bash
git clone <repo-url> whatsapp-bot
# atau
unzip whatsapp-bot.zip
cd whatsapp-bot
```

### 3. Install npm packages
```bash
npm install
```

### 4. Edit `config.js`
Ganti minimal baris berikut:
```js
global.owner = "ISI_NOMOR_OWNER_DISINI";  // ganti dengan nomor WA kamu (format 62xxx)
```
Contoh:
```js
global.owner = "62895411941384";
```

### 5. Jalankan bot
```bash
node server.js
```

### 6. Pairing Code
- Saat bot start, akan muncul **8-digit pairing code** di terminal
- Buka WhatsApp di HP → **Settings** → **Linked Devices** → **Link with phone number**
- Masukkan kode pairing-nya
- Tunggu sampai muncul "BOT BERHASIL TERHUBUNG"

### 7. Test command
Kirim `.tes` ke bot. Bot akan balas "Bot aktif & online ✅"

---

## 📁 Folder Structure

```
whatsapp-bot/
├── server.js              # Entry point - run ini pertama kali
├── config.js              # ALL config - edit di sini
├── package.json           # NPM dependencies
├── .env.example           # Environment variable template
├── .gitignore
├── README.md              # This file
│
├── src/
│   ├── connection.js      # Baileys socket + pairing code + reconnect
│   ├── message.js         # Main message handler + command router
│   ├── store.js           # In-memory message cache
│   └── lib/
│       ├── function.js    # Utils: runtime, telegraPh, pinterest, dll
│       ├── converter.js   # toAudio, toPTT, toVideo (ffmpeg)
│       └── database.js    # JSON read/write helpers
│
├── commands/              # Modular command files
│   ├── main.js            # tes, halo, motivasi, owner, other
│   ├── menu.js            # allmenu, mainmenu, dll
│   ├── owner.js           # addown, delown, listown, addprem, delprem, listprem
│   ├── group.js           # antilink, hidetag, tagall, kick, promote, open/close
│   ├── downloader.js      # tiktok, facebook, ytmp3, yts, mediafire, play
│   ├── converter.js       # toaudio, tomp3, tovn, toptv, tts, toimage, sticker, tourl
│   ├── pushkontak.js      # pushkontak, savekontak, jpm, jpmpoll, jpmhidetag
│   ├── panel.js           # addadmin, addpanel, cp1gb-cp10gb, listserver, delpanel
│   ├── payment.js         # payment, danapay, qrispay, dll
│   ├── ai.js              # chatgpt, ai
│   ├── tools.js           # remini, qc, pinterest, setppbot, sc, runtime, dll
│   └── setting.js         # welcome, autoread, anticall, statusbot
│
└── all/
    ├── tmp/               # Temp download files
    └── database/          # JSON database
        ├── owner.json     # List owner
        ├── premium.json   # List premium
        ├── antilink.json  # Grup yang aktif antilink V1
        ├── antilink2.json # Grup yang aktif antilink V2
        ├── contacts.json  # Saved contacts
        ├── contacts.vcf   # Contacts export
        ├── teksjpm.js     # Default text JPM
        ├── virtex.js      # Bug text reference
        └── delay.js      # Delay config
```

---

## 📋 Available Commands (80+)

### Main Menu
- `.tes`, `.test`, `.online` - Cek bot aktif
- `.halo`, `.hai` - Greeting
- `.assalamualaikum` - Reply salam
- `.motivasi` - Random motivasi
- `.owner` - Contact owner
- `.other` - List produk
- `.panel` - Group diskusi

### Menu Lists
- `.AnggaNesia` / `.menu` - Main menu
- `.allmenu` - All commands
- `.mainmenu`, `.downloadmenu`, `.convertmenu`
- `.panelmenu`, `.pushkontakmenu`, `.grupmenu`, `.ownermenu`

### Owner & Premium
- `.addown <nomor>` - Tambah owner
- `.delown <nomor>` - Hapus owner
- `.listown` - List owner
- `.addprem <nomor>` - Tambah premium
- `.delprem <nomor>` - Hapus premium
- `.listprem` - List premium

### Downloader
- `.tiktok <link>` - Download video TikTok
- `.tiktokaudio <link>` - Download audio TikTok
- `.facebook <link>` - Download video Facebook
- `.ytmp3 <link>` - Download audio YouTube
- `.play <judul>` - Search & play YouTube
- `.yts <query>` - Search YouTube
- `.mediafire <link>` - Download file MediaFire

### Converter
- `.toaudio` - Reply video → audio MP3
- `.tomp3` - Sama dengan toaudio
- `.tovn` - Reply audio/video → VN
- `.toptv` - Reply video → PTV
- `.tts <teks>` - Text to speech
- `.toimage` - Reply sticker → image
- `.sticker` / `.s` - Buat sticker dari image/video
- `.tourl` - Upload image ke telegra.ph

### Group
- `.antilink on/off` - Anti-link V1 (kick + delete)
- `.antilinkV2 on/off` - Anti-link V2 (delete only)
- `.statusgc` - Cek status antilink grup
- `.hidetag <teks>` - Hidetag mention
- `.tagall <teks>` - Tag all member
- `.kick <@tag>` - Kick member
- `.promote <@tag>` - Promote to admin
- `.demote <@tag>` - Demote to member
- `.add <nomor>` - Tambah member
- `.open` / `.close` - Open/close group
- `.setnamagc <teks>` - Ganti nama grup
- `.setdeskgc <teks>` - Ganti deskripsi
- `.setppgc` - Ganti foto grup
- `.leavegc` - Bot keluar grup
- `.listgc` - List semua grup bot
- `.join <link>` - Bot join grup
- `.delete` / `.del` - Hapus pesan

### Pushkontak & JPM
- `.pushkontak <teks>` - Push kontak (current group)
- `.pushkontak1 idgrup|pesan` - Push kontak (custom group)
- `.pushkontak2 idgrup|jeda|pesan` - Push kontak (custom delay)
- `.savekontak` - Save kontak grup saat ini
- `.savekontak2 <idgrup>` - Save kontak grup lain
- `.startjpm` - JPM broadcast pakai teksjpm
- `.jpm <teks>` - Broadcast text ke semua grup
- `.jpm2 <caption>` (reply image) - Broadcast foto + teks
- `.jpmhidetag <teks>` - Broadcast + hidetag
- `.jpmpoll teks1|teks2|teks3` - Broadcast poll
- `.jpmtesti <caption>` (reply image) - Broadcast testimoni (with channel mention)
- `.setteksjpm <teks>` - Set text JPM
- `.teksjpm` - Lihat text JPM

### Panel Pterodactyl
- `.addadmin <username>` - Buat admin panel
- `.adduser <username>` - Buat user panel
- `.addpanel <nama>` - Buat panel (interactive RAM picker)
- `.cp1gb` - `.cp10gb` - Buat panel RAM 1-10 GB
- `.cpunli` - Buat panel unlimited
- `.listadmin` - List admin panel
- `.listuser` - List user panel
- `.listserver` - List server
- `.deladmin <id>` - Hapus admin
- `.deluser <id>` - Hapus user
- `.delpanel <id>` - Hapus server

### Payment (placeholder)
- `.payment` - Pilih metode payment
- `.danapay`, `.ovopay`, `.gopaypay`, `.shopeepay`, `.qrispay`, `.bripay`

### AI
- `.chatgpt <teks>` - Chat GPT-4
- `.ai <teks>` - OpenAI

### Tools
- `.remini` (reply image) - Enhance foto HD
- `.tohd` (reply image) - Enhance foto HD (lower tier)
- `.qc <teks>` - Quote sticker
- `.pinterest <query>` - Search Pinterest
- `.setppbot` (reply image) - Ganti foto profil bot
- `.setpppanjang` (reply image) - Ganti foto profil panjang
- `.setbio <teks>` - Ganti bio bot
- `.public` / `.self` - Mode public/self
- `.get <url>` - Fetch JSON dari URL
- `.sc` - Download script bot (owner only)
- `.clearsession` - Clear session files (keep creds.json)
- `.runtime` - Bot uptime & memory

### Settings
- `.welcome on/off` - Toggle welcome new member
- `.autoread on/off` - Toggle auto-read messages
- `.anticall on/off` - Toggle reject incoming calls
- `.statusbot` - Lihat semua setting

### Owner Eval (Hanya owner)
- `$<command>` - Exec shell command
- `><js code>` - Eval JavaScript
- `=>>async code` - Async eval

---

## ⚙️ Configuration (`config.js`)

Edit file `config.js` untuk mengatur:

| Variable | Description | Default |
|----------|-------------|---------|
| `global.owner` | Nomor WA owner | `ISI_NOMOR_OWNER_DISINI` |
| `global.pairingNumber` | Nomor untuk pairing | sama dengan owner |
| `global.namabot` | Nama bot di terminal | `Angga Bot` |
| `global.branding` | Branding text | `Angga Official` |
| `global.autoread` | Auto-read messages | `false` |
| `global.anticall` | Reject calls | `false` |
| `global.welcome` | Welcome new member | `false` |
| `global.domain` | URL panel Pterodactyl | placeholder |
| `global.apikey` | Pterodactyl app key | placeholder |
| `global.dana`, `.ovo`, dll | Payment nomors | `false` |

---

## 🛠️ Troubleshooting

### Bot tidak bisa konek / pairing code gagal
1. Pastikan nomor owner valid format `62xxx`
2. Hapus folder session: `rm -rf ./session`
3. Restart bot: `node server.js`
4. Coba masuk kode lagi

### Sticker maker error
- Install libwebp: `pkg install libwebp`
- Pastikan imagemagick terpasang: `pkg install imagemagick`

### Audio converter error (toaudio/tovn)
- Pastikan ffmpeg terpasang: `ffmpeg -version`
- Install: `pkg install ffmpeg`

### ytmp3/play error
- Update ytdl-core: `npm update ytdl-core`
- Beberapa video restricted, coba video lain

### Panel commands error
- Edit `config.js`, isi `global.domain`, `global.apikey`, `global.capikey` dengan kredensial Pterodactyl asli
- Format API key: `ptla_xxx` untuk application, `ptlc_xxx` untuk client

### Bot lemot / banyak error
- Clear session lama: `rm -rf ./session` (akan minta pairing ulang)
- Clear tmp: `rm -f all/tmp/*`
- Restart bot

### Error `Cannot find module`
- Jalankan: `npm install`
- Jika masih error: `rm -rf node_modules && npm install`

---

## 📦 Termux Dependencies List

```bash
pkg install -y nodejs-lts git ffmpeg imagemagick libwebp python
```

Minimum versions:
- Node.js: 18.x atau 20.x (`node -v`)
- npm: 9.x+ (`npm -v`)
- ffmpeg: 4.x (`ffmpeg -version`)
- git: 2.x (`git --version`)

---

## 🔄 Auto-Restart

Bot akan auto-restart kalau:
- File `server.js` atau `src/message.js` diubah
- Koneksi terputus (reconnect otomatis)
- Process crash (uncaughtException akan dilog, tidak exit)

---

## 📝 License

MIT License - Free to use, modify, distribute.

## 👨‍💻 Author

**Angga Official**
- YouTube: https://www.youtube.com/@Bacotamatpro03
- Telegram: (https://t.me/PredikSpaceman)
- WhatsApp: (https://wa.me/628985035456)

---

## ⚠️ Disclaimer

Bot ini dibuat untuk tujuan educational. Gunakan dengan bijak:
- Jangan spam broadcast berlebihan (bisa kena ban)
- Jangan pakai untuk ngerusak grup orang
- Selalu izin ke admin grup sebelum pakai pushkontak/JPM
- Penyalahgunaan tanggung jawab pengguna

© Angga Official
