# 🛡️ Vault-Quest: The RPG Password Manager

**Vault-Quest** turns password management into an epic digital adventure. Protect your Kingdom (digital identity) by brewing powerful Password Potions, slaying Breach Demons from the Dark Web, and managing your Secret Scrolls — all from a single enchanted interface.

---

## ⚔️ Features

### 🧙 The Alchemist's Lab (Password Generator)
- **Potion mode** — Brew passwords with configurable length and complexity
- Three tiers: Common (letters + digits), Rare (+ symbols), Legendary (full punctuation)
- **Rune Words mode** — Forge memorable passphrases: 3–6 random words with a choice of separator (`-`, `.`, `_`, space)
- Real-time **Potency Meter** shows password strength as you type or brew
- One-click copy to clipboard

### 🔐 The Secret Vault
- AES-256 encrypted storage — your keys never leave your machine unencrypted
- Armor class tags: Common, Uncommon, Rare, Epic, Legendary (auto-assigned from strength score when adding manually)
- Optional **notes** field per entry — expandable inline
- Show/hide password toggle per entry
- Inline edit — change service name, password, notes, or armor class without re-adding
- Search/filter vault by service name in real time
- One-click copy with visual confirmation
- **RotVines** — entries 90+ days old sprout an animated rotting-vine overlay with a "Rotate this!" warning

### 🕵️ Breach Monitoring (Have I Been Pwned)
- Automatic background scan runs every 24 hours
- Per-entry manual check from the vault
- Breach count displayed on each vault card
- Admin dashboard: trigger a full scan, view total vs. compromised entries

### 🔑 Authentication & Profile
- Username + password signup/login
- Google Sign-In (OAuth2)
- JWT sessions (24-hour tokens)
- **Profile setup** — choose a display name and avatar on first login
- **Onboarding tour** — guided walkthrough shown to new users after profile creation

### 🛠️ Admin Panel
- User roster with roles
- Kingdom stats: total users, total entries
- Manual breach scan trigger with results summary
- **Banish users** — remove any account from the kingdom

---

## 🚀 Getting Started

### Quick Start
```bash
vq
```

### Manual Launch
```bash
python3 scripts/launch.py
```

### Requirements
- Python 3.10+
- Node.js 18+
- A `.env` file in `backend/` with:
  ```
  SECRET_KEY=<random hex>
  MASTER_KEY=<64-char hex>
  GOOGLE_CLIENT_ID=<your google oauth client id>
  DATABASE_URL=sqlite:///./vault_quest.db
  ADMIN_USERNAMES=your_username
  ADMIN_EMAILS=your@email.com
  ```

---

## 🔒 Security Model
- Passwords are AES-256-CBC encrypted at rest with a per-install master key
- Breach checks use SHA-1 k-anonymity (only the first 5 characters of the hash are sent to HIBP — the full password never leaves your machine)
- JWTs are signed with a secret key and expire after 24 hours

---

## 🗺️ Roadmap

- [x] **Phase 1 — The Alchemist's Lab:** Password generator, encrypted vault, one-click launch
- [x] **Phase 2 — The Underdark:** Breach monitoring (HIBP integration, auto-scan, per-entry checks, admin dashboard), Google Sign-In, full CRUD on vault entries, UX polish (toasts, search, show/hide, inline edit)
- [ ] **Phase 3 — The Live Siege:** Real-time WebSocket alerts when the auto-scan detects a new breach — no need to open the app
- [ ] **Phase 4 — Guilds:** Family/team sharing and co-op vault management

---

*Built with ❤️ for Cyber Security and RPG lovers.*
