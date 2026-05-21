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
- Armor class tags: Common, Uncommon, Rare, Epic, Legendary (auto-assigned from strength score)
- Optional **notes** field per entry — expandable inline
- Show/hide password toggle per entry
- Inline edit — change service name, password, notes, or armor class without re-adding
- Search/filter vault by service name in real time
- One-click copy with visual confirmation
- **RotVines** — entries 90+ days old sprout an animated rotting-vine overlay with a "Rotate this!" warning
- **Breach alert modal** — detailed view with affected entry info and guided remediation

### 🕵️ Breach Monitoring (Have I Been Pwned)
- Automatic background scan every 24 hours
- Per-entry manual check from the vault
- Breach count displayed on each vault card
- Admin dashboard: trigger a full scan, view total vs. compromised entries

### 🔑 Authentication & Profile
- Username + password signup/login
- Google Sign-In (OAuth2)
- JWT sessions (24-hour tokens)
- **Profile modal** — avatar glow, level badge, XP bar, badge grid, quick-nav to Achievements and Quests
- **Onboarding tour** — guided walkthrough shown to new users after profile creation

### 🏆 The Quest Board
- Daily quests that rotate each day (seeded shuffle)
- Long-term quests with XP rewards and progress tracking
- Filter by All / Active / Claimable / Claimed
- Quest XP scales with hero level bonuses

### ⚔️ Training Grounds — Daily XP
**Knowledge Quizzes** (rotate daily, 5 questions drawn from a pool per category):
- Password Security, Phishing & Social Engineering, Cryptography Basics, Dark Web & Breaches

**Mini-Games** (7 games, each earnable once per day — fullscreen overlay):
| Game | Description | XP |
|------|-------------|-----|
| Password Duel | Pick the stronger of two passwords — 8 rounds | up to 80 |
| Speed Rater | Rate 8 passwords before the timer runs out | up to 80 |
| Phish or Legit | Identify phishing URLs, emails & scenarios — 8 rounds | up to 96 |
| Vault Memory | Memorize 4 services in 3 seconds, then recall them | up to 60 |
| Crack Timer | Estimate how fast each password cracks — 6 rounds | up to 90 |
| Type It Out | Type a randomly generated password as fast as possible | up to 100 |
| Password Forge | Spend 4 mana to craft the strongest password you can | up to 80 |

### 📖 The Codex
- 5 chapters × 10 slides each covering core security topics
- **Knowledge check on slide 5** of every chapter — 2 quick questions
- Chapters: Password Fundamentals, Phishing & Social Engineering, Cryptography Basics, Dark Web & Breaches, Advanced Techniques

### 🎖️ Hall of Glory (Achievements Tab)
- **Hero card** with avatar glow, level badge, XP bar, and next-level progress
- **Badge collection** — 6 unique badges earned at levels 2, 5, 7, 10, 12, 14
- **Aura collection** — 3 hero auras unlocked at levels 4, 8, 15
- **Active XP bonuses** — permanent daily/training/quest multipliers from leveling
- **Level roadmap** — full 15-level timeline with rewards at every milestone

### 📈 Hero Leveling (15 Levels)
- XP earned from quests, daily tasks, quizzes, and mini-games
- Each level unlocks a reward: badge, aura, or permanent XP bonus
- **Level-up modal** — animated reward reveal on level-up
- Level bonuses stack as you climb:
  - Lv 3, 11: +5/+10 XP per daily action
  - Lv 6, 13: +10/+15 XP per training game
  - Lv 9: +20 XP per quest claimed

### 🛠️ Admin Panel
- User roster with roles
- Kingdom stats: total heroes, total vault entries
- Manual breach scan trigger with results summary
- **Banish users** — remove any account from the kingdom
- **Grand Overseer** — exclusive admin badge ⚜️, max level display, all rewards unlocked

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
- [x] **Phase 3 — The Training Grounds:** Daily XP system, 7 mini-games (fullscreen), 4 quiz categories, 5-chapter Codex with knowledge checks, 15-level hero progression, badges, auras, Achievements tab
- [ ] **Phase 4 — The Live Siege:** Real-time WebSocket alerts when the auto-scan detects a new breach — no need to open the app
- [ ] **Phase 5 — Guilds:** Family/team sharing and co-op vault management

---

*Built with ❤️ for Cyber Security and RPG lovers.*
