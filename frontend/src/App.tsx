import React, { useState, useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          renderButton: (element: HTMLElement | null, config: object) => void;
        };
      };
    };
  }
}

import {
  Shield, FlaskConical, Scroll, Sparkles, Copy, RefreshCw,
  Skull, Trash2, Key, LogOut, User, Eye, Activity, Users,
  Beaker, ShieldAlert, Zap, Wand2, Star, Ghost, Crown, Radar,
  Pencil, Search, Check, ScrollText, ChevronDown, ChevronUp,
  ArrowRight, AlertTriangle, Trophy, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "726201702658-a01oskaisbkkpnpltij5f573johk2836.apps.googleusercontent.com";

const AVATARS = [
  { id: 'knight', icon: Shield, label: 'The Knight', color: '#00f2ff' },
  { id: 'mage', icon: Wand2, label: 'The Mage', color: '#bd00ff' },
  { id: 'ranger', icon: Star, label: 'The Ranger', color: '#00ff41' },
  { id: 'ghost', icon: Ghost, label: 'The Rogue', color: '#ff003c' },
  { id: 'alchemist', icon: FlaskConical, label: 'The Alchemist', color: '#ffb800' }
];

const getPasswordStrength = (password: string) => {
  if (!password) return { score: 0, label: "Empty Vessel", color: "#666" };
  let score = 0;
  if (password.length > 8) score++;
  if (password.length > 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels = [
    { label: "Weak Potion", color: "#ff003c" },
    { label: "Fair Brew", color: "#ffb800" },
    { label: "Stable Mix", color: "#00ff41" },
    { label: "Strong Essence", color: "#bd00ff" },
    { label: "Legendary Potency", color: "#00f2ff" }
  ];
  const finalScore = Math.min(score, 4);
  return { score: finalScore, ...levels[finalScore] };
};

const Leaf = ({ d, delay, light = false }: { d: string; delay: number; light?: boolean }) => (
  <motion.path d={d} fill={light ? '#5aaa18' : '#2d6a04'}
    stroke="#1a4200" strokeWidth="0.3"
    initial={{ opacity: 0 }} animate={{ opacity: [0, 0.95, 0.85] }}
    transition={{ delay, duration: 0.6, times: [0, 0.6, 1] }} />
);

const Stem = ({ d, delay, width = 1.6 }: { d: string; delay: number; width?: number }) => (
  <motion.path d={d} stroke="#2d6a04" strokeWidth={width} fill="none" strokeLinecap="round"
    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
    transition={{ duration: 2.2, ease: 'easeOut', delay }} />
);

const Tendril = ({ d, delay }: { d: string; delay: number }) => (
  <motion.path d={d} stroke="#5aaa18" strokeWidth="0.6" fill="none" strokeLinecap="round"
    initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.75 }}
    transition={{ duration: 0.9, ease: 'easeOut', delay }} />
);

let _rotVinesId = 0;
const RotVines = () => {
  const gradId = React.useRef(`rg-${_rotVinesId++}`).current;
  return (
  <motion.div className="absolute inset-0 pointer-events-none overflow-hidden"
    style={{ borderRadius: 'inherit' }}
    animate={{ opacity: [0.8, 1, 0.8] }}
    exit={{ opacity: 0, transition: { duration: 2, ease: 'easeOut' } }}
    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="68%">
          <stop offset="22%" stopColor="transparent" />
          <stop offset="72%" stopColor="rgba(5,28,0,0.22)" />
          <stop offset="100%" stopColor="rgba(2,14,0,0.58)" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${gradId})`} />

      {/* ── TOP-LEFT ── */}
      {/* main stems hugging edges */}
      <Stem d="M 0,0 C 1,12 -1,24 3,36 C 5,46 2,55 4,65" delay={0} />
      <Stem d="M 0,0 C 12,1 24,-1 36,3 C 46,5 55,2 65,4" delay={0.1} />
      {/* secondary branches */}
      <Stem d="M 3,18 C 10,13 18,17 24,12 C 29,8 28,3 33,5" delay={0.7} width={1.1} />
      <Stem d="M 3,38 C 11,33 20,37 27,32 C 33,28 31,22 37,24" delay={0.9} width={1.0} />
      <Stem d="M 18,3 C 13,10 17,18 12,24 C 8,29 3,28 5,33" delay={0.8} width={1.1} />
      <Stem d="M 38,3 C 33,11 37,20 32,27 C 28,33 22,31 24,37" delay={1.0} width={1.0} />
      {/* leaves — lance/ivy shapes */}
      <Leaf d="M 24,12 C 28,5 36,4 34,11 C 32,17 24,18 24,12 Z" delay={1.9} light />
      <Leaf d="M 33,5 C 39,-1 46,1 42,8 C 39,13 32,12 33,5 Z" delay={2.1} />
      <Leaf d="M 12,24 C 5,28 3,36 10,35 C 16,34 18,26 12,24 Z" delay={2.0} light />
      <Leaf d="M 5,33 C 0,39 2,47 9,45 C 15,43 12,34 5,33 Z" delay={2.2} />
      <Leaf d="M 27,32 C 35,27 42,30 38,37 C 35,42 26,41 27,32 Z" delay={2.3} light />
      <Leaf d="M 37,24 C 44,19 50,22 47,29 C 44,35 36,34 37,24 Z" delay={2.1} />
      {/* tendrils */}
      <Tendril d="M 4,65 C 9,62 12,66 9,70 C 6,74 2,72 4,68 C 5,65 8,65 9,67" delay={2.8} />
      <Tendril d="M 65,4 C 62,9 66,12 70,9 C 74,6 72,2 68,4 C 65,5 65,8 67,9" delay={3.0} />
      <Tendril d="M 33,5 C 36,1 40,3 38,7 C 36,10 32,9 34,6" delay={3.2} />
      <Tendril d="M 5,33 C 1,36 3,40 7,38 C 10,36 9,32 6,34" delay={3.1} />

      {/* ── TOP-RIGHT ── */}
      <Stem d="M 100,0 C 99,12 101,24 97,36 C 95,46 98,55 96,65" delay={0.15} />
      <Stem d="M 100,0 C 88,1 76,-1 64,3 C 54,5 45,2 35,4" delay={0.25} />
      <Stem d="M 97,18 C 90,13 82,17 76,12 C 71,8 72,3 67,5" delay={0.75} width={1.1} />
      <Stem d="M 97,38 C 89,33 80,37 73,32 C 67,28 69,22 63,24" delay={0.95} width={1.0} />
      <Stem d="M 82,3 C 87,10 83,18 88,24 C 92,29 97,28 95,33" delay={0.85} width={1.1} />
      <Leaf d="M 76,12 C 72,5 64,4 66,11 C 68,17 76,18 76,12 Z" delay={1.95} light />
      <Leaf d="M 67,5 C 61,-1 54,1 58,8 C 61,13 68,12 67,5 Z" delay={2.15} />
      <Leaf d="M 88,24 C 95,28 97,36 90,35 C 84,34 82,26 88,24 Z" delay={2.05} light />
      <Leaf d="M 95,33 C 100,39 98,47 91,45 C 85,43 88,34 95,33 Z" delay={2.25} />
      <Leaf d="M 73,32 C 65,27 58,30 62,37 C 65,42 74,41 73,32 Z" delay={2.35} light />
      <Tendril d="M 96,65 C 91,62 88,66 91,70 C 94,74 98,72 96,68 C 95,65 92,65 91,67" delay={2.9} />
      <Tendril d="M 35,4 C 38,0 34,3 32,7 C 30,11 34,13 36,10 C 38,8 36,5 34,6" delay={3.1} />
      <Tendril d="M 95,33 C 99,36 97,40 93,38 C 90,36 91,32 94,34" delay={3.2} />

      {/* ── BOTTOM-LEFT ── */}
      <Stem d="M 0,100 C 1,88 -1,76 3,64 C 5,54 2,45 4,35" delay={0.3} />
      <Stem d="M 0,100 C 12,99 24,101 36,97 C 46,95 55,98 65,96" delay={0.4} />
      <Stem d="M 3,82 C 10,87 18,83 24,88 C 29,92 28,97 33,95" delay={0.85} width={1.1} />
      <Stem d="M 3,62 C 11,67 20,63 27,68 C 33,72 31,78 37,76" delay={1.05} width={1.0} />
      <Stem d="M 18,97 C 13,90 17,82 12,76 C 8,71 3,72 5,67" delay={0.9} width={1.1} />
      <Leaf d="M 24,88 C 28,95 36,96 34,89 C 32,83 24,82 24,88 Z" delay={2.1} light />
      <Leaf d="M 33,95 C 39,101 46,99 42,92 C 39,87 32,88 33,95 Z" delay={2.3} />
      <Leaf d="M 12,76 C 5,72 3,64 10,65 C 16,66 18,74 12,76 Z" delay={2.2} light />
      <Leaf d="M 5,67 C 0,61 2,53 9,55 C 15,57 12,66 5,67 Z" delay={2.4} />
      <Leaf d="M 27,68 C 35,73 42,70 38,63 C 35,58 26,59 27,68 Z" delay={2.5} light />
      <Tendril d="M 4,35 C 9,38 12,34 9,30 C 6,26 2,28 4,32 C 5,35 8,35 9,33" delay={3.0} />
      <Tendril d="M 65,96 C 62,91 66,88 70,91 C 74,94 72,98 68,96 C 65,95 65,92 67,91" delay={3.2} />
      <Tendril d="M 5,67 C 1,64 3,60 7,62 C 10,64 9,68 6,66" delay={3.3} />

      {/* ── BOTTOM-RIGHT ── */}
      <Stem d="M 100,100 C 99,88 101,76 97,64 C 95,54 98,45 96,35" delay={0.45} />
      <Stem d="M 100,100 C 88,99 76,101 64,97 C 54,95 45,98 35,96" delay={0.55} />
      <Stem d="M 97,82 C 90,87 82,83 76,88 C 71,92 72,97 67,95" delay={0.9} width={1.1} />
      <Stem d="M 97,62 C 89,67 80,63 73,68 C 67,72 69,78 63,76" delay={1.1} width={1.0} />
      <Stem d="M 82,97 C 87,90 83,82 88,76 C 92,71 97,72 95,67" delay={0.95} width={1.1} />
      <Leaf d="M 76,88 C 72,95 64,96 66,89 C 68,83 76,82 76,88 Z" delay={2.2} light />
      <Leaf d="M 67,95 C 61,101 54,99 58,92 C 61,87 68,88 67,95 Z" delay={2.4} />
      <Leaf d="M 88,76 C 95,72 97,64 90,65 C 84,66 82,74 88,76 Z" delay={2.3} light />
      <Leaf d="M 95,67 C 100,61 98,53 91,55 C 85,57 88,66 95,67 Z" delay={2.5} />
      <Leaf d="M 73,68 C 65,73 58,70 62,63 C 65,58 74,59 73,68 Z" delay={2.6} light />
      <Tendril d="M 96,35 C 91,38 88,34 91,30 C 94,26 98,28 96,32 C 95,35 92,35 91,33" delay={3.1} />
      <Tendril d="M 35,96 C 38,100 34,97 30,93 C 28,89 32,87 35,91 C 37,94 36,97 34,96" delay={3.3} />
      <Tendril d="M 95,67 C 99,64 97,60 93,62 C 90,64 91,68 94,66" delay={3.4} />
    </svg>
  </motion.div>
  );
};

const PotencyMeter = ({ password }: { password: string }) => {
  const { score, label, color } = getPasswordStrength(password);
  return (
    <div className="mt-4 space-y-2">
      <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
        <span style={{ color }}>{label}</span>
        <span className="text-gray-500">{score * 25}% Potency</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-0.5">
        {[0, 1, 2, 3].map((step) => (
          <div
            key={step}
            className="flex-1 transition-all duration-500"
            style={{ backgroundColor: step <= score - 1 ? color : '#ffffff05' }}
          />
        ))}
      </div>
    </div>
  );
};

type QuestRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
const RARITY: Record<QuestRarity, { color: string; glow: string; label: string }> = {
  Common:    { color: '#9ca3af', glow: 'rgba(156,163,175,0.15)', label: 'Common' },
  Rare:      { color: '#00f2ff', glow: 'rgba(0,242,255,0.15)',   label: 'Rare' },
  Epic:      { color: '#bd00ff', glow: 'rgba(189,0,255,0.15)',   label: 'Epic' },
  Legendary: { color: '#ffb800', glow: 'rgba(255,184,0,0.15)',   label: 'Legendary' },
};

interface QuestDef {
  id: string; title: string; flavor: string;
  rarity: QuestRarity; xp: number; icon: React.ReactNode;
  requires?: string[];
  getProgress: (items: any[]) => { current: number; total: number; complete: boolean };
}

const QUEST_DEFS: QuestDef[] = [
  {
    id: 'first_secret', rarity: 'Common', xp: 25,
    title: 'The First Secret',
    flavor: 'Every legend begins with a single hidden truth. Store your first secret in the vault.',
    icon: <Key size={22} />,
    getProgress: items => ({ current: Math.min(items.length, 1), total: 1, complete: items.length >= 1 }),
  },
  {
    id: 'first_scout', rarity: 'Common', xp: 30,
    title: 'Into the Dark Web',
    flavor: 'The shadows stir. Use the Radar to check a secret against the forces of darkness.',
    icon: <Radar size={22} />,
    getProgress: items => { const n = items.filter((i: any) => i.last_checked).length; return { current: Math.min(n, 1), total: 1, complete: n >= 1 }; },
  },
  {
    id: 'chronicler', rarity: 'Common', xp: 40,
    title: 'The Chronicler',
    flavor: 'Knowledge must be preserved. Inscribe arcane notes upon three of your secrets.',
    icon: <ScrollText size={22} />,
    getProgress: items => { const n = items.filter((i: any) => i.notes).length; return { current: Math.min(n, 3), total: 3, complete: n >= 3 }; },
  },
  {
    id: 'growing_arsenal', rarity: 'Common', xp: 50, requires: ['first_secret'],
    title: 'Growing Arsenal',
    flavor: 'A single blade does not make a warrior. Expand your vault to hold five secrets.',
    icon: <Scroll size={22} />,
    getProgress: items => ({ current: Math.min(items.length, 5), total: 5, complete: items.length >= 5 }),
  },
  {
    id: 'legendary_forger', rarity: 'Rare', xp: 75,
    title: 'Legendary Forger',
    flavor: 'The gods themselves would be impressed. Forge one Legendary-class secret.',
    icon: <Crown size={22} />,
    getProgress: items => { const n = items.filter((i: any) => i.armor_class === 'Legendary').length; return { current: Math.min(n, 1), total: 1, complete: n >= 1 }; },
  },
  {
    id: 'the_collector', rarity: 'Rare', xp: 100, requires: ['growing_arsenal'],
    title: 'The Collector',
    flavor: 'Your vault grows in power. Amass ten secrets worthy of legend.',
    icon: <Star size={22} />,
    getProgress: items => ({ current: Math.min(items.length, 10), total: 10, complete: items.length >= 10 }),
  },
  {
    id: 'vigilant_guardian', rarity: 'Rare', xp: 75, requires: ['first_scout'],
    title: 'Vigilant Guardian',
    flavor: 'Leave no stone unturned. Scout every secret in your vault for dark web exposure.',
    icon: <Shield size={22} />,
    getProgress: items => { if (!items.length) return { current: 0, total: 1, complete: false }; const n = items.filter((i: any) => i.last_checked).length; return { current: n, total: items.length, complete: n === items.length }; },
  },
  {
    id: 'lore_keeper', rarity: 'Rare', xp: 100, requires: ['chronicler'],
    title: 'Lore Keeper',
    flavor: 'Every secret deserves its inscription. Add arcane notes to all of your vault entries.',
    icon: <Wand2 size={22} />,
    getProgress: items => { if (!items.length) return { current: 0, total: 1, complete: false }; const n = items.filter((i: any) => i.notes).length; return { current: n, total: items.length, complete: n === items.length }; },
  },
  {
    id: 'elite_guard', rarity: 'Epic', xp: 150, requires: ['legendary_forger'],
    title: 'Elite Guard',
    flavor: 'Common steel breaks in battle. Forge five secrets of Epic tier or greater.',
    icon: <ShieldAlert size={22} />,
    getProgress: items => { const n = items.filter((i: any) => i.armor_class === 'Epic' || i.armor_class === 'Legendary').length; return { current: Math.min(n, 5), total: 5, complete: n >= 5 }; },
  },
  {
    id: 'clean_slate', rarity: 'Epic', xp: 150, requires: ['vigilant_guardian'],
    title: 'Clean Slate',
    flavor: 'The darkness cannot touch what is unseen. Scan all entries and hold no compromised secrets.',
    icon: <Sparkles size={22} />,
    getProgress: items => { if (!items.length) return { current: 0, total: 1, complete: false }; const ok = items.every((i: any) => i.last_checked) && items.every((i: any) => !i.breach_count || i.breach_count === 0); return { current: ok ? 1 : 0, total: 1, complete: ok }; },
  },
  {
    id: 'fresh_rotation', rarity: 'Epic', xp: 150,
    title: 'Eternal Freshness',
    flavor: 'Stale secrets invite ruin. Ensure every vault entry was forged or rotated within 90 days.',
    icon: <RefreshCw size={22} />,
    getProgress: items => { if (!items.length) return { current: 0, total: 1, complete: false }; const stale = items.filter((i: any) => i.created_at && Math.floor((Date.now() - new Date(i.created_at).getTime()) / 86400000) >= 90).length; return { current: items.length - stale, total: items.length, complete: stale === 0 }; },
  },
  {
    id: 'hoard_of_legends', rarity: 'Legendary', xp: 300, requires: ['the_collector'],
    title: 'Hoard of Legends',
    flavor: 'Dragons are known by the size of their hoard. Amass twenty-five secrets in the vault.',
    icon: <Ghost size={22} />,
    getProgress: items => ({ current: Math.min(items.length, 25), total: 25, complete: items.length >= 25 }),
  },
];

const LEVEL_DATA = [
  { level: 1,  xp: 0,     title: 'Novice Keeper' },
  { level: 2,  xp: 100,   title: 'Apprentice Guard' },
  { level: 3,  xp: 280,   title: 'Vault Sentinel' },
  { level: 4,  xp: 550,   title: 'Rune Forger' },
  { level: 5,  xp: 900,   title: 'Shadow Scout' },
  { level: 6,  xp: 1350,  title: 'Master Keeper' },
  { level: 7,  xp: 1900,  title: 'Dark Archivist' },
  { level: 8,  xp: 2600,  title: 'Vault Warden' },
  { level: 9,  xp: 3400,  title: 'Legendary Guardian' },
  { level: 10, xp: 4400,  title: 'Vault Lord' },
  { level: 11, xp: 5600,  title: 'Arcane Keeper' },
  { level: 12, xp: 7000,  title: 'Cipher Lord' },
  { level: 13, xp: 8700,  title: 'Shadow Sovereign' },
  { level: 14, xp: 10700, title: 'Eternal Warden' },
  { level: 15, xp: 13000, title: 'Grand Vault Master' },
];
const getHeroLevel = (xp: number) => [...LEVEL_DATA].reverse().find(l => xp >= l.xp) || LEVEL_DATA[0];
const getNextHeroLevel = (xp: number) => LEVEL_DATA.find(l => xp < l.xp) || null;

interface LevelReward { icon: string; name: string; desc: string; type: 'badge' | 'aura' | 'xp_daily' | 'xp_training' | 'xp_quest'; value?: number; }
const LEVEL_REWARDS: Record<number, LevelReward> = {
  2:  { icon: '🛡️', name: 'Novice Badge',          type: 'badge',       desc: 'Your first hero badge — forged at the start of your journey.' },
  3:  { icon: '⚡', name: 'Daily Boost +5 XP',      type: 'xp_daily',    value: 5,  desc: 'All daily quests permanently award +5 bonus XP.' },
  4:  { icon: '🔮', name: 'Rune Aura',              type: 'aura',        desc: 'A glowing purple arcane aura radiates from your Hero Card.' },
  5:  { icon: '🌑', name: 'Shadow Sigil',           type: 'badge',       desc: 'The sigil of the Shadow Scout is etched onto your hero profile.' },
  6:  { icon: '🎯', name: 'Training Boost +10 XP',  type: 'xp_training', value: 10, desc: 'All training ground games permanently award +10 bonus XP.' },
  7:  { icon: '📜', name: "Archivist's Seal",       type: 'badge',       desc: 'A golden seal of mastery — earned by the most dedicated archivists.' },
  8:  { icon: '✨', name: 'Legendary Aura',         type: 'aura',        desc: 'Your Hero Card pulses with golden legendary light.' },
  9:  { icon: '💎', name: 'Quest Boost +20 XP',     type: 'xp_quest',    value: 20, desc: 'All quest completions permanently award +20 bonus XP.' },
  10: { icon: '👑', name: 'Vault Lord Crown',        type: 'badge',       desc: 'The Crown of the Vault Lord — only the finest guardians wear this.' },
  11: { icon: '🌀', name: 'Daily Boost +10 XP',     type: 'xp_daily',    value: 10, desc: 'Daily quests award an extra +10 XP, stacking with level 3 bonus.' },
  12: { icon: '🔱', name: 'Arcane Crown',           type: 'badge',       desc: 'The Arcane Crown marks you among the rarest keepers of the realm.' },
  13: { icon: '⚔️', name: 'Training Boost +15 XP', type: 'xp_training', value: 15, desc: 'Training games award an extra +15 XP, stacking with level 6 bonus.' },
  14: { icon: '🏆', name: 'Eternal Seal',           type: 'badge',       desc: 'The Eternal Seal — only the most devoted guardians earn this mark.' },
  15: { icon: '🌟', name: 'Grand Master Aura',      type: 'aura',        desc: 'The ultimate aura of the Grand Vault Master. Legendary beyond all measure.' },
};

const ADMIN_BADGE: LevelReward = { icon: '⚜️', name: 'Grand Overseer', type: 'badge', desc: 'Reserved for the architect of the realm. Only one exists.' };

const getTodayStr = () => new Date().toISOString().slice(0, 10);

interface DailyDef { id: string; title: string; desc: string; xp: number; icon: React.ReactNode; }
const DAILY_POOL: DailyDef[] = [
  { id: 'daily_brew',  title: 'Daily Brew',      desc: 'Generate a password in the Alchemist Lab.',  xp: 15, icon: <FlaskConical size={18} /> },
  { id: 'daily_scout', title: 'Dark Web Patrol',  desc: 'Check any secret for breach exposure.',       xp: 15, icon: <Radar size={18} /> },
  { id: 'daily_vault', title: 'Vault Visit',      desc: 'Open the Secret Vault today.',               xp: 10, icon: <Scroll size={18} /> },
  { id: 'daily_copy',  title: 'Quick Retrieval',  desc: 'Copy a secret from your vault.',             xp: 10, icon: <Copy size={18} /> },
  { id: 'daily_note',  title: 'Arcane Scribe',    desc: 'Save an entry that has arcane notes.',       xp: 20, icon: <ScrollText size={18} /> },
];
const getDailyQuests = (): DailyDef[] => {
  const seed = getTodayStr().replace(/-/g, '').split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 1);
  return [...DAILY_POOL].sort((a, b) => ((seed * a.id.charCodeAt(2)) % 97) - ((seed * b.id.charCodeAt(2)) % 97)).slice(0, 3);
};

interface QuizQ { q: string; options: string[]; answer: number; }
const QUIZ_QUESTIONS: QuizQ[] = [
  { q: 'What is the minimum recommended password length for a secure account?', options: ['6 characters', '8 characters', '12 characters', '20 characters'], answer: 2 },
  { q: 'Which of these is the strongest password?', options: ['Password123', 'p@ssw0rd', 'X#9mK$vL2!qN', 'ilovemydog'], answer: 2 },
  { q: "What is a 'credential stuffing' attack?", options: ['Guessing passwords randomly', 'Using leaked logins from one breach to attack other services', 'Phishing for credentials', 'Installing a keylogger'], answer: 1 },
  { q: 'What does 2FA stand for?', options: ['Two-Factor Authentication', 'Two-Form Authorization', 'Twice-Fail Attempt', 'Two-File Access'], answer: 0 },
  { q: 'Which hashing algorithm should NOT be used for passwords?', options: ['bcrypt', 'SHA-1', 'Argon2', 'scrypt'], answer: 1 },
  { q: 'What is the main advantage of a passphrase over a random password?', options: ['Shorter to type', 'Easier to remember and still hard to brute-force', 'Always more secure regardless of length', 'Immune to dictionary attacks'], answer: 1 },
  { q: 'What is k-anonymity in the context of breach checking?', options: ["Anonymising victims' names", 'Sending only a partial hash so your real password never leaves your device', 'Hiding the breach database', 'Using multiple identities online'], answer: 1 },
  { q: 'How often should critical passwords be rotated?', options: ['Never, if they are strong', 'Every 5 years', 'Every 90 days or after any suspected breach', 'Only when forgotten'], answer: 2 },
  { q: "What does 'AES-256' mean in vault encryption?", options: ['256-bit Advanced Encryption Standard — military grade', 'A 256-character password requirement', '256 layers of hash', 'A 256-byte file size limit'], answer: 0 },
  { q: 'Which is safest for storing passwords?', options: ['Sticky note on your monitor', "Your browser's autofill", 'Reusing one strong password', 'A dedicated password manager with encryption'], answer: 3 },
  { q: "What is a 'rainbow table' attack?", options: ['A colourful phishing email', 'A precomputed hash-to-password mapping used to crack hashes', 'A multi-step brute-force attack', 'An attack on Wi-Fi routers'], answer: 1 },
  { q: "What makes 'correct-horse-battery-staple' a strong passphrase?", options: ['It contains special characters', 'Its length — entropy from combining random common words', "It's famous so hackers won't guess it", 'It contains numbers'], answer: 1 },
  { q: "What is 'salt' in password hashing?", options: ['A random value added before hashing to prevent rainbow table attacks', 'An encryption key derived from the password', 'The number of hash iterations', 'A pepper stored separately'], answer: 0 },
  { q: 'What makes credential-stuffing attacks most effective?', options: ['Brute force speed', 'Password reuse across multiple services', 'Weak hashing algorithms', 'Social engineering'], answer: 1 },
  { q: 'What does HIBP (Have I Been Pwned) check against?', options: ['Live hacking attempts', 'Compiled databases of leaked credentials from past breaches', 'Your current open sessions', 'DNS records'], answer: 1 },
];

// ── QUIZ CATEGORIES ──────────────────────────────────────────────
interface QuizCategory { id: string; name: string; color: string; questions: QuizQ[]; }
const QUIZ_CATEGORIES: QuizCategory[] = [
  { id: 'sage', name: "Sage's Test", color: '#00f2ff', questions: QUIZ_QUESTIONS },
  { id: 'breach', name: 'Breach Chronicles', color: '#ff003c', questions: [
    { q: "What is a 'credential stuffing' attack?", options: ['Guessing passwords randomly', 'Using leaked logins from one breach to attack other services', 'Installing a keylogger', 'Sending fake login pages'], answer: 1 },
    { q: 'What does HIBP aggregate to check your password?', options: ['Live hacking attempts', 'Compiled databases of leaked credentials from past breaches', 'Open browser sessions', 'DNS records'], answer: 1 },
    { q: 'What made the RockYou breach historically significant?', options: ['It was the first ever breach', 'Passwords were stored in plain text and still fuel attacks today', 'It exposed government data', 'It took down major websites'], answer: 1 },
    { q: "What is a 'combolist'?", options: ['A password strength checklist', 'A merged file of email:password pairs from multiple breaches', 'A list of common usernames', 'A firewall rule set'], answer: 1 },
    { q: "What is 'password spraying'?", options: ['Testing many passwords on one account', 'Trying one common password across many accounts to avoid lockouts', 'Spraying random chars into a login form', 'Flooding a login page with traffic'], answer: 1 },
    { q: 'Which single habit reduces breach damage most?', options: ['Using a very long master password', 'Unique password per service + 2FA on each', 'Changing passwords every month', 'Only using biometrics'], answer: 1 },
    { q: 'A breach count of 0 on HIBP means what?', options: ['Your password has never appeared in any known breach', 'Your password is unguessable', "HIBP hasn't scanned it yet", 'The service is completely safe'], answer: 0 },
    { q: "What is a 'silent breach'?", options: ['A breach that never happened', 'Data stolen without the victim or company knowing', 'A breach affecting fewer than 100 accounts', 'An encrypted breach'], answer: 1 },
    { q: 'What password is most commonly found in breach dumps?', options: ['password1', 'qwerty', '123456', 'abc123'], answer: 2 },
    { q: 'Why is email an especially high-value breach target?', options: ["It's easy to hack", 'Email is used to reset passwords for other services', 'Hackers only want email for spam', 'Most inboxes contain saved passwords'], answer: 1 },
  ]},
  { id: 'crypto', name: 'Crypto Vault', color: '#bd00ff', questions: [
    { q: 'AES-256 uses an encryption key of how many bits?', options: ['128', '192', '256', '512'], answer: 2 },
    { q: "What is the purpose of a 'salt' in password hashing?", options: ['Speed up hashing', 'A random value added before hashing to prevent rainbow table attacks', 'Encrypt the password', 'Compress the hash output'], answer: 1 },
    { q: 'Which of these is specifically designed for password hashing?', options: ['MD5', 'SHA-256', 'bcrypt', 'AES'], answer: 2 },
    { q: "What does 'zero-knowledge' mean in a password vault?", options: ['The app has no security features', 'Even the service provider cannot read your stored passwords', 'Passwords are stored without encryption', 'The vault starts empty'], answer: 1 },
    { q: "What is 'key stretching'?", options: ['Making the encryption key longer', 'Making hashing intentionally slow to resist brute force', 'Stretching a password across multiple files', 'Encrypting the key with another key'], answer: 1 },
    { q: 'Why is MD5 not suitable for password storage?', options: ["It's too computationally complex", "It's too fast — billions of hashes/second are trivially possible", "It doesn't produce fixed-length output", 'It requires a unique salt'], answer: 1 },
    { q: 'What does Argon2 provide that bcrypt does not?', options: ['Faster hashing throughput', 'Memory-hardness, making GPU/ASIC attacks very expensive', 'Support for longer passwords', 'Zero-knowledge proofs'], answer: 1 },
    { q: "What is a 'hash collision'?", options: ['Two passwords that look identical', 'Two different inputs that produce the same hash output', 'When encryption fails partway', 'A brute-force hit'], answer: 1 },
    { q: 'In end-to-end encryption, who can read the data?', options: ['The server only', 'Only the sender and recipient — not the service provider', 'Anyone with the correct URL', 'The cloud hosting provider'], answer: 1 },
    { q: 'What does PBKDF2 stand for?', options: ['Password-Based Key Derivation Function 2', 'Public-Byte Key Distribution Format 2', 'Protected Binary Key Data File 2', 'Password Block Key Derivation Flow 2'], answer: 0 },
  ]},
  { id: 'rogue', name: "Rogue's Gallery", color: '#ffb800', questions: [
    { q: 'What is a phishing attack?', options: ['Guessing passwords by brute force', 'Using fake emails or sites designed to steal credentials', 'Installing malware via a USB drive', 'Exploiting server vulnerabilities directly'], answer: 1 },
    { q: 'What does a keylogger do?', options: ['Manages your login sessions', 'Secretly records every keystroke you type', 'Scans for network vulnerabilities', 'Monitors your screen'], answer: 1 },
    { q: 'What is typosquatting?', options: ['Hiding text inside images', 'Registering look-alike domains to catch people who mistype URLs', 'A CSS injection attack on login forms', 'Spoofing email sender addresses'], answer: 1 },
    { q: "What does 'smishing' mean?", options: ['Social media phishing', 'Email phishing with fake attachments', 'SMS text message phishing', 'Voice call phishing'], answer: 2 },
    { q: "Which attack does a strong unique password NOT protect against?", options: ['Brute-force guessing', 'Credential stuffing', 'Phishing — you hand the password over yourself', 'Rainbow table cracking'], answer: 2 },
    { q: 'What is social engineering in cybersecurity?', options: ['Building secure social networks', 'Manipulating people psychologically rather than attacking systems', 'Automating phishing at large scale', 'Engineering secure apps for social platforms'], answer: 1 },
    { q: 'What is a man-in-the-middle (MITM) attack?', options: ['Hacking the server directly', 'An attacker secretly intercepting communication between two parties', 'A large-scale DDoS attack', 'Installing a keylogger on a device'], answer: 1 },
    { q: "What is 'vishing'?", options: ['Video-call phishing via webcam', 'Voice phishing using phone calls to deceive victims', 'Virus-based phishing attacks', 'Virtual reality identity theft'], answer: 1 },
    { q: 'What is a dictionary attack?', options: ['Physically breaking into a server room', 'Trying every possible character combination', 'Using a list of common words and passwords to crack hashes', 'Exploiting a known software vulnerability'], answer: 2 },
    { q: 'What makes a phishing email most effective?', options: ['Running quickly before victims can respond', 'A spoofed sender, urgency cues, and a realistic-looking page', 'Using complicated technical language', 'Targeting servers instead of people'], answer: 1 },
  ]},
];

// ── MINI-GAME DATA ───────────────────────────────────────────────
type DuelPair = { a: string; b: string; stronger: 'a' | 'b'; hint: string };
const DUEL_PAIRS: DuelPair[] = [
  { a: 'P@ssw0rd',               b: 'correct-horse-battery-57',      stronger: 'b', hint: 'Long passphrases beat substitution tricks — entropy wins.' },
  { a: '123456789',              b: 'r8!Kz#mQ2v',                    stronger: 'b', hint: 'Random chars beat sequential numbers every time.' },
  { a: 'Summer2024!',            b: 'Xq9$mK2#vP',                    stronger: 'b', hint: 'Season + year is a top predictable pattern.' },
  { a: 'Tr0ub4dor&3',            b: 'correct-horse-battery-staple',   stronger: 'b', hint: '4 random words beat leet substitution (~44 bits of entropy).' },
  { a: 'Admin@123',              b: 'W#9kLm2!vB4',                   stronger: 'b', hint: '"Admin" plus digits is on every default credential list.' },
  { a: 'qwerty123',              b: 'MyDog$Raced99Fast',              stronger: 'b', hint: 'Keyboard walks are cracked in milliseconds.' },
  { a: 'p4$$w0rd!!',             b: 'xK9#mP2!vL5@nQ8',               stronger: 'b', hint: 'True randomness crushes predictable substitution.' },
  { a: 'vault-night-storm-blade-42', b: 'NightStorm!',               stronger: 'a', hint: '5-word passphrase has far more entropy than a short complex word.' },
  { a: 'xL9#mK7$vP2@nQ5!',      b: 'P@ssw0rd2024!',                 stronger: 'a', hint: 'True random 16-char beats a predictable base word + year.' },
  { a: 'N3verGuessMe!',          b: 'forge-dawn-blade-tide-77',      stronger: 'b', hint: '"Never guess" phrases are already in wordlists — random wins.' },
  { a: 'BatteryStaple!2024',     b: 'crimson-vault-drift-oracle-11', stronger: 'b', hint: 'Random word selection beats the famous passphrase example.' },
  { a: 'abc123!@#ABC',           b: 'Z7#qR!mK9$xL4@vN',             stronger: 'b', hint: 'Keyboard patterns plus digits are trivially attacked.' },
];

type SpeedRating = 'Trash' | 'Weak' | 'Decent' | 'Strong';
type SpeedItem = { pwd: string; rating: SpeedRating; hint: string };
const SPEED_PASSWORDS: SpeedItem[] = [
  { pwd: 'password',             rating: 'Trash',  hint: '#1 most breached password — found billions of times.' },
  { pwd: '123456',               rating: 'Trash',  hint: "Top of every attacker's list. Cracked in under 1ms." },
  { pwd: 'iloveyou',            rating: 'Trash',  hint: 'Dictionary word — cracked instantly by any hash cracker.' },
  { pwd: 'qwerty123',           rating: 'Trash',  hint: 'Keyboard walk + digits = predictable and trivially cracked.' },
  { pwd: 'P@ss1234',            rating: 'Weak',   hint: 'Predictable leet substitution with common numeric suffix.' },
  { pwd: 'Summer2024!',         rating: 'Weak',   hint: 'Season + year is a known attacker pattern.' },
  { pwd: 'Admin@123',           rating: 'Weak',   hint: "Extremely common — default credential lists include this." },
  { pwd: 'MyDog$Ran99',         rating: 'Decent', hint: 'Good length and mix — but name + verb combos are guessable.' },
  { pwd: 'BatteryStaple!24',    rating: 'Decent', hint: 'Famous passphrase derivative — predictable source.' },
  { pwd: 'Kx9!m#2vLpQ',         rating: 'Decent', hint: 'Short random — solid, but 4 more chars would make it Strong.' },
  { pwd: 'xK9#mP2!vL5@nQ8',     rating: 'Strong', hint: '16 chars, fully random, all character classes. Excellent.' },
  { pwd: 'forge-night-bloom-77-rune', rating: 'Strong', hint: '5-word passphrase with number — extremely high entropy.' },
  { pwd: 'Z7#qR!mK9$xL4@vN2',   rating: 'Strong', hint: '17 chars, truly random — near maximum practical entropy.' },
  { pwd: 'N8!pL3@kR5#mV9$wQ',   rating: 'Strong', hint: '17 random chars across all character classes — excellent.' },
];

const MEMORY_SERVICES = [
  'GitHub', 'Google', 'Netflix', 'Steam', 'Discord', 'Twitter/X',
  'LinkedIn', 'Spotify', 'Amazon', 'PayPal', 'Dropbox', 'Slack',
  'Reddit', 'Twitch', 'Apple ID', 'Microsoft',
];

// ── CIPHER UTILS ─────────────────────────────────────────────────
const rot13 = (s: string) => s.replace(/[a-zA-Z]/g, c => { const b = c <= 'Z' ? 65 : 97; return String.fromCharCode((c.charCodeAt(0) - b + 13) % 26 + b); });
const caesar3 = (s: string) => s.replace(/[a-zA-Z]/g, c => { const b = c <= 'Z' ? 65 : 97; return String.fromCharCode((c.charCodeAt(0) - b + 3) % 26 + b); });
const reverseStr = (s: string) => s.split('').reverse().join('');

// ── PATTERN PANIC DATA ───────────────────────────────────────────
// ── PHISH OR LEGIT DATA ──────────────────────────────────────────
interface PhishItem { text: string; kind: 'url' | 'email' | 'scenario'; isPhish: boolean; label: string; why: string; }
const PHISH_POOL: PhishItem[] = [
  { text: 'secure-paypal-login.com', kind: 'url', isPhish: true, label: 'URL', why: "PayPal's real domain is paypal.com. \"secure-paypal-login\" is a lookalike domain — the real root is different." },
  { text: 'paypal.com/signin', kind: 'url', isPhish: false, label: 'URL', why: 'Legitimate. The root domain is paypal.com — the /signin is just a path, not a different site.' },
  { text: 'accounts.google.com', kind: 'url', isPhish: false, label: 'URL', why: 'Legitimate. accounts.google.com is Google\'s real authentication subdomain.' },
  { text: 'google-accounts.verify-login.com', kind: 'url', isPhish: true, label: 'URL', why: 'The root domain here is verify-login.com — not google.com. Classic subdomain-as-brand trick.' },
  { text: 'support@paypa1.com', kind: 'email', isPhish: true, label: 'Email', why: '"paypa1.com" replaces the letter L with the digit 1. This is a typosquat — not PayPal.' },
  { text: 'noreply@amazon.com', kind: 'email', isPhish: false, label: 'Email', why: 'Legitimate. amazon.com is the real sender domain. Standard automated email format.' },
  { text: 'apple-id-verify.net', kind: 'url', isPhish: true, label: 'URL', why: 'Apple IDs are managed on apple.com or appleid.apple.com — never a .net domain.' },
  { text: 'appleid.apple.com', kind: 'url', isPhish: false, label: 'URL', why: 'Legitimate. apple.com is the root domain, appleid is a proper Apple subdomain.' },
  { text: 'billing@netflix-payment.com', kind: 'email', isPhish: true, label: 'Email', why: 'Netflix emails only come from @netflix.com. Any other domain is an impersonation.' },
  { text: 'info@netflixs.net', kind: 'email', isPhish: true, label: 'Email', why: '"netflixs.net" adds a silent "s" — a typosquat. The .net TLD is also a red flag.' },
  { text: 'Bank SMS: "Your account is locked. Verify now: bit.ly/secure99"', kind: 'scenario', isPhish: true, label: 'Scenario', why: 'Banks never send short links to verify accounts. Short URLs hide the real destination.' },
  { text: 'Password manager asks for master password after 30 days of inactivity', kind: 'scenario', isPhish: false, label: 'Scenario', why: 'Legitimate. Session expiration is a standard security feature of password managers.' },
  { text: 'microsofft.com/update', kind: 'url', isPhish: true, label: 'URL', why: '"microsofft" doubles the F. Typosquatted domains are registered specifically to catch mistypers.' },
  { text: 'login.microsoftonline.com', kind: 'url', isPhish: false, label: 'URL', why: 'Legitimate. microsoftonline.com is Microsoft\'s real enterprise identity platform domain.' },
];

// ── CRACK TIMER DATA ─────────────────────────────────────────────
type CrackTier = 'instant' | 'minutes' | 'years' | 'forever';
interface CrackItem { pwd: string; tier: CrackTier; label: string; why: string; }
const CRACK_POOL: CrackItem[] = [
  { pwd: '123456',                      tier: 'instant', label: 'Instantly',    why: '#1 most common password globally. In every wordlist. Cracks in microseconds.' },
  { pwd: 'password',                    tier: 'instant', label: 'Instantly',    why: '"password" is tried before any real search begins. Not a password, it\'s a welcome mat.' },
  { pwd: 'letmein',                     tier: 'instant', label: 'Instantly',    why: 'Top-50 all-time. Dictionary attacks hit this in the first second.' },
  { pwd: 'Summer2024!',                 tier: 'minutes', label: 'Minutes',      why: 'Word + year + symbol is a known pattern. Rule-based attacks crack this in under 10 minutes.' },
  { pwd: 'P@ssw0rd1',                   tier: 'minutes', label: 'Minutes',      why: 'Leet-speak on "Password" is in every ruleset. The @ and 0 substitutions are standard targets.' },
  { pwd: 'qwerty123!@#',                tier: 'minutes', label: 'Minutes',      why: 'Keyboard walk + numbers is a pattern. Rule-based tools crack this fast.' },
  { pwd: 'mK9#vR2!',                    tier: 'years',   label: 'Years',        why: '8 truly random chars from full charset ≈ 6 quadrillion combos. Crackable with years of GPU time.' },
  { pwd: 'Tr0ub4dor&3',                 tier: 'years',   label: 'Years',        why: 'The famous XKCD "bad" example — looks complex but predictable structure makes it weaker than it seems.' },
  { pwd: 'forge-silent-vault-moon-42',  tier: 'forever', label: 'Centuries+',   why: '5 random words ≈ 60 bits of entropy. A trillion guesses/sec would take millions of years.' },
  { pwd: 'mK9#vR2!pL4$xN7@wQ1%',       tier: 'forever', label: 'Centuries+',   why: '20 random chars full charset. More combos than atoms in the observable universe.' },
  { pwd: 'correct-horse-battery-staple', tier: 'forever', label: 'Centuries+', why: 'The XKCD passphrase. 4 random words ≈ 44 bits — vastly stronger than most passwords.' },
  { pwd: 'dragon',                      tier: 'instant', label: 'Instantly',    why: 'Top-10 all-time password. Single dictionary word. Cracks before you blink.' },
];

// ── PASSWORD FORGE DATA ──────────────────────────────────────────
const FORGE_BASES = ['cat', 'dog', 'sun', 'fire', 'moon', 'star'];
interface ForgeUpgrade { id: string; label: string; icon: string; desc: string; apply: (p: string) => string; }
const FORGE_UPGRADES: ForgeUpgrade[] = [
  { id: 'longer',  label: 'Make Longer',  icon: '📏', desc: 'Append 6 random chars (+length +upper +digits)', apply: p => p + 'xK9mP2' },
  { id: 'symbols', label: 'Add Symbols',  icon: '⚡', desc: 'Inject !@# into the middle', apply: p => p.slice(0, Math.ceil(p.length/2)) + '!@#' + p.slice(Math.ceil(p.length/2)) },
  { id: 'digits',  label: 'Add Digits',   icon: '🔢', desc: 'Append numbers to the end', apply: p => p + '42' },
  { id: 'caps',    label: 'Capitalize',   icon: '🔠', desc: 'Uppercase every 3rd letter', apply: p => [...p].map((c,i)=>i%3===0&&/[a-z]/.test(c)?c.toUpperCase():c).join('') },
  { id: 'word',    label: 'Add Word',     icon: '🗡️', desc: 'Append a rune word for length', apply: p => p + 'forge' },
  { id: 'word2',   label: 'Add More',     icon: '📜', desc: 'Append another rune word', apply: p => p + 'blade' },
];

// ── ARCANE CODEX DATA ────────────────────────────────────────────
interface CodexCheck { question: string; options: string[]; answer: number; }
interface CodexSlide { title: string; icon: React.ReactNode; body: string; bullets: string[]; tip: string; check?: CodexCheck[]; }
interface CodexChapter { id: string; name: string; color: string; tagline: string; slides: CodexSlide[]; }

const CODEX_CHAPTERS: CodexChapter[] = [
  { id: 'vault', name: 'The Secret Vault', color: '#00f2ff', tagline: 'How your passwords are stored & protected',
    slides: [
      { title: 'What is a Vault Entry?', icon: <Key size={36} />,
        body: 'Every service you use gets its own vault entry — a secured slot that holds the service name, an encrypted password, and optional notes. Nothing is stored in plain text.',
        bullets: ['Service name + encrypted password per entry', 'AES-256 encryption — the server cannot read your passwords', 'Armor Class shows the strength grade of each entry', 'Optional notes field for 2FA codes, hints, or linked emails'],
        tip: 'Treat your vault like a physical safe. Every account deserves its own unique secret.' },
      { title: 'Armor Classes Explained', icon: <Shield size={36} />,
        body: 'Each vault entry is graded on a four-tier rarity system that reflects the strength of the stored password.',
        bullets: ['Common — short or simple passwords (letters + digits only)', 'Rare — strong random passwords with symbols included', 'Epic — high-complexity, full-charset random passwords', 'Legendary — passphrase-class or extremely long secrets'],
        tip: 'Aim for Epic or Legendary on your most critical accounts: email, banking, and cloud storage.' },
      { title: 'Password Rotation & Rot Vines', icon: <RefreshCw size={36} />,
        body: 'Vault entries older than 90 days grow an animated Rot Vine overlay — a visual warning that the secret may be stale and due for a change.',
        bullets: ['Entries expire visually after 90 days without rotation', 'Rotating = editing and saving a new password resets the timer', 'NIST recommends rotating passwords after suspected breaches', 'Old passwords in breach databases still work until rotated'],
        tip: 'After any suspected breach, rotate that password immediately — do not wait for the vines to appear.' },
      { title: 'Arcane Inscriptions (Notes)', icon: <ScrollText size={36} />,
        body: 'The notes field lets you attach encrypted supplementary info to any vault entry. Think of it as a secure sticky note tied to that secret.',
        bullets: ['Store 2FA backup codes alongside the password', 'Note which email address or username the account uses', 'Save security question answers in encrypted form', 'Notes are encrypted with the same AES-256 as your password'],
        tip: 'Never store your 2FA backup codes on the same device as your authenticator app.' },
      { title: 'Vault Knowledge Check', icon: <Check size={36} />,
        body: 'Four slides in — time to see what stuck. Pick the best answer for each question.',
        bullets: [],
        tip: 'Getting one wrong is fine. The goal is to engage your memory, not test for a grade.',
        check: [
          { question: 'What encryption does Vault-Quest use to protect stored passwords?', options: ['SHA-256 hashing', 'Base64 encoding', 'AES-256 encryption', 'RSA public-key encryption'], answer: 2 },
          { question: 'What triggers the Rot Vine visual effect on a vault entry?', options: ['A breach count greater than 0', 'The password not being rotated for over 90 days', 'The armor class being set to Common', 'The entry having no notes attached'], answer: 1 },
        ] },
      { title: 'Choosing the Right Armor Class', icon: <Star size={36} />,
        body: 'Not every account needs Legendary-tier protection, but knowing where to invest effort matters. Categorizing by risk level helps you prioritize.',
        bullets: ['High-risk: email, banking, cloud storage — aim for Epic or Legendary', 'Medium-risk: social media, shopping, streaming — Rare is the floor', 'Low-risk: throwaway forums — even Common beats reusing passwords', 'Your email is the master key: reset links give full account access'],
        tip: 'If one account compromise could unlock dozens of others via password reset, that account needs Legendary treatment.' },
      { title: 'The Breach Radar Scanner', icon: <Radar size={36} />,
        body: 'Every vault entry has a Radar button that checks whether that exact password appears in known breach databases, using the HIBP k-anonymity API.',
        bullets: ['Breach count > 0 means the password is in real attack databases right now', 'Count 0 means not in known leaks — not that it cannot be guessed', 'Red breach banners appear automatically after the daily background scan', 'The background scanner runs every 24 hours after server start'],
        tip: 'Run manual Radar checks immediately after major public breach announcements — do not wait for the daily scan.' },
      { title: 'Search, Filter & Sort', icon: <Search size={36} />,
        body: 'The vault filter panel lets you slice through large collections to find what you need — or surface the entries that most need your attention.',
        bullets: ['Live search by service name — no need to press enter', 'Filter by Armor Class: Common, Rare, Epic, or Legendary', '"Breached" filter shows all entries with a breach count above 0', '"Stale" filter shows entries not rotated in over 90 days'],
        tip: 'Use the "Stale" filter monthly as a rotation reminder — everything it shows is overdue for a fresh password.' },
      { title: 'Clipboard Safety', icon: <Copy size={36} />,
        body: 'Copying a password to your clipboard is convenient but briefly exposes it — other apps and browser extensions can read clipboard contents without prompting.',
        bullets: ['Copy only when you are about to paste immediately', 'Clear the clipboard after use by copying a blank character', 'Avoid copying passwords during a screen-share or remote desktop session', 'On mobile, clipboard persists across apps until it is overwritten'],
        tip: 'After pasting, immediately copy something harmless — your name, a space — to clear the password from the clipboard.' },
      { title: 'Vault Security: The Full Picture', icon: <Crown size={36} />,
        body: 'Mastering the vault means combining strong password generation, regular breach checks, prompt rotation, and clipboard hygiene into a consistent routine.',
        bullets: ['Every service gets a unique, generated password — no reuse ever', 'Run breach checks any time a service announces a data incident', 'Rotate when Rot Vines appear or a breach count goes above zero', 'Use notes for supplementary info — never export or screenshot vault contents'],
        tip: 'Security is not a one-time setup — it is a habit of regular auditing, rotation, and vigilance.' },
    ]},
  { id: 'lab', name: 'The Alchemist Lab', color: '#bd00ff', tagline: 'Brewing unbreakable passwords from scratch',
    slides: [
      { title: 'How Random Passwords Work', icon: <Sparkles size={36} />,
        body: "Potion mode uses your browser's cryptographically secure random number generator — the same one used in cryptographic libraries — to pick each character independently.",
        bullets: ['Cryptographically secure: no pattern, no predictability', 'Each character is chosen from the entire charset independently', 'A 16-char password has ~10²⁸ possible combinations', 'No AI or attacker can predict the output without brute force'],
        tip: 'Length is the biggest factor. Go to 20+ characters for maximum protection on critical accounts.' },
      { title: 'Passphrases: The Secret Weapon', icon: <Scroll size={36} />,
        body: 'Rune Scrolls generate passphrases — multiple random dictionary words joined by a separator. They are surprisingly strong and far easier to remember than random character strings.',
        bullets: ['"forge-night-bloom-77" is as strong as most random passwords', 'Each extra word multiplies entropy by the dictionary size', '4 random words ≈ 44 bits of entropy (harder than most 10-char passwords)', 'Easier to type on mobile or remember for master passwords'],
        tip: 'Use passphrases for accounts you type manually. Use random passwords for everything you copy-paste.' },
      { title: 'Understanding Complexity Levels', icon: <Zap size={36} />,
        body: 'Complexity controls which characters can appear in your generated password. More types of characters = a bigger pool = more possible passwords per character.',
        bullets: ['Level 1: Letters + digits only (62 possible chars per position)', 'Level 2: + common symbols !@#$%^&* (70 chars per position)', 'Level 3: Full character set including all punctuation (95 chars per position)', 'Each extra character type dramatically expands the search space'],
        tip: 'Complexity without length is still weak. A 6-char complex password cracks in under a second.' },
      { title: 'Reading the Potency Meter', icon: <Activity size={36} />,
        body: 'The Potency Meter scores any password against five criteria and gives a strength label from "Weak Potion" to "Legendary Potency".',
        bullets: ['Length > 8 characters: +1 point', 'Length > 12 characters: +1 point', 'Contains uppercase letters: +1 point', 'Contains digits AND special characters: +1 point each'],
        tip: 'A score of "Legendary Potency" on a predictable word like "Summer2024!!" is misleading — use the generator.' },
      { title: 'Lab Knowledge Check', icon: <Check size={36} />,
        body: "You've learned how passwords are generated and scored. Let's see what stuck.",
        bullets: [],
        tip: "Remember: a password can score Legendary on the meter but still be guessable if it follows a predictable pattern.",
        check: [
          { question: 'Which typically produces more entropy for the same memorability?', options: ['A 10-char random password with full charset', 'A 4-word random passphrase from a large word list', 'A name + birth year combination like "Alex1998"', 'A 6-char password with symbols'], answer: 1 },
          { question: 'What does the Potency Meter actually measure?', options: ['Time-to-crack on modern hardware in seconds', 'A score based on length, uppercase, digits, and symbol criteria', 'Whether the password appears in breach databases', 'Cryptographic entropy in bits'], answer: 1 },
        ] },
      { title: 'Entropy: The Real Measure of Strength', icon: <Wand2 size={36} />,
        body: 'Entropy, measured in bits, represents the number of guesses an attacker needs to crack a password. Higher entropy = exponentially more work for the attacker.',
        bullets: ['1 bit of entropy doubles the search space', '10 bits = 1,024 guesses; 40 bits = over 1 trillion guesses', 'A random lowercase letter contributes ~4.7 bits per character', 'Predictable patterns — dates, names, leet-speak — slash entropy drastically'],
        tip: 'True randomness is the only reliable path to high entropy. Human-chosen passwords always carry hidden patterns.' },
      { title: 'Why Length Beats Complexity', icon: <FlaskConical size={36} />,
        body: 'Adding a character multiplies possibilities by the charset size. Each extra position is far more powerful than switching charsets at the same length.',
        bullets: ['8 chars × 95-char set = ~6.6 quadrillion combinations', '20 chars × 62-char set = ~7 × 10³⁵ combinations — incomprehensibly larger', 'Going from 12 to 16 chars gains more than switching Level 1 to Level 3', 'Cracking tools exhaust short passwords first — length raises the floor'],
        tip: 'When in doubt, make it longer. A 20-character lowercase-only password vastly outranks an 8-character complex one.' },
      { title: 'Password Managers as Memory Replacements', icon: <Beaker size={36} />,
        body: 'The root cause of weak passwords is human memory limits. Password managers eliminate the need to remember passwords at all, making unique complexity essentially free.',
        bullets: ['One strong master password protects everything else', 'Generated passwords can be 30+ random characters — impossible to crack', 'No temptation to reuse passwords when you never need to type them', 'Vault-Quest stores your generated passwords encrypted — it is your memory'],
        tip: 'The only password you should memorize is the one protecting your password manager.' },
      { title: 'The Master Password Exception', icon: <Scroll size={36} />,
        body: 'Your login to Vault-Quest is the one exception to "generate everything" — you type it, so it must be both strong and memorable. This is where passphrases shine.',
        bullets: ['Use a passphrase of 5+ random words for your master password', 'Avoid dates, names, or song lyrics — these are tried first in dictionary attacks', 'Write it down once and store it physically in a secure location', 'Never reuse your master password anywhere else'],
        tip: 'A 5-word passphrase like "forge-silent-vault-moon-42" is stronger than almost any typical password and still memorizable.' },
      { title: 'Lab to Vault: The Full Workflow', icon: <Star size={36} />,
        body: 'The Lab and the Vault are designed as a single pipeline: brew a strong password, then vault it immediately before you forget or misplace it.',
        bullets: ['Generate with appropriate length and complexity for the account risk level', 'Use the Save to Vault button directly from the lab result — do not copy to a note app', 'Set the service name and armor class before saving', 'Run a Radar check on the new entry to confirm it is not already in breach databases'],
        tip: 'Never paste a generated password into a notes app "temporarily" — vault it in the same motion as generating it.' },
    ]},
  { id: 'breach', name: 'The Dark Web', color: '#ff003c', tagline: 'What breaches are and how to fight back',
    slides: [
      { title: 'What is a Data Breach?', icon: <ShieldAlert size={36} />,
        body: "A data breach happens when an attacker gains unauthorized access to a company's user database and steals credential data — usernames, emails, and passwords.",
        bullets: ['Stolen data is sold on dark web marketplaces within hours of the breach', 'Billions of credentials from past breaches are still circulating and being used', 'Famous breaches: RockYou (32M), LinkedIn (117M), Adobe (153M)', 'Attackers buy combo lists and try them against every major service automatically'],
        tip: 'You may already be in a breach database without knowing it. Check your entries with the Radar scanner.' },
      { title: 'How HIBP Breach Checking Works', icon: <Radar size={36} />,
        body: 'Vault-Quest uses the Have I Been Pwned (HIBP) API with a privacy technique called k-anonymity so your real password never leaves your device.',
        bullets: ['Your password is hashed with SHA-1 locally in the browser first', 'Only the first 5 characters of that hash are sent to HIBP', 'HIBP returns all hashes starting with those 5 characters', 'Your browser checks the full hash against the returned list — locally, privately'],
        tip: 'A breach count of 0 means the password is not in known dumps — not that it is impossible to guess.' },
      { title: 'Credential Stuffing Attacks', icon: <Skull size={36} />,
        body: 'Credential stuffing is when attackers take leaked username+password pairs from one breach and automatically try them on dozens of other services.',
        bullets: ['Completely automated — bots test millions of logins per hour', 'Works because ~65% of people reuse passwords across services', 'One Netflix breach can cascade into bank, email, and Amazon access', 'Unique passwords per service fully neutralize this attack vector'],
        tip: 'Password reuse is the single biggest vulnerability. One password for everything = one breach for everything.' },
      { title: 'What To Do After a Breach', icon: <AlertTriangle size={36} />,
        body: 'If the Radar reveals a breach count greater than zero, the password has appeared in real attack databases and must be treated as compromised immediately.',
        bullets: ['Step 1: Edit the entry and rotate to a freshly generated password', 'Step 2: Check every other entry for the same password and rotate those too', 'Step 3: Enable 2FA on the affected service immediately if not already active', 'Step 4: Monitor the account for suspicious login activity or alerts'],
        tip: "The vault's background scanner auto-checks all entries every 24 hours. Use Radar for instant manual checks." },
      { title: 'Breach Knowledge Check', icon: <Check size={36} />,
        body: "You've covered what breaches are and how they're detected. Let's lock in the key concepts.",
        bullets: [],
        tip: "Even a breach count of 0 doesn't mean a password is strong — it only means it hasn't appeared in known dumps yet.",
        check: [
          { question: 'When Vault-Quest checks for breaches, what is actually sent to the HIBP server?', options: ['Your full plain-text password for server-side comparison', 'Your username and email address', 'Only the first 5 characters of your password\'s SHA-1 hash', 'A salted and peppered version of your full password hash'], answer: 2 },
          { question: 'What single habit completely neutralizes credential stuffing attacks?', options: ['Using passwords longer than 12 characters', 'Using a unique password for every individual service', 'Enabling 2FA on email accounts only', 'Changing all passwords every 30 days'], answer: 1 },
        ] },
      { title: 'The Dark Web Data Economy', icon: <Ghost size={36} />,
        body: 'Stolen credential data is a commodity. Within hours of a breach, the stolen database is listed on dark web forums and sold to the highest bidder.',
        bullets: ['Fresh breach data sells for thousands; older data is pennies per record', 'Attackers buy "combo lists" — username+password pairs by the billions', 'RockYou2024 leaked a compiled list of nearly 10 billion password variants', 'Data brokers merge multiple breach files into single mega-lists for attack campaigns'],
        tip: 'Your old passwords from 2015 breaches are still circulating and being actively tried against your accounts today.' },
      { title: 'How Long Before Breaches Are Detected?', icon: <Activity size={36} />,
        body: "The average time between a breach occurring and a company detecting it is 204 days — nearly 7 months. Attackers have months to exploit stolen credentials before anyone knows.",
        bullets: ['IBM 2023 Cost of a Data Breach: 204 days to detect, 73 more to contain', 'Many breaches are discovered externally — by researchers or dark web monitors', 'Users are often notified months or years after the actual breach date', 'HIBP adds newly confirmed breaches continuously — check regularly'],
        tip: "Assume any service you've used for several years has experienced a breach at some point and act accordingly." },
      { title: 'Phishing: The Social Engineering Threat', icon: <User size={36} />,
        body: 'Phishing bypasses all technical security by tricking you into handing over credentials willingly. No encryption stops a human from being deceived.',
        bullets: ['Phishing emails mimic real services with near-identical designs and domains', 'Spear phishing targets individuals with personal information harvested from social media', 'Fake login pages harvest credentials in real time — attackers log in immediately', 'Hover links before clicking — look for subtle misspellings in domains'],
        tip: 'Bookmark critical sites like your bank and email provider. Always navigate directly — never via email links.' },
      { title: 'Two-Factor Authentication as a Backstop', icon: <Shield size={36} />,
        body: "Even if an attacker has your username and password from a breach, 2FA adds a second barrier they can't cross without your physical device or authenticator code.",
        bullets: ['TOTP authenticator apps are more secure than SMS 2FA codes', 'SMS codes can be intercepted via SIM-swapping attacks on your carrier', 'Hardware keys (YubiKey) are the gold standard — resistant even to phishing', 'Enable 2FA on email first — it is the master key to every other account'],
        tip: 'If a service offers an authenticator app as an option, always choose it over SMS.' },
      { title: 'Building Full Breach Resilience', icon: <Crown size={36} />,
        body: 'True breach resilience is a layered defense: unique passwords, breach monitoring, 2FA, and fast response when exposure is detected.',
        bullets: ['Layer 1: Unique generated passwords eliminate credential stuffing entirely', 'Layer 2: Regular Radar scans catch exposure before attackers can exploit it', 'Layer 3: 2FA ensures breached passwords alone are not enough to log in', 'Layer 4: Rapid rotation after detection minimizes the damage window'],
        tip: 'Security is about reducing blast radius. Layers mean no single mistake is catastrophic on its own.' },
    ]},
  { id: 'crypto', name: 'Cipher Arts', color: '#ffb800', tagline: 'The real cryptography behind your security',
    slides: [
      { title: 'Encryption vs Hashing', icon: <Key size={36} />,
        body: 'These are two different operations that are often confused. Understanding the difference explains why passwords are treated differently from stored secrets.',
        bullets: ['Encryption is reversible: lock it → unlock it with the right key', 'Hashing is one-way: input → fixed fingerprint, cannot be reversed', 'Vaults encrypt stored passwords so they can be shown back to you', 'Login passwords are hashed — even the server cannot see the original'],
        tip: 'If a service can recover your forgotten password via email, they stored it wrong — it should be hashed, not encrypted.' },
      { title: 'AES-256: Military-Grade Encryption', icon: <Shield size={36} />,
        body: 'AES-256 (Advanced Encryption Standard with a 256-bit key) is the global gold standard for symmetric encryption, used by governments, militaries, and major tech companies.',
        bullets: ['256-bit key = 2²⁵⁶ possible keys (~10⁷⁷ combinations)', 'Brute-forcing AES-256 would take longer than the age of the universe', 'The same algorithm protects classified government communications', 'Security depends entirely on keeping the encryption key secret and safe'],
        tip: 'AES-256 is unbreakable in practice. The real risk is always key management, not the algorithm itself.' },
      { title: 'Password Hashing: Why "Slow" Is Good', icon: <Ghost size={36} />,
        body: 'Login passwords are hashed with a deliberately slow algorithm. Fast algorithms like MD5 run billions of times per second on GPUs — intentional slowness is a security feature.',
        bullets: ['bcrypt / Argon2 / scrypt are designed to be computationally expensive', 'Each login attempt still takes milliseconds for a legitimate user', 'Cracking millions of hashes requires years instead of seconds', 'The cost factor can be tuned upward as hardware gets faster over time'],
        tip: 'Never use MD5 or SHA-1 for passwords — they are so fast that GPUs can crack billions of hashes per second.' },
      { title: 'Salts Destroy Rainbow Tables', icon: <Star size={36} />,
        body: 'A "salt" is a random value added to each password before hashing. Even identical passwords produce completely different hashes when salted.',
        bullets: ['Without salts: "password123" always produces the same hash value', 'Attackers precompute hash→password lookup tables (rainbow tables)', 'Salts ensure every hash is unique — even for two identical passwords', 'Rainbow tables become completely useless against properly salted hashes'],
        tip: 'Salting is standard in every modern auth system. Vault-Quest salts every stored login password hash.' },
      { title: 'Cipher Knowledge Check', icon: <Check size={36} />,
        body: "Four slides of real cryptography — time to test what you've absorbed.",
        bullets: [],
        tip: 'The most important takeaway: slow is good for password hashing, fast is dangerous.',
        check: [
          { question: 'Why is bcrypt preferred over MD5 for storing login passwords?', options: ['bcrypt produces a shorter hash that uses less database space', 'bcrypt is reversible, allowing secure password recovery', 'bcrypt is intentionally slow, making GPU cracking take years instead of seconds', 'bcrypt uses 512-bit keys vs MD5\'s 128-bit output'], answer: 2 },
          { question: 'A service emails you your forgotten password in plain text. What does this reveal?', options: ['They use strong AES-256 encryption for all stored passwords', 'They stored your password un-hashed — a fundamental security failure', 'They use k-anonymity for secure password retrieval', 'They use a zero-knowledge architecture with recoverable keys'], answer: 1 },
        ] },
      { title: 'Public-Key Cryptography', icon: <Key size={36} />,
        body: 'Asymmetric encryption uses mathematically linked key pairs: a public key that encrypts and a private key that decrypts. You can share the public key freely.',
        bullets: ['Used in HTTPS, SSH logins, email signing, and code signing', 'RSA and elliptic curve (ECC) are the two dominant algorithms', 'Public key: anyone can use it to lock a message to you', 'Private key: only you can unlock messages encrypted with your public key'],
        tip: 'When you connect to a website over HTTPS, your browser uses the site\'s public key to establish a secure session.' },
      { title: 'HTTPS: Protecting Data in Transit', icon: <Globe size={36} />,
        body: 'HTTP sends data in plain text — anyone on the same network can read it. HTTPS adds a TLS layer that encrypts all traffic between your browser and the server.',
        bullets: ['The padlock icon = TLS certificate verified, traffic encrypted in transit', 'ISPs and coffee shop Wi-Fi operators cannot read HTTPS traffic content', 'TLS uses asymmetric encryption to negotiate a shared symmetric session key', 'Certificate Authorities (CAs) verify server identity to prevent impersonation'],
        tip: 'Never submit passwords or payment info on HTTP pages. Always check for a padlock before logging in anywhere.' },
      { title: 'End-to-End Encryption', icon: <Shield size={36} />,
        body: 'End-to-end encryption (E2EE) means only the two endpoints can read the message. Servers relay encrypted data they cannot themselves decrypt.',
        bullets: ['Used in Signal, WhatsApp, iMessage, and ProtonMail', 'If the server is compromised, the data is still unreadable without private keys', 'E2EE requires a key exchange between the communicating parties first', 'Safety number verification prevents man-in-the-middle key substitution'],
        tip: "Check that messaging apps support E2EE by default — not all apps labeled 'encrypted' use end-to-end encryption." },
      { title: 'Key Management: The Weakest Link', icon: <AlertTriangle size={36} />,
        body: 'AES-256 is theoretically unbreakable, but encryption is only as strong as the key protecting it. Attackers rarely break the algorithm — they steal the key.',
        bullets: ['Keys stored in plaintext files or environment variables are easily exfiltrated', 'Hardware Security Modules (HSMs) store keys in tamper-resistant physical hardware', 'Key rotation — regularly changing encryption keys — limits exposure window', 'A compromised key means all data encrypted with it must be considered exposed'],
        tip: '"Military-grade encryption" is meaningless marketing if the encryption key lives in an unprotected location.' },
      { title: 'Zero-Knowledge Security', icon: <Eye size={36} />,
        body: 'Zero-knowledge means the server never accesses your plaintext data. You encrypt before data leaves your device, and the server stores only encrypted blobs it cannot read.',
        bullets: ['True zero-knowledge: even a legal subpoena cannot yield user passwords', "HIBP's k-anonymity model is a practical form of partial zero-knowledge", 'ProtonMail and Bitwarden use zero-knowledge encryption architectures', 'The tradeoff: if you lose your master key, your data is permanently irrecoverable'],
        tip: 'Zero-knowledge shifts full responsibility to the user — which is the correct tradeoff for sensitive credentials.' },
    ]},
  { id: 'heroes', name: "Hero's Journey", color: '#00ff41', tagline: 'Master the quest system and level up fast',
    slides: [
      { title: 'XP, Levels & Hero Titles', icon: <Star size={36} />,
        body: 'Your Hero Level tracks your overall security progress. XP flows in from completing quests, daily challenges, and training ground activities.',
        bullets: ['Levels 1–15: Novice Keeper → Grand Vault Master', 'Quests award 25–300 XP based on rarity tier', 'Daily challenges award 10–20 XP each', 'Training ground completions award 60–150 XP per day'],
        tip: 'The fastest path to high levels is completing the full Legendary quest chain, not grinding dailies alone.' },
      { title: 'Daily Quests & Habits', icon: <Zap size={36} />,
        body: 'Three daily quests rotate every midnight. They reward consistent, healthy security habits rather than one-time actions.',
        bullets: ['Daily Brew: generate a password in the Lab (+15 XP)', 'Dark Web Patrol: check any vault entry for breach exposure (+15 XP)', 'Vault Visit: open the Secret Vault tab (+10 XP)', 'Quick Retrieval: copy any secret from your vault (+10 XP)'],
        tip: 'Set a 2-minute habit: open the app, check one breach, copy one secret. All three dailies done.' },
      { title: 'Training Grounds Mini-Games', icon: <Activity size={36} />,
        body: 'The Training Grounds host 8 mini-games that teach real-world security skills through interactive gameplay. Each awards XP once per day.',
        bullets: ['Password Duel — identify the stronger of two passwords', 'Speed Rater — rate 8 passwords before the timer runs out', 'Cipher Scroll — decode ROT-13, Caesar-3, and reverse ciphers', 'Vault Heist — answer riddles about cryptography and attack types'],
        tip: 'Play all 8 mini-games in a single day for a massive XP boost — each rewards XP only once per day.' },
      { title: 'Quest Chains & Unlocks', icon: <Crown size={36} />,
        body: 'Most quests unlock sequentially — completing an earlier quest unlocks a harder follow-up. Planning your path matters for reaching Legendary tier efficiently.',
        bullets: ['Common quests (25–50 XP) have no prerequisites — available from day one', 'Rare quests unlock after completing their Common parent quest', 'Epic quests require Rare completion and specific vault conditions', 'Legendary: Hoard of Legends requires 25 vault entries to complete'],
        tip: 'Filter the quest board by "Active" to see only quests you can work toward right now.' },
      { title: 'Hero Knowledge Check', icon: <Check size={36} />,
        body: "Four slides on the quest and leveling system — let's see what stuck.",
        bullets: [],
        tip: "The quest board's Claimable filter is your fastest path — it shows everything ready to claim right now.",
        check: [
          { question: 'How often can each training mini-game award XP?', options: ['Unlimited — more plays always means more XP', 'Once per week per game', 'Once per day per game', 'Once per hero level reached'], answer: 2 },
          { question: 'What unlocks Rare and Epic quest tiers?', options: ['Reaching the required hero level first', 'Completing the preceding quest in the chain', 'Having a minimum number of vault entries', 'Spending bonus XP on the unlock screen'], answer: 1 },
        ] },
      { title: 'Level Rewards & Milestones', icon: <Trophy size={36} />,
        body: 'Every level brings a milestone reward — badges, auras, or permanent XP bonuses that stack as you climb. These are all visible in your hero profile.',
        bullets: ['Levels 2, 5, 7, 10, 12, 14: unique collectible badge rewards', 'Levels 4, 8, 15: hero aura upgrades visible on your hero card', 'Levels 3, 6, 9, 11, 13: permanent XP bonus increases for specific activity types', 'All earned badges and active auras are visible in your hero profile modal'],
        tip: 'Click your profile in the sidebar to see your badge collection and all active XP bonuses at a glance.' },
      { title: 'Stacking XP Bonuses', icon: <Sparkles size={36} />,
        body: 'XP bonus rewards from leveling stack with each other — higher levels earn more from the same activities because bonuses compound.',
        bullets: ['Daily XP bonuses: +5 at level 3, +10 more at level 11 (total +15 per daily)', 'Training bonuses: +10 at level 6, +15 more at level 13 (total +25 per game)', 'Quest bonus: +20 at level 9 for every quest claimed on the board', 'Bonuses apply automatically — the label shows "+N lvl bonus" when active'],
        tip: 'At level 13, each training game completion gives base XP + 25 bonus — completing all 8 in one day becomes very rewarding.' },
      { title: 'The Legendary Quest Chain', icon: <Crown size={36} />,
        body: 'The Legendary quests are the pinnacle of the quest board. They require a substantial, high-quality vault and completion of all lower-tier chains.',
        bullets: ['Hoard of Legends: 25+ vault entries (300 XP)', 'The full chain from Common → Legendary awards 1,000+ XP total', 'Epic quests require specific vault configurations — armor class and count matter', 'Each new vault entry you add can unlock multiple quests at once'],
        tip: 'Add entries for all your real accounts systematically — each new entry likely satisfies one or more quest conditions.' },
      { title: 'The Arcane Codex & Knowledge', icon: <ScrollText size={36} />,
        body: "The Arcane Codex doesn't award XP directly — it rewards you with knowledge that improves your security decisions, which compounds over time into real protection.",
        bullets: ['Each chapter covers a different pillar of digital security', 'Slide 5 in every chapter has a quick knowledge check to reinforce learning', 'Quiz categories in Training Grounds test the same concepts — for XP this time', 'Security education has real-world value that extends far beyond this app'],
        tip: 'Read each codex chapter before playing its related Training Grounds quiz — the material directly informs the questions.' },
      { title: 'Security as a Daily Practice', icon: <Star size={36} />,
        body: 'The quest and leveling system is a gamification layer on top of real security habits. The ultimate reward is genuine, compounding digital security in the real world.',
        bullets: ['A complete vault of unique passwords eliminates credential stuffing cold', 'Regular breach checks mean you catch exposure before attackers can exploit it', 'Daily habits create muscle memory that applies to all your digital accounts', 'Grand Vault Master at level 15 = genuinely robust security hygiene built for life'],
        tip: 'The skills and habits built here apply everywhere you have an account. That is the real grand prize.' },
    ]},
];

function App() {
  const [token, setToken] = useState(localStorage.getItem('vq_token') || '');
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const trainingRef = useRef<HTMLDivElement>(null);


  const [user, setUser] = useState(null);
  const [isInitiated, setIsInitiated] = useState(true);

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [setupName, setSetupName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const [brewedPassword, setBrewedPassword] = useState('');
  const [length, setLength] = useState(16);
  const [complexity, setComplexity] = useState(2);
  const [isBrewing, setIsBrewing] = useState(false);
  const VALID_TABS = ['lab', 'vault', 'quests', 'achievements', 'admin'];
  const [activeTab, setActiveTab] = useState(() => {
    const h = window.location.hash.slice(1);
    return VALID_TABS.includes(h) ? h : 'lab';
  });
  const [vaultItems, setVaultItems] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [manualServiceName, setManualServiceName] = useState('');
  const [manualPassword, setManualPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const [adminStats, setAdminStats] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [breachStatus, setBreachStatus] = useState({});
  const [scanResult, setScanResult] = useState<{ total: number; compromised: number; safe: number } | null>(null);
  const [scanning, setScanning] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [vaultSearch, setVaultSearch] = useState('');
  const [vaultSortBy, setVaultSortBy] = useState<'newest' | 'oldest' | 'name-asc' | 'name-desc'>('newest');
  const [vaultFilterRarity, setVaultFilterRarity] = useState<'All' | 'Common' | 'Rare' | 'Epic' | 'Legendary'>('All');
  const [vaultFilterStatus, setVaultFilterStatus] = useState<'all' | 'breached' | 'stale'>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editService, setEditService] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  const [labMode, setLabMode] = useState<'potion' | 'rune'>('potion');
  const [runeCount, setRuneCount] = useState(4);
  const [runeSeparator, setRuneSeparator] = useState('-');
  const [runePassphrase, setRunePassphrase] = useState('');
  const [isBrewingRune, setIsBrewingRune] = useState(false);
  const [manualNotes, setManualNotes] = useState('');
  const [expandedNotes, setExpandedNotes] = useState<Set<number>>(new Set());

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardStep, setOnboardStep] = useState(0);
  const [breachAlert, setBreachAlert] = useState<{ serviceName: string; count: number; itemId: number } | null>(null);
  const [breachDetailsOpen, setBreachDetailsOpen] = useState(false);
  const [claimedQuests, setClaimedQuests] = useState<Set<string>>(() => new Set(JSON.parse(localStorage.getItem('vq_claimed_quests') || '[]')));
  const [questFilter, setQuestFilter] = useState<'all' | 'active' | 'claimable' | 'claimed'>('all');
  const [bonusXP, setBonusXP] = useState<number>(() => parseInt(localStorage.getItem('vq_bonus_xp') || '0'));
  const [lastSeenLevel, setLastSeenLevel] = useState<number>(() => {
    const saved = parseInt(localStorage.getItem('vq_last_level') || '0');
    if (saved > 0) return saved;
    const savedClaimed: string[] = JSON.parse(localStorage.getItem('vq_claimed_quests') || '[]');
    const savedBonus = parseInt(localStorage.getItem('vq_bonus_xp') || '0');
    const xp = QUEST_DEFS.filter(q => savedClaimed.includes(q.id)).reduce((s, q) => s + q.xp, 0) + savedBonus;
    const lv = getHeroLevel(xp).level;
    localStorage.setItem('vq_last_level', String(lv));
    return lv;
  });
  const [levelUpModal, setLevelUpModal] = useState<{ level: number; title: string } | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [rewardsRoadmapOpen, setRewardsRoadmapOpen] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQ[]>([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [activeQuizCat, setActiveQuizCat] = useState<string | null>(null);
  const [activeMiniGame, setActiveMiniGame] = useState<'duel' | 'speed' | 'memory' | 'phish' | 'crack' | 'type' | 'forge' | null>(null);
  // Duel state
  const [duelPairs, setDuelPairs] = useState<DuelPair[]>([]);
  const [duelRound, setDuelRound] = useState(0);
  const [duelPicked, setDuelPicked] = useState<'a' | 'b' | null>(null);
  const [duelScore, setDuelScore] = useState(0);
  const [duelDone, setDuelDone] = useState(false);
  // Speed state
  const [speedItems, setSpeedItems] = useState<SpeedItem[]>([]);
  const [speedRound, setSpeedRound] = useState(0);
  const [speedPicked, setSpeedPicked] = useState<string | null>(null);
  const [speedScore, setSpeedScore] = useState(0);
  const [speedDone, setSpeedDone] = useState(false);
  const [speedTime, setSpeedTime] = useState(4);
  // Memory state
  const [memPhase, setMemPhase] = useState<'flash' | 'pick' | 'done' | null>(null);
  const [memTargets, setMemTargets] = useState<string[]>([]);
  const [memChoices, setMemChoices] = useState<string[]>([]);
  const [memPicked, setMemPicked] = useState<Set<string>>(new Set());
  const [memScore, setMemScore] = useState(0);
  // Phish or Legit
  const [phishItems, setPhishItems] = useState<PhishItem[]>([]);
  const [phishRound, setPhishRound] = useState(0);
  const [phishPicked, setPhishPicked] = useState<'phish' | 'legit' | null>(null);
  const [phishScore, setPhishScore] = useState(0);
  const [phishDone, setPhishDone] = useState(false);
  // Crack Timer
  const [crackItems, setCrackItems] = useState<CrackItem[]>([]);
  const [crackRound, setCrackRound] = useState(0);
  const [crackPicked, setCrackPicked] = useState<CrackTier | null>(null);
  const [crackShowResult, setCrackShowResult] = useState(false);
  const [crackScore, setCrackScore] = useState(0);
  const [crackDone, setCrackDone] = useState(false);
  // Type It Out
  const [typePwd, setTypePwd] = useState('');
  const [typeInput, setTypeInput] = useState('');
  const [typePhase, setTypePhase] = useState<'ready' | 'typing' | 'done' | null>(null);
  const [typeStartTime, setTypeStartTime] = useState(0);
  const [typeElapsed, setTypeElapsed] = useState(0);
  const [typeMistakes, setTypeMistakes] = useState(0);
  const [typeDone, setTypeDone] = useState(false);
  // Password Forge
  const [forgePwd, setForgePwd] = useState('');
  const [forgeBase, setForgeBase] = useState('');
  // Arcane Codex
  const [codexOpen, setCodexOpen] = useState(false);
  const [codexChapter, setCodexChapter] = useState('vault');
  const [codexSlide, setCodexSlide] = useState(0);
  const [codexCheckAnswers, setCodexCheckAnswers] = useState<Record<number, number>>({});
  const [codexCheckSubmitted, setCodexCheckSubmitted] = useState(false);
  const [forgeMana, setForgeMana] = useState(4);
  const [forgeUsed, setForgeUsed] = useState<Set<string>>(new Set());
  const [forgeDone, setForgeDone] = useState(false);

  // Derived XP — used across the whole component
  const heroTotalXP = QUEST_DEFS.filter(q => claimedQuests.has(q.id)).reduce((s, q) => s + q.xp, 0) + bonusXP;

  const getLevelBonuses = () => {
    const level = getHeroLevel(heroTotalXP).level;
    let daily = 0, training = 0, quest = 0;
    for (let l = 2; l <= level; l++) {
      const r = LEVEL_REWARDS[l];
      if (!r) continue;
      if (r.type === 'xp_daily')    daily    += r.value!;
      if (r.type === 'xp_training') training += r.value!;
      if (r.type === 'xp_quest')    quest    += r.value!;
    }
    return { daily, training, quest };
  };

  useEffect(() => {
    if (!token) return;
    const current = getHeroLevel(heroTotalXP).level;
    if (current > lastSeenLevel) {
      setLevelUpModal({ level: current, title: LEVEL_DATA.find(l => l.level === current)!.title });
      setLastSeenLevel(current);
      localStorage.setItem('vq_last_level', String(current));
    }
  }, [heroTotalXP, token]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  }, []);

  const copyToClipboard = (text: string, label = 'Copied to clipboard!') => {
    navigator.clipboard.writeText(text);
    showToast(label);
    markDailyDone('daily_copy');
  };

  const addBonusXP = (amount: number, label?: string) => {
    setBonusXP(prev => { const next = prev + amount; localStorage.setItem('vq_bonus_xp', String(next)); return next; });
    showToast(`+${amount} XP${label ? ` — ${label}` : ''}`, 'success');
  };
  const markDailyDone = (id: string) => {
    const key = `vq_daily_${id}_${getTodayStr()}`;
    if (localStorage.getItem(key)) return;
    const def = DAILY_POOL.find(d => d.id === id);
    localStorage.setItem(key, '1');
    if (def) {
      const bonus = getLevelBonuses().daily;
      addBonusXP(def.xp + bonus, bonus > 0 ? `${def.title} (+${bonus} lvl bonus)` : def.title);
    }
  };
  const isDailyDone = (id: string) => !!localStorage.getItem(`vq_daily_${id}_${getTodayStr()}`);

  const startQuizCat = (catId: string) => {
    const cat = QUIZ_CATEGORIES.find(c => c.id === catId)!;
    // Deterministic daily shuffle — different questions each day, same all day
    const dateSeed = parseInt(getTodayStr().replace(/-/g, '')) + Array.from(catId).reduce((a, c) => a + c.charCodeAt(0), 0);
    let s = dateSeed;
    const rand = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0x100000000; };
    const shuffled = [...cat.questions].sort(() => rand() - 0.5).slice(0, 5);
    setQuizQuestions(shuffled); setQuizIdx(0); setQuizSelected(null);
    setQuizAnswers([]); setQuizDone(false); setActiveQuizCat(catId);
    setQuizOpen(true); setActiveMiniGame(null);
  };
  const startDuel = () => {
    const shuffled = [...DUEL_PAIRS].sort(() => Math.random() - 0.5).slice(0, 8);
    setDuelPairs(shuffled); setDuelRound(0); setDuelPicked(null);
    setDuelScore(0); setDuelDone(false);
    setActiveMiniGame('duel'); setQuizOpen(false);
  };
  const startSpeed = () => {
    const shuffled = [...SPEED_PASSWORDS].sort(() => Math.random() - 0.5).slice(0, 8);
    setSpeedItems(shuffled); setSpeedRound(0); setSpeedPicked(null);
    setSpeedScore(0); setSpeedDone(false); setSpeedTime(4);
    setActiveMiniGame('speed'); setQuizOpen(false);
  };
  const startMemory = () => {
    const pool = [...MEMORY_SERVICES].sort(() => Math.random() - 0.5);
    setMemTargets(pool.slice(0, 4));
    setMemChoices([...pool.slice(0, 8)].sort(() => Math.random() - 0.5));
    setMemPicked(new Set()); setMemScore(0); setMemPhase('flash');
    setActiveMiniGame('memory'); setQuizOpen(false);
  };

  const lcgShuffle = <T,>(arr: T[], seed: number) => {
    let s = seed;
    const rand = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0x100000000; };
    return [...arr].sort(() => rand() - 0.5);
  };
  const startPhish = () => {
    const seed = parseInt(getTodayStr().replace(/-/g, '')) + 7777;
    const items = lcgShuffle(PHISH_POOL, seed).slice(0, 8);
    setPhishItems(items); setPhishRound(0); setPhishPicked(null); setPhishScore(0); setPhishDone(false);
    setActiveMiniGame('phish'); setQuizOpen(false);
  };
  const startCrack = () => {
    const seed = parseInt(getTodayStr().replace(/-/g, '')) + 3333;
    const items = lcgShuffle(CRACK_POOL, seed).slice(0, 6);
    setCrackItems(items); setCrackRound(0); setCrackPicked(null); setCrackShowResult(false); setCrackScore(0); setCrackDone(false);
    setActiveMiniGame('crack'); setQuizOpen(false);
  };
  const startType = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let pwd = '';
    for (let i = 0; i < 14; i++) pwd += charset[Math.floor(Math.random() * charset.length)];
    setTypePwd(pwd); setTypeInput(''); setTypePhase('ready');
    setTypeStartTime(0); setTypeElapsed(0); setTypeMistakes(0); setTypeDone(false);
    setActiveMiniGame('type'); setQuizOpen(false);
  };

  const startForge = () => {
    const base = FORGE_BASES[Math.floor(Math.random() * FORGE_BASES.length)];
    setForgeBase(base); setForgePwd(base); setForgeMana(4); setForgeUsed(new Set()); setForgeDone(false);
    setActiveMiniGame('forge'); setQuizOpen(false);
  };

  const getDaysOld = (dateStr: string) => {
    if (!dateStr) return 0;
    return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  };

  const filteredVaultItems = (() => {
    let items: any[] = vaultItems.filter((item: any) =>
      item.service_name.toLowerCase().includes(vaultSearch.toLowerCase())
    );
    if (vaultFilterRarity !== 'All') items = items.filter((i: any) => i.armor_class === vaultFilterRarity);
    if (vaultFilterStatus === 'breached') items = items.filter((i: any) => (i.breach_count ?? 0) > 0);
    if (vaultFilterStatus === 'stale') items = items.filter((i: any) => getDaysOld(i.created_at) >= 90);
    return [...items].sort((a: any, b: any) => {
      if (vaultSortBy === 'name-asc') return a.service_name.localeCompare(b.service_name);
      if (vaultSortBy === 'name-desc') return b.service_name.localeCompare(a.service_name);
      if (vaultSortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  })();

  const hasBreaches = vaultItems.some((item: any) => item.breach_count > 0);

  const claimableQuestCount = QUEST_DEFS.filter(q => q.getProgress(vaultItems).complete && !claimedQuests.has(q.id)).length;

  const generatePassphrase = async () => {
    setIsBrewingRune(true);
    try {
      const res = await axios.post(`${API_BASE}/generate/passphrase`, { word_count: runeCount, separator: runeSeparator });
      setTimeout(() => { setRunePassphrase(res.data.passphrase); setIsBrewingRune(false); }, 600);
    } catch {
      setIsBrewingRune(false);
      showToast('Failed to forge rune words.', 'error');
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('vq_token', token);
      fetchMe();
    } else {
      localStorage.removeItem('vq_token');
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    if (!quizDone || quizQuestions.length === 0 || !activeQuizCat) return;
    const key = `vq_daily_quiz_${activeQuizCat}_${getTodayStr()}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
    const correctCount = quizQuestions.filter((q, i) => quizAnswers[i] === q.answer).length;
    const trainingBonus = getLevelBonuses().training;
    const earned = correctCount * 20 + (correctCount > 0 ? trainingBonus : 0);
    const catName = QUIZ_CATEGORIES.find(c => c.id === activeQuizCat)?.name || 'Quiz';
    if (earned > 0) addBonusXP(earned, `${catName} (${correctCount}/5)${trainingBonus > 0 && correctCount > 0 ? ` +${trainingBonus} lvl` : ''}`);
  }, [quizDone]);

  useEffect(() => {
    if (activeMiniGame !== 'speed' || speedDone || speedPicked !== null) return;
    if (speedTime <= 0) { setSpeedPicked('__timeout__'); return; }
    const t = setTimeout(() => setSpeedTime(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [activeMiniGame, speedDone, speedPicked, speedTime]);

  useEffect(() => {
    if (memPhase !== 'flash') return;
    const t = setTimeout(() => setMemPhase('pick'), 3000);
    return () => clearTimeout(t);
  }, [memPhase]);

  useEffect(() => {
    if (!duelDone) return;
    const key = `vq_daily_duel_${getTodayStr()}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
    const trainingBonus = getLevelBonuses().training;
    const earned = duelScore * 10 + (duelScore > 0 ? trainingBonus : 0);
    if (earned > 0) addBonusXP(earned, `Password Duel (${duelScore}/${duelPairs.length})${trainingBonus > 0 && duelScore > 0 ? ` +${trainingBonus} lvl` : ''}`);
  }, [duelDone]);

  useEffect(() => {
    if (!speedDone) return;
    const key = `vq_daily_speed_${getTodayStr()}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
    const trainingBonus = getLevelBonuses().training;
    const earned = speedScore * 10 + (speedScore > 0 ? trainingBonus : 0);
    if (earned > 0) addBonusXP(earned, `Speed Rater (${speedScore}/${speedItems.length})${trainingBonus > 0 && speedScore > 0 ? ` +${trainingBonus} lvl` : ''}`);
  }, [speedDone]);

  useEffect(() => {
    if (memPhase !== 'done') return;
    const key = `vq_daily_memory_${getTodayStr()}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
    const trainingBonus = getLevelBonuses().training;
    const earned = memScore * 15 + (memScore > 0 ? trainingBonus : 0);
    if (earned > 0) addBonusXP(earned, `Vault Memory (${memScore}/4)${trainingBonus > 0 && memScore > 0 ? ` +${trainingBonus} lvl` : ''}`);
  }, [memPhase]);

  useEffect(() => {
    if (typePhase !== 'typing') return;
    const interval = setInterval(() => setTypeElapsed(Date.now() - typeStartTime), 100);
    return () => clearInterval(interval);
  }, [typePhase, typeStartTime]);

  useEffect(() => {
    if (!crackPicked) return;
    const delay = crackPicked === 'instant' ? 700 : crackPicked === 'minutes' ? 1600 : 2400;
    const t = setTimeout(() => setCrackShowResult(true), delay);
    return () => clearTimeout(t);
  }, [crackPicked]);

  useEffect(() => {
    if (!activeMiniGame && !quizOpen) return;
    trainingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeMiniGame, quizOpen]);

  useEffect(() => {
    setCodexCheckAnswers({});
    setCodexCheckSubmitted(false);
  }, [codexSlide, codexChapter]);

  useEffect(() => {
    if (!phishDone) return;
    const key = `vq_daily_phish_${getTodayStr()}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
    const trainingBonus = getLevelBonuses().training;
    const earned = phishScore * 12 + (phishScore > 0 ? trainingBonus : 0);
    if (earned > 0) addBonusXP(earned, `Phish or Legit (${phishScore}/8)${trainingBonus > 0 && phishScore > 0 ? ` +${trainingBonus} lvl` : ''}`);
  }, [phishDone]);

  useEffect(() => {
    if (!crackDone) return;
    const key = `vq_daily_crack_${getTodayStr()}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
    const trainingBonus = getLevelBonuses().training;
    const earned = crackScore * 15 + (crackScore > 0 ? trainingBonus : 0);
    if (earned > 0) addBonusXP(earned, `Crack Timer (${crackScore}/6)${trainingBonus > 0 && crackScore > 0 ? ` +${trainingBonus} lvl` : ''}`);
  }, [crackDone]);

  useEffect(() => {
    if (!typeDone) return;
    const key = `vq_daily_type_${getTodayStr()}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
    const seconds = Math.round(typeElapsed / 1000);
    const trainingBonus = getLevelBonuses().training;
    const base = Math.max(20, 100 - typeMistakes * 4 - Math.max(0, seconds - 10) * 2);
    const earned = base + trainingBonus;
    addBonusXP(earned, `Type It Out (${typeMistakes} mistakes, ${seconds}s)${trainingBonus > 0 ? ` +${trainingBonus} lvl` : ''}`);
  }, [typeDone]);

  useEffect(() => {
    if (!forgeDone) return;
    const key = `vq_daily_forge_${getTodayStr()}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
    const trainingBonus = getLevelBonuses().training;
    const s = getPasswordStrength(forgePwd).score;
    const base = s >= 5 ? 80 : s >= 4 ? 60 : s >= 3 ? 30 : 0;
    const earned = base + (base > 0 ? trainingBonus : 0);
    if (earned > 0) addBonusXP(earned, `Password Forge (${getPasswordStrength(forgePwd).label})${trainingBonus > 0 && base > 0 ? ` +${trainingBonus} lvl` : ''}`);
  }, [forgeDone]);

  useEffect(() => {
    if (token && (activeTab === 'vault' || activeTab === 'quests')) { fetchVault(); if (activeTab === 'vault') markDailyDone('daily_vault'); }
    if (token && activeTab === 'admin') {
      fetchAdminStats();
      fetchAllUsers();
    }
  }, [activeTab, token]);

  const fetchMe = async () => {
    try {
      const res = await axios.get(`${API_BASE}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
      setUser(res.data);
      setIsInitiated(!!(res.data.display_name && res.data.avatar_url));
      if (res.data.display_name) setSetupName(res.data.display_name);
    } catch { setToken(''); }
  };

  const handleProfileSetup = async () => {
    if (!setupName || !selectedAvatar) return;
    try {
      await axios.post(`${API_BASE}/profile/update`, {
        display_name: setupName, avatar_url: selectedAvatar
      }, { headers: { Authorization: `Bearer ${token}` } });
      if (!localStorage.getItem('vq_onboarded')) {
        setShowOnboarding(true);
        setOnboardStep(0);
      }
      fetchMe();
    } catch { showToast('Failed to forge identity.', 'error'); }
  };

  const handleGoogleResponse = useCallback(async (response: { credential: string }) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/google`, { credential: response.credential });
      setToken(res.data.access_token);
    } catch { setAuthError("Google Sign-In failed. Please try again."); }
  }, []);

  useEffect(() => {
    if (token) return;
    const initGoogle = () => {
      if (!googleButtonRef.current || !window.google) return;
      window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleGoogleResponse });
      window.google.accounts.id.renderButton(googleButtonRef.current, { theme: "filled_blue", size: "large", width: "100%" });
    };
    if (window.google) {
      initGoogle();
    } else {
      const script = document.querySelector<HTMLScriptElement>('script[src*="accounts.google.com"]');
      if (script) {
        script.addEventListener('load', initGoogle, { once: true });
        return () => script.removeEventListener('load', initGoogle);
      }
    }
  }, [token, handleGoogleResponse]);

  const fetchVault = async () => {
    try {
      const res = await axios.get(`${API_BASE}/vault/list`, { headers: { Authorization: `Bearer ${token}` } });
      setVaultItems(res.data);
      const stored: Record<number, { loading: boolean; count: number }> = {};
      for (const item of res.data) {
        if (item.last_checked) stored[item.id] = { loading: false, count: item.breach_count };
      }
      setBreachStatus(stored);
    } catch { setToken(''); }
  };

  const fetchAdminStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
      setAdminStats(res.data);
    } catch {}
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
      setAllUsers(res.data);
    } catch { showToast('Failed to load heroes.', 'error'); }
  };

  const banishUser = async (userId: number, userName: string) => {
    if (!window.confirm(`Banish ${userName}?`)) return;
    try {
      await axios.delete(`${API_BASE}/admin/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAllUsers(); fetchAdminStats();
      showToast(`${userName} has been banished.`);
    } catch { showToast('Failed to banish user.', 'error'); }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', passwordInput);
      const res = await axios.post(`${API_BASE}/${isLogin ? 'token' : 'signup'}`, isLogin ? formData : { username, password: passwordInput });
      setToken(res.data.access_token);
    } catch { setAuthError("Gate closed."); }
  };

  const logout = () => {
    setToken(''); setVaultItems([]); setBreachStatus({});
    window.history.replaceState({ tab: 'lab' }, '', '#lab');
    setActiveTab('lab');
  };

  const navigateTab = useCallback((tab: string) => {
    window.history.pushState({ tab }, '', `#${tab}`);
    setActiveTab(tab);
  }, []);

  useEffect(() => {
    window.history.replaceState({ tab: activeTab }, '', `#${activeTab}`);
  }, []); // stamp the current entry once on mount

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const tab = e.state?.tab || window.location.hash.slice(1) || 'lab';
      if (VALID_TABS.includes(tab)) setActiveTab(tab);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);


  const generatePassword = async () => {
    setIsBrewing(true);
    try {
      const res = await axios.post(`${API_BASE}/generate`, { length, complexity });
      setTimeout(() => { setBrewedPassword(res.data.password); setIsBrewing(false); markDailyDone('daily_brew'); }, 800);
    } catch {
      setIsBrewing(false);
      showToast('Failed to brew password. Check your connection.', 'error');
    }
  };

  const scoutBreach = async (id) => {
    setBreachStatus(prev => ({ ...prev, [id]: { loading: true } }));
    try {
      const res = await axios.get(`${API_BASE}/vault/check-breach/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const count = res.data.breach_count;
      setBreachStatus(prev => ({ ...prev, [id]: { loading: false, count } }));
      markDailyDone('daily_scout');
      if (count > 0) {
        const item = vaultItems.find((i: any) => i.id === id);
        setBreachDetailsOpen(false);
        setBreachAlert({ serviceName: (item as any)?.service_name || 'Unknown', count, itemId: id });
      }
    } catch {
      setBreachStatus(prev => ({ ...prev, [id]: { loading: false, error: true } }));
    }
  };

  const addToVault = async () => {
    if (!serviceName || !brewedPassword) return;
    setSaving(true);
    try {
      await axios.post(`${API_BASE}/vault/add`, {
        service_name: serviceName, password: brewedPassword,
        armor_class: complexity === 3 ? "Legendary" : complexity === 2 ? "Rare" : "Common"
      }, { headers: { Authorization: `Bearer ${token}` } });
      setServiceName(''); setBrewedPassword('');
      showToast('Secret vaulted!');
      fetchVault();
    } catch {
      showToast('Failed to save to vault. Your password was not stored.', 'error');
    } finally { setSaving(false); }
  };

  const handleManualVault = async (e) => {
    e.preventDefault();
    if (!manualServiceName || !manualPassword) return;
    setSaving(true);
    try {
      const strengthScore = getPasswordStrength(manualPassword).score;
      const autoArmorClass = strengthScore >= 4 ? 'Epic' : strengthScore >= 3 ? 'Rare' : strengthScore >= 2 ? 'Uncommon' : 'Common';
      await axios.post(`${API_BASE}/vault/add`, {
        service_name: manualServiceName, password: manualPassword, armor_class: autoArmorClass, notes: manualNotes || null
      }, { headers: { Authorization: `Bearer ${token}` } });
      setManualServiceName(''); setManualPassword(''); setManualNotes('');
      showToast('Secret forged and stored!');
      if (manualNotes) markDailyDone('daily_note');
      fetchVault();
    } catch { showToast('Failed to forge secret.', 'error'); }
    setSaving(false);
  };

  const deleteVaultEntry = async (id, name) => {
    if (!window.confirm(`Banish "${name}" from your vault forever?`)) return;
    try {
      await axios.delete(`${API_BASE}/vault/delete/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      showToast(`"${name}" banished from vault.`);
      fetchVault();
    } catch { showToast('The secret resisted banishment.', 'error'); }
  };

  const editVaultEntry = async () => {
    if (!editingId || !editService) return;
    setEditSaving(true);
    try {
      const entry = vaultItems.find((i: any) => i.id === editingId);
      await axios.put(`${API_BASE}/vault/edit/${editingId}`, {
        service_name: editService,
        password: editPassword || (entry as any)?.password,
        armor_class: (entry as any)?.armor_class || 'Common',
        notes: editNotes || null
      }, { headers: { Authorization: `Bearer ${token}` } });
      const passwordChanged = !!editPassword;
      const savedId = editingId;
      showToast('Secret reforged!');
      if (editNotes) markDailyDone('daily_note');
      setEditingId(null); setEditPassword(''); setEditNotes('');
      await fetchVault();
      if (passwordChanged) scoutBreach(savedId);
    } catch { showToast('Failed to reforge secret.', 'error'); }
    finally { setEditSaving(false); }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-neon-cyan/10 blur-[150px] rounded-full" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md glass-card p-10 z-10 text-center">
          <div className="p-4 inline-block rounded-2xl bg-neon-cyan/10 text-neon-cyan mb-6"><Shield size={48} /></div>
          <h1 className="text-3xl font-black uppercase mb-2">Vault-Quest</h1>
          <p className="text-gray-500 text-[10px] font-black tracking-widest uppercase mb-10">Forge Your Security</p>
          <div className="space-y-6">
            <div ref={googleButtonRef} className="w-full min-h-[50px]" />
            <div className="flex items-center gap-4 text-[10px] font-black text-gray-700"><div className="flex-1 h-px bg-white/5" />OR<div className="flex-1 h-px bg-white/5" /></div>
            <form onSubmit={handleAuth} className="space-y-4 text-left">
              <input type="text" placeholder="Username" required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl font-bold" value={username} onChange={e => setUsername(e.target.value)} />
              <input type="password" placeholder="Password" required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl font-bold" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} />
              {authError && <p className="text-danger-red text-[10px] font-bold text-center uppercase">{authError}</p>}
              <button type="submit" className="w-full py-4 rounded-xl bg-neon-cyan text-black font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)]">{isLogin ? "Login" : "Sign Up"}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)} className="text-gray-600 hover:text-neon-cyan text-[10px] font-black uppercase">{isLogin ? "Join the Kingdom" : "Already have a quest?"}</button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isInitiated) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl glass-card p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Crown size={120} /></div>
          <h2 className="text-4xl font-black uppercase mb-2 tracking-tighter">Awaken, Hero</h2>
          <p className="text-gray-500 uppercase tracking-widest text-xs mb-12">The Kingdom of Vault-Quest awaits its next legend.</p>
          <div className="space-y-12">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase text-gray-500 tracking-[0.3em]">Choose Your Legend Name</label>
              <input type="text" value={setupName} onChange={e => setSetupName(e.target.value)} placeholder="Display Name..." className="w-full bg-white/5 border-2 border-white/10 p-6 rounded-2xl text-2xl font-black text-center focus:border-neon-cyan outline-none transition-all" />
            </div>
            <div className="space-y-6">
              <label className="text-xs font-black uppercase text-gray-500 tracking-[0.3em]">Choose Your Avatar</label>
              <div className="grid grid-cols-5 gap-4">
                {AVATARS.map(av => (
                  <button key={av.id} onClick={() => setSelectedAvatar(av.id)} className={`p-6 rounded-2xl border-2 transition-all group flex flex-col items-center gap-3 ${selectedAvatar === av.id ? 'border-neon-cyan bg-neon-cyan/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}>
                    <av.icon size={32} color={selectedAvatar === av.id ? av.color : '#666'} />
                    <span className="text-[8px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">{av.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleProfileSetup} disabled={!setupName || !selectedAvatar} className="w-full py-6 rounded-2xl bg-neon-cyan text-black font-black text-xl uppercase tracking-widest disabled:opacity-20 hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(0,242,255,0.2)]">Begin Your Legend</button>
          </div>
        </motion.div>
      </div>
    );
  }

  const UserAvatar = user && AVATARS.find(a => a.id === (user as any).avatar_url)?.icon || User;
  const userColor = user && AVATARS.find(a => a.id === (user as any).avatar_url)?.color || '#00f2ff';


  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e2e2e6] font-sans">
      <nav className="fixed left-6 top-6 bottom-6 w-72 glass-card p-8 flex flex-col gap-12 z-50">
        <div className="flex items-center gap-4 text-2xl font-bold text-neon-cyan"><Shield size={36} /><span className="tracking-tight uppercase">Vault-Quest</span></div>
        <ul className="flex flex-col gap-2">
          <li className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${activeTab === 'lab' ? 'bg-white/5 text-white' : 'text-gray-500 hover:text-white'}`} onClick={() => navigateTab('lab')}><FlaskConical size={22} /> Lab</li>
          <li className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${activeTab === 'vault' ? 'bg-white/5 text-white' : 'text-gray-500 hover:text-white'}`} onClick={() => navigateTab('vault')}>
            <Scroll size={22} /> Vault
            {hasBreaches && <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
          </li>
          <li className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${activeTab === 'quests' ? 'bg-white/5 text-white' : 'text-gray-500 hover:text-white'}`} onClick={() => navigateTab('quests')}>
            <Zap size={22} /> Quests
            {claimableQuestCount > 0 && (
              <span className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-safety-amber text-black text-[9px] font-black flex items-center justify-center">
                {claimableQuestCount}
              </span>
            )}
          </li>
          <li className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${activeTab === 'achievements' ? 'bg-white/5 text-white' : 'text-gray-500 hover:text-white'}`} onClick={() => navigateTab('achievements')}>
            <Trophy size={22} /> Achievements
          </li>
          {(user as any)?.role === 'admin' && <li className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${activeTab === 'admin' ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-neon-cyan/40 hover:text-neon-cyan'}`} onClick={() => navigateTab('admin')}><Eye size={22} /> Admin Mirror</li>}
        </ul>
        <div className="mt-auto space-y-4">
          <button onClick={() => setProfileOpen(true)}
            className="cursor-pointer w-full p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 hover:bg-white/8 hover:border-white/20 transition-all group text-left">
            <div className="p-3 rounded-lg transition-all" style={{ backgroundColor: `${userColor}20` }}><UserAvatar size={20} color={userColor} /></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black uppercase text-white leading-none mb-1 truncate">{(user as any)?.display_name || (user as any)?.username}</p>
              <p className="text-[8px] font-black uppercase text-gray-500 tracking-widest">{(user as any)?.role === 'admin' ? 'Grand Overseer' : 'Adventurer'}</p>
            </div>
            <span className="text-gray-600 group-hover:text-white text-xs transition-colors">›</span>
          </button>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 p-4 text-gray-500 hover:text-danger-red transition-all font-black uppercase text-[10px]"><LogOut size={14} /> Log Out</button>
        </div>
      </nav>

      <main className="pl-[22rem] pr-12 pt-12 min-h-screen">
        <header className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tight">{activeTab === 'lab' ? 'The Alchemist Lab' : activeTab === 'vault' ? 'The Secret Vault' : activeTab === 'quests' ? 'The Quest Board' : activeTab === 'achievements' ? 'Hall of Glory' : 'Overseer Mirror'}</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{activeTab === 'lab' ? 'Brewing unbreakable potion passwords' : activeTab === 'vault' ? 'Your collection of ancient secrets' : activeTab === 'quests' ? 'Prioritized security tasks for your vault' : activeTab === 'achievements' ? 'Your badges, auras & level milestones' : 'Kingdom oversight and control'}</p>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'lab' && (
            <motion.div key="lab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-12 gap-8">
              <div className="col-span-8 glass-card p-10 relative overflow-hidden">
                {/* Mode Toggle */}
                <div className="flex gap-2 mb-8">
                  <button
                    onClick={() => setLabMode('potion')}
                    className={`flex-1 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 ${labMode === 'potion' ? 'bg-neon-cyan text-black' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                  >
                    <FlaskConical size={14} /> Potion Mixer
                  </button>
                  <button
                    onClick={() => setLabMode('rune')}
                    className={`flex-1 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 ${labMode === 'rune' ? 'bg-neon-cyan text-black' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                  >
                    <Wand2 size={14} /> Rune Words
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {labMode === 'potion' ? (
                    <motion.div key="potion" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3 text-neon-cyan"><Sparkles /> Potion Mixer</h2>
                      <div className="space-y-12">
                        <div className="space-y-4">
                          <div className="flex justify-between text-[10px] font-black uppercase text-gray-500"><span>Potion Length</span><span className="text-neon-cyan">{length} Units</span></div>
                          <input type="range" min="8" max="64" value={length} onChange={e => setLength(parseInt(e.target.value))} className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-neon-cyan" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          {[1, 2, 3].map(lvl => (
                            <button key={lvl} onClick={() => setComplexity(lvl)} className={`p-4 rounded-xl border-2 font-black uppercase text-[10px] ${complexity === lvl ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan' : 'border-white/5 text-gray-500'}`}>{lvl === 1 ? 'Squire' : lvl === 2 ? 'Master' : 'God-Like'}</button>
                          ))}
                        </div>
                        <button onClick={generatePassword} disabled={isBrewing} className="w-full py-5 rounded-xl bg-neon-cyan text-black font-black uppercase flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,242,255,0.3)]">{isBrewing ? <RefreshCw className="animate-spin" /> : <FlaskConical />}Brew Potion</button>
                      </div>
                      {brewedPassword && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-white/5 rounded-2xl border border-neon-cyan/20">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex-1 mr-4">
                              <span className="font-mono text-2xl font-bold text-white break-all">{brewedPassword}</span>
                              <PotencyMeter password={brewedPassword} />
                            </div>
                            <button onClick={() => copyToClipboard(brewedPassword, 'Potion copied!')} className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all self-start"><Copy size={24} /></button>
                          </div>
                          <div className="flex gap-4">
                            <input type="text" placeholder="Service..." value={serviceName} onChange={e => setServiceName(e.target.value)} className="flex-1 bg-[#0a0a0c] border border-white/10 p-4 rounded-xl font-bold" />
                            <button onClick={addToVault} disabled={saving} className="px-8 bg-neon-cyan text-black font-black uppercase text-[10px] rounded-xl disabled:opacity-50">Vault</button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div key="rune" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3 text-neon-cyan"><Wand2 /> Rune Words</h2>
                      <div className="space-y-10">
                        <div className="space-y-4">
                          <div className="flex justify-between text-[10px] font-black uppercase text-gray-500"><span>Rune Count</span><span className="text-neon-cyan">{runeCount} Words</span></div>
                          <input type="range" min="3" max="6" value={runeCount} onChange={e => setRuneCount(parseInt(e.target.value))} className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-neon-cyan" />
                        </div>
                        <div className="space-y-3">
                          <p className="text-[10px] font-black uppercase text-gray-500">Separator</p>
                          <div className="grid grid-cols-3 gap-4">
                            {(['-', '.', '_'] as const).map(sep => (
                              <button key={sep} onClick={() => setRuneSeparator(sep)} className={`p-4 rounded-xl border-2 font-black text-lg ${runeSeparator === sep ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan' : 'border-white/5 text-gray-500'}`}>{sep === ' ' ? '␣' : sep}</button>
                            ))}
                          </div>
                        </div>
                        <button onClick={generatePassphrase} disabled={isBrewingRune} className="w-full py-5 rounded-xl bg-neon-cyan text-black font-black uppercase flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,242,255,0.3)]">{isBrewingRune ? <RefreshCw className="animate-spin" /> : <Wand2 />}Forge Rune Words</button>
                      </div>
                      {runePassphrase && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-white/5 rounded-2xl border border-neon-cyan/20">
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-mono text-xl font-bold text-white break-all flex-1 mr-4">{runePassphrase}</span>
                            <button onClick={() => copyToClipboard(runePassphrase, 'Rune words copied!')} className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all self-start"><Copy size={24} /></button>
                          </div>
                          <div className="flex gap-4">
                            <input type="text" placeholder="Service..." value={serviceName} onChange={e => setServiceName(e.target.value)} className="flex-1 bg-[#0a0a0c] border border-white/10 p-4 rounded-xl font-bold" />
                            <button
                              onClick={async () => {
                                if (!serviceName || !runePassphrase) return;
                                setSaving(true);
                                try {
                                  await axios.post(`${API_BASE}/vault/add`, { service_name: serviceName, password: runePassphrase, armor_class: "Legendary" }, { headers: { Authorization: `Bearer ${token}` } });
                                  setServiceName(''); setRunePassphrase('');
                                  showToast('Rune words vaulted!');
                                  fetchVault();
                                } catch { showToast('Failed to vault.', 'error'); }
                                finally { setSaving(false); }
                              }}
                              disabled={saving || !serviceName}
                              className="px-8 bg-neon-cyan text-black font-black uppercase text-[10px] rounded-xl disabled:opacity-50"
                            >Vault</button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="col-span-4 glass-card p-8 border-safety-amber/10"><h3 className="text-xl font-black mb-6 uppercase text-safety-amber flex items-center gap-2"><Activity size={20} /> Stats</h3><div className="space-y-4 text-[10px] font-black uppercase"><div className="flex justify-between"><span>Level</span><span className="text-white">42</span></div><div className="flex justify-between"><span>Class</span><span className="text-safety-amber">Legendary</span></div></div></div>
            </motion.div>
          )}

          {activeTab === 'vault' && (
            <motion.div key="vault" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Forge Entry Form */}
              <div className="glass-card p-8 border-neon-cyan/10">
                <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3 text-neon-cyan"><Sparkles size={20} /> Forge New Secret</h3>
                <form onSubmit={handleManualVault} className="space-y-6">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Application (e.g. Netflix)"
                      value={manualServiceName}
                      onChange={e => setManualServiceName(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl font-bold focus:border-neon-cyan outline-none transition-all"
                    />
                    <div className="flex-1">
                      <input
                        type="password"
                        placeholder="Secret Password"
                        value={manualPassword}
                        onChange={e => setManualPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl font-bold focus:border-neon-cyan outline-none transition-all"
                      />
                      <PotencyMeter password={manualPassword} />
                    </div>
                  </div>
                  <textarea
                    placeholder="Arcane Inscriptions — notes, 2FA codes, security questions... (optional)"
                    value={manualNotes}
                    onChange={e => setManualNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl font-bold focus:border-neon-cyan outline-none transition-all resize-none text-sm"
                  />
                  <button
                    type="submit"
                    disabled={saving || !manualServiceName || !manualPassword}
                    className="w-full py-4 bg-neon-cyan text-black font-black uppercase text-[10px] rounded-xl hover:scale-[1.01] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                  >
                    {saving ? "Forging..." : "Store in Vault"}
                  </button>
                </form>
              </div>

              {/* Search + Filter + Sort */}
              {vaultItems.length > 0 && (
                <div className="space-y-3">
                  <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search your secrets..."
                      value={vaultSearch}
                      onChange={e => setVaultSearch(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-3 rounded-xl font-bold text-sm focus:border-neon-cyan outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Rarity filter pills */}
                    <div className="flex gap-1.5 flex-wrap">
                      {(['All', 'Common', 'Rare', 'Epic', 'Legendary'] as const).map(r => {
                        const active = vaultFilterRarity === r;
                        const rarityColor = r === 'All' ? '#00f2ff' : RARITY[r as QuestRarity]?.color;
                        return (
                          <button key={r} onClick={() => setVaultFilterRarity(r)}
                            className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border"
                            style={active
                              ? { backgroundColor: rarityColor, color: '#000', borderColor: 'transparent' }
                              : { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: '#6b7280' }
                            }>
                            {r}
                          </button>
                        );
                      })}
                    </div>
                    {/* Status + Sort */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {vaultItems.some((i: any) => (i.breach_count ?? 0) > 0) && (
                        <button
                          onClick={() => setVaultFilterStatus(s => s === 'breached' ? 'all' : 'breached')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${vaultFilterStatus === 'breached' ? 'bg-danger-red/20 text-danger-red border-danger-red/40' : 'bg-white/5 border-white/10 text-gray-500 hover:text-danger-red'}`}
                        >
                          <ShieldAlert size={11} /> Breached
                        </button>
                      )}
                      {vaultItems.some((i: any) => getDaysOld(i.created_at) >= 90) && (
                        <button
                          onClick={() => setVaultFilterStatus(s => s === 'stale' ? 'all' : 'stale')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${vaultFilterStatus === 'stale' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' : 'bg-white/5 border-white/10 text-gray-500 hover:text-orange-400'}`}
                        >
                          <AlertTriangle size={11} /> Stale
                        </button>
                      )}
                      <select
                        value={vaultSortBy}
                        onChange={e => setVaultSortBy(e.target.value as any)}
                        className="bg-white/5 border border-white/10 text-gray-400 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg outline-none cursor-pointer hover:border-white/20 transition-all"
                      >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="name-asc">A → Z</option>
                        <option value="name-desc">Z → A</option>
                      </select>
                    </div>
                  </div>
                  {(vaultFilterRarity !== 'All' || vaultFilterStatus !== 'all') && (
                    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-gray-500">
                      <span>{filteredVaultItems.length} of {vaultItems.length} secrets</span>
                      <button onClick={() => { setVaultFilterRarity('All'); setVaultFilterStatus('all'); }} className="text-neon-cyan hover:text-white transition-colors">
                        Clear ×
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Empty State */}
              {vaultItems.length === 0 && (
                <div className="glass-card p-16 text-center border-white/5">
                  <div className="p-6 inline-flex bg-white/5 rounded-2xl mb-6 text-gray-600"><Key size={48} /></div>
                  <h3 className="text-2xl font-black uppercase mb-2 text-gray-400">Your Vault is Empty</h3>
                  <p className="text-gray-600 text-xs font-black uppercase tracking-widest mb-8">Brew a potion or forge a secret to begin your quest.</p>
                  <button onClick={() => navigateTab('lab')} className="px-8 py-3 bg-neon-cyan text-black font-black uppercase text-[10px] rounded-xl tracking-widest">
                    Go to the Lab
                  </button>
                </div>
              )}

              {/* No results */}
              {vaultItems.length > 0 && filteredVaultItems.length === 0 && (
                <div className="text-center py-12 space-y-3">
                  <p className="text-gray-600 font-black uppercase text-[10px] tracking-widest">
                    {vaultSearch ? `No secrets match "${vaultSearch}"` : 'No secrets match the active filters'}
                  </p>
                  {(vaultFilterRarity !== 'All' || vaultFilterStatus !== 'all') && (
                    <button onClick={() => { setVaultFilterRarity('All'); setVaultFilterStatus('all'); }} className="text-neon-cyan text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors">
                      Clear filters ×
                    </button>
                  )}
                </div>
              )}

              {/* Vault Grid */}
              <div className="grid grid-cols-3 gap-6">
                {filteredVaultItems.map((item: any, i: number) => (
                  <div
                    key={item.id || i}
                    className="glass-card p-6 transition-all group relative overflow-hidden"
                    style={getDaysOld(item.created_at) >= 90
                      ? { borderColor: 'rgba(60,120,5,0.5)' }
                      : { borderColor: 'rgba(255,255,255,0.05)' }}
                  >
                    {/* Rotting vine effect */}
                    <AnimatePresence>
                      {getDaysOld(item.created_at) >= 90 && <RotVines key="vines" />}
                    </AnimatePresence>
                    {editingId === item.id ? (
                      /* Edit Form */
                      <div className="space-y-3">
                        <p className="text-[8px] font-black uppercase text-neon-cyan tracking-widest mb-4">Reforging Secret</p>
                        <input
                          type="text"
                          value={editService}
                          onChange={e => setEditService(e.target.value)}
                          placeholder="Service name"
                          className="w-full bg-white/5 border border-white/10 p-3 rounded-lg font-bold text-sm focus:border-neon-cyan outline-none transition-all"
                        />
                        <input
                          type="password"
                          value={editPassword}
                          onChange={e => setEditPassword(e.target.value)}
                          placeholder="New password (leave blank to keep)"
                          className="w-full bg-white/5 border border-white/10 p-3 rounded-lg font-bold text-sm focus:border-neon-cyan outline-none transition-all"
                        />
                        <textarea
                          value={editNotes}
                          onChange={e => setEditNotes(e.target.value)}
                          placeholder="Notes (optional)"
                          rows={2}
                          className="w-full bg-white/5 border border-white/10 p-3 rounded-lg font-bold text-sm focus:border-neon-cyan outline-none transition-all resize-none"
                        />
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={editVaultEntry}
                            disabled={editSaving || !editService}
                            className="flex-1 py-2 bg-neon-cyan text-black font-black uppercase text-[9px] rounded-lg disabled:opacity-50"
                          >
                            {editSaving ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={() => { setEditingId(null); setEditPassword(''); setEditNotes(''); }}
                            className="flex-1 py-2 bg-white/5 text-gray-400 font-black uppercase text-[9px] rounded-lg hover:bg-white/10"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Normal Card View */
                      <>
                        <div className="flex justify-between mb-4">
                          <div className="p-3 bg-neon-cyan/10 text-neon-cyan rounded-lg"><Key size={20} /></div>
                          <div className="flex gap-2">
                            <span className="text-[8px] font-black uppercase px-2 py-1 border border-white/10 rounded h-fit">{item.armor_class}</span>
                            <button
                              onClick={() => scoutBreach(item.id)}
                              className={`p-2 rounded-lg transition-all ${breachStatus[item.id]?.count > 0 ? 'text-danger-red bg-danger-red/10' : 'text-gray-500 hover:text-neon-cyan hover:bg-neon-cyan/10'}`}
                              title="Scout for Breaches"
                            >
                              {breachStatus[item.id]?.loading ? <RefreshCw size={14} className="animate-spin" /> : <Radar size={14} />}
                            </button>
                            <button
                              onClick={() => { setEditingId(item.id); setEditService(item.service_name); setEditPassword(''); setEditNotes(item.notes || ''); }}
                              className="p-2 text-gray-500 hover:text-neon-cyan hover:bg-neon-cyan/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => deleteVaultEntry(item.id, item.service_name)}
                              className="p-2 text-gray-500 hover:text-danger-red hover:bg-danger-red/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <h4 className="font-black uppercase mb-1">{item.service_name}</h4>

                        {getDaysOld(item.created_at) >= 90 && (
                          <div className="relative z-10 mb-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-[8px] font-black uppercase tracking-wide animate-pulse">
                            <AlertTriangle size={9} />
                            {getDaysOld(item.created_at)}d old — Rotate this!
                          </div>
                        )}

                        {/* Breach Status */}
                        <div className="mb-3 min-h-[20px]">
                          {breachStatus[item.id]?.count > 0 && (
                            <div className="flex items-center gap-2 text-danger-red animate-pulse">
                              <ShieldAlert size={12} />
                              <span className="text-[8px] font-black uppercase">Exposed {breachStatus[item.id].count.toLocaleString()} times!</span>
                            </div>
                          )}
                          {breachStatus[item.id]?.count === 0 && (
                            <div className="flex items-center gap-2 text-neon-cyan">
                              <Shield size={12} />
                              <span className="text-[8px] font-black uppercase">Unseen in Breaches</span>
                            </div>
                          )}
                          {breachStatus[item.id]?.error && (
                            <span className="text-[8px] font-black uppercase text-gray-500">Scout failed...</span>
                          )}
                        </div>

                        {/* Password (always hidden) */}
                        <div className="mb-3 p-3 bg-white/5 rounded-lg">
                          <span className="font-mono text-xs text-gray-400">••••••••••••</span>
                        </div>

                        <button
                          onClick={() => copyToClipboard(item.password, `"${item.service_name}" copied!`)}
                          className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/5 flex items-center justify-center gap-2"
                        >
                          <Zap size={14} /> Copy Secret
                        </button>

                        {/* Arcane Inscriptions */}
                        {item.notes && (
                          <div className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/10 overflow-hidden">
                            <button
                              onClick={() => setExpandedNotes(prev => {
                                const next = new Set(prev);
                                if (next.has(item.id)) { next.delete(item.id); } else { next.add(item.id); }
                                return next;
                              })}
                              className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-black uppercase text-amber-400 hover:text-amber-200 transition-all"
                            >
                              <ScrollText size={15} /> Arcane Inscription
                              {expandedNotes.has(item.id) ? <ChevronUp size={13} className="ml-auto" /> : <ChevronDown size={13} className="ml-auto" />}
                            </button>
                            {expandedNotes.has(item.id) && (
                              <p className="px-4 pb-4 text-xs text-amber-100/80 whitespace-pre-wrap break-words border-t border-amber-500/30 pt-3 leading-relaxed">{item.notes}</p>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'quests' && (() => {
            const questXP   = QUEST_DEFS.filter(q => claimedQuests.has(q.id)).reduce((s, q) => s + q.xp, 0);
            const totalXP   = questXP + bonusXP;
            const hero      = getHeroLevel(totalXP);
            const nextHero  = getNextHeroLevel(totalXP);
            const heroR     = RARITY[hero.level >= 9 ? 'Legendary' : hero.level >= 6 ? 'Epic' : hero.level >= 3 ? 'Rare' : 'Common'];
            const lvlPct    = nextHero ? Math.round(((totalXP - hero.xp) / (nextHero.xp - hero.xp)) * 100) : 100;

            const claimQuest = (id: string) => {
              const quest = QUEST_DEFS.find(q => q.id === id)!;
              setClaimingId(id);
              setTimeout(() => {
                const next = new Set(claimedQuests); next.add(id);
                setClaimedQuests(next);
                localStorage.setItem('vq_claimed_quests', JSON.stringify([...next]));
                const questBonus = getLevelBonuses().quest;
                if (questBonus > 0) addBonusXP(questBonus, `${quest.title} level bonus`);
                showToast(`+${quest.xp + questBonus} XP — ${quest.title} complete!${questBonus > 0 ? ` (+${questBonus} lvl bonus)` : ''}`, 'success');
                setClaimingId(null);
              }, 500);
            };

            const isUnlocked = (q: QuestDef) => !q.requires || q.requires.every(r => claimedQuests.has(r));

            const filtered = QUEST_DEFS.filter(q => {
              const p = q.getProgress(vaultItems);
              const claimed = claimedQuests.has(q.id);
              const unlocked = isUnlocked(q);
              if (questFilter === 'active')    return !p.complete && !claimed && unlocked;
              if (questFilter === 'claimable') return p.complete && !claimed;
              if (questFilter === 'claimed')   return claimed;
              return true;
            });

            const dailyQuests = getDailyQuests();

            return (
              <motion.div key="quests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">

                {/* ── HERO CARD ── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 relative overflow-hidden" style={{ borderColor: heroR.color + '50' }}>
                  <motion.div className="absolute inset-0 pointer-events-none" animate={{ opacity: [0.03, 0.07, 0.03] }} transition={{ duration: 3, repeat: Infinity }} style={{ background: `radial-gradient(ellipse at 0% 50%, ${heroR.color} 0%, transparent 60%)` }} />
                  <div className="relative flex items-center gap-6">
                    {/* Level orb */}
                    <motion.div animate={{ boxShadow: [`0 0 20px ${heroR.color}40`, `0 0 40px ${heroR.color}80`, `0 0 20px ${heroR.color}40`] }} transition={{ duration: 2.5, repeat: Infinity }}
                      className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center shrink-0 border-2"
                      style={{ background: heroR.glow, borderColor: heroR.color }}>
                      <span className="text-[8px] font-black uppercase text-gray-500">LVL</span>
                      <span className="text-3xl font-black leading-none" style={{ color: heroR.color }}>{hero.level}</span>
                    </motion.div>
                    {/* Title & XP */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Hero Title</p>
                      <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-1">{hero.title}</h2>
                      <p className="text-xs text-gray-500 mb-2">{totalXP.toLocaleString()} XP total</p>
                      <div className="flex justify-between text-[8px] font-black uppercase text-gray-600 mb-1">
                        <span>{nextHero ? `${nextHero.xp - totalXP} XP to ${nextHero.title}` : 'Maximum Rank Achieved'}</span>
                        <span>{lvlPct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${lvlPct}%` }} transition={{ duration: 1, ease: 'easeOut' }} style={{ background: `linear-gradient(90deg, ${heroR.color}aa, ${heroR.color})` }} />
                      </div>
                    </div>
                    {/* Quest count */}
                    <div className="text-right shrink-0">
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">Quests</p>
                      <p className="text-2xl font-black text-white">{claimedQuests.size}<span className="text-xs text-gray-600 font-bold">/{QUEST_DEFS.length}</span></p>
                    </div>
                  </div>
                  {/* Rewards row */}
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {Object.entries(LEVEL_REWARDS).filter(([lv]) => parseInt(lv) <= hero.level && LEVEL_REWARDS[parseInt(lv)].type === 'badge').map(([lv, r]) => (
                        <span key={lv} className="text-xl" title={r.name}>{r.icon}</span>
                      ))}
                      {(() => {
                        const aura = Object.entries(LEVEL_REWARDS).filter(([lv]) => parseInt(lv) <= hero.level && LEVEL_REWARDS[parseInt(lv)].type === 'aura').pop();
                        if (!aura) return null;
                        return <span className="text-xl" title={aura[1].name}>{aura[1].icon}</span>;
                      })()}
                      {Object.entries(LEVEL_REWARDS).filter(([lv]) => parseInt(lv) <= hero.level).length === 0 && (
                        <span className="text-[9px] text-gray-600">No rewards yet — keep leveling up!</span>
                      )}
                    </div>
                    <button onClick={() => setRewardsRoadmapOpen(true)}
                      className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all hover:opacity-90"
                      style={{ background: heroR.color + '20', color: heroR.color, border: `1px solid ${heroR.color}40` }}>
                      <Trophy size={10} /> View All Rewards
                    </button>
                  </div>
                </motion.div>

                {/* ── DAILY QUESTS ── */}
                <section>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-safety-amber flex items-center gap-2 mb-4"><Zap size={13} /> Daily Quests — Resets at Midnight</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {dailyQuests.map((dq, i) => {
                      const done = isDailyDone(dq.id);
                      return (
                        <motion.div key={dq.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                          className="glass-card p-4 flex flex-col gap-2 relative overflow-hidden"
                          style={{ borderColor: done ? 'rgba(0,255,100,0.25)' : 'rgba(255,184,0,0.2)', opacity: done ? 0.6 : 1 }}>
                          {done && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center"><Check size={10} className="text-green-400" /></motion.div>}
                          <div className="p-2 rounded-lg w-fit" style={{ color: '#ffb800', background: 'rgba(255,184,0,0.1)' }}>{dq.icon}</div>
                          <p className="font-black uppercase text-xs text-white leading-tight">{dq.title}</p>
                          <p className="text-[9px] text-gray-500 leading-relaxed flex-1">{dq.desc}</p>
                          <span className="text-[8px] font-black" style={{ color: done ? '#4ade80' : '#ffb800' }}>{done ? 'Complete' : `+${dq.xp} XP`}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>

                {/* ── ARCANE CODEX ── */}
                <section>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 mb-5" style={{ color: '#bd00ff' }}>
                    <ScrollText size={13} /> Arcane Codex — Knowledge of the Realm
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {CODEX_CHAPTERS.map((c, i) => (
                      <motion.button key={c.id}
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        onClick={() => { setCodexChapter(c.id); setCodexSlide(0); setCodexOpen(true); }}
                        className="glass-card p-5 text-left relative overflow-hidden group cursor-pointer"
                        style={{ borderColor: c.color + '30' }}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <motion.div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ background: `radial-gradient(ellipse at 0% 0%, ${c.color}15, transparent 70%)` }} />
                        <div className="relative flex items-start gap-4">
                          <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: c.color + '20', color: c.color }}>
                            {c.slides[0].icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[8px] font-black uppercase tracking-widest mb-1" style={{ color: c.color }}>{c.name}</p>
                            <p className="text-white font-black text-sm uppercase leading-tight mb-2">{c.tagline}</p>
                            <p className="text-gray-600 text-[9px] font-bold">{c.slides.length} slides</p>
                          </div>
                          <div className="shrink-0 text-gray-600 group-hover:text-white transition-colors text-sm font-black">→</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </section>

                {/* ── TRAINING GROUNDS ── */}
                <section ref={trainingRef} style={{ scrollMarginTop: '2rem' }}>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-neon-cyan flex items-center gap-2 mb-5"><Activity size={13} /> Training Grounds — Daily XP</h2>
                    {!activeMiniGame && (
                      <motion.div key="hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                        {/* ── Knowledge Quizzes ── */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-px flex-1 bg-white/5" />
                          <span className="text-[8px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full" style={{ color: '#00f2ff', background: 'rgba(0,242,255,0.08)', border: '1px solid rgba(0,242,255,0.15)' }}>✦ Knowledge Quizzes · 5 questions · up to +100 XP</span>
                          <div className="h-px flex-1 bg-white/5" />
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-8">
                          {QUIZ_CATEGORIES.map((cat, i) => {
                            const done = isDailyDone(`quiz_${cat.id}`);
                            return (
                              <motion.div key={cat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="glass-card p-4 flex flex-col gap-2 relative overflow-hidden"
                                style={{ borderColor: done ? 'rgba(74,222,128,0.2)' : cat.color + '28' }}>
                                {done && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center"><Check size={10} className="text-green-400" /></motion.div>}
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: cat.color }}>{cat.name}</span>
                                </div>
                                <p className="text-[9px] text-gray-500 leading-relaxed flex-1">{cat.questions.length} questions in pool · 5 drawn each game</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-[8px] font-black" style={{ color: done ? '#4ade80' : cat.color }}>{done ? '✓ Done today' : 'Up to +100 XP'}</span>
                                  <button type="button" onClick={() => startQuizCat(cat.id)} className="px-3 py-1.5 rounded-lg font-black uppercase text-[8px] tracking-widest transition-all"
                                    style={{ background: done ? 'rgba(255,255,255,0.05)' : cat.color + 'cc', color: done ? '#555' : '#000' }}>
                                    {done ? 'Replay' : 'Start →'}
                                  </button>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* ── Mini Games ── */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-px flex-1 bg-white/5" />
                          <span className="text-[8px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full" style={{ color: '#ffb800', background: 'rgba(255,184,0,0.08)', border: '1px solid rgba(255,184,0,0.15)' }}>⚔ Mini Games · earn XP daily</span>
                          <div className="h-px flex-1 bg-white/5" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {([
                            { id: 'duel',   label: 'Password Duel',  desc: 'Pick the stronger of two passwords. 8 rounds.',          xp: 80,  color: '#ff003c', start: startDuel,   icon: <Shield size={18} /> },
                            { id: 'speed',  label: 'Speed Rater',    desc: 'Rate 8 passwords before the timer runs out.',            xp: 80,  color: '#ffb800', start: startSpeed,  icon: <Zap size={18} /> },
                            { id: 'phish',  label: 'Phish or Legit', desc: 'Spot phishing URLs, emails & scenarios. 8 rounds.',      xp: 96,  color: '#ff003c', start: startPhish,  icon: <Globe size={18} /> },
                            { id: 'memory', label: 'Vault Memory',   desc: 'Memorize 4 services in 3 seconds, then recall them.',    xp: 60,  color: '#00f2ff', start: startMemory, icon: <Star size={18} /> },
                            { id: 'crack',  label: 'Crack Timer',    desc: 'How fast does each password crack? 6 rounds.',           xp: 90,  color: '#ffb800', start: startCrack,  icon: <Zap size={18} /> },
                            { id: 'type',   label: 'Type It Out',    desc: 'Type a random strong password perfectly — fast.',        xp: 100, color: '#00f2ff', start: startType,   icon: <Activity size={18} /> },
                            { id: 'forge',  label: 'Password Forge', desc: 'Spend 4 mana to craft the strongest password you can.',  xp: 80,  color: '#00f2ff', start: startForge,  icon: <FlaskConical size={18} /> },
                          ] as const).map((game, i) => {
                            const done = isDailyDone(game.id);
                            return (
                              <motion.div key={game.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
                                className="glass-card p-4 flex gap-3 items-start relative overflow-hidden"
                                style={{ borderColor: done ? 'rgba(74,222,128,0.2)' : game.color + '28' }}>
                                {done && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center"><Check size={10} className="text-green-400" /></motion.div>}
                                <div className="p-2 rounded-xl shrink-0 mt-0.5" style={{ color: game.color, background: game.color + '18' }}>{game.icon}</div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-black uppercase text-[10px] text-white leading-tight mb-1">{game.label}</p>
                                  <p className="text-[8px] text-gray-500 leading-relaxed mb-2">{game.desc}</p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-[8px] font-black" style={{ color: done ? '#4ade80' : game.color }}>{done ? '✓ Done' : `+${game.xp} XP`}</span>
                                    <button type="button" onClick={game.start} className="px-3 py-1.5 rounded-lg font-black uppercase text-[8px] tracking-widest transition-all"
                                      style={{ background: done ? 'rgba(255,255,255,0.05)' : game.color + 'cc', color: done ? '#555' : (game.color === '#ffb800' || game.color === '#00f2ff' || game.color === '#ff6b35') ? '#000' : '#fff' }}>
                                      {done ? 'Replay' : 'Play →'}
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                </section>

                {/* ── FILTER TABS ── */}
                <div className="flex gap-2">
                  {(['all', 'active', 'claimable', 'claimed'] as const).map(f => (
                    <button key={f} onClick={() => setQuestFilter(f)}
                      className={`px-4 py-2 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all ${questFilter === f ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-white'}`}>
                      {f}{f === 'claimable' && claimableQuestCount > 0 ? ` (${claimableQuestCount})` : ''}
                    </button>
                  ))}
                </div>

                {/* ── QUEST GRID ── */}
                <div className="grid grid-cols-2 gap-5">
                  {filtered.map((quest, i) => {
                    const p        = quest.getProgress(vaultItems);
                    const claimed  = claimedQuests.has(quest.id);
                    const unlocked = isUnlocked(quest);
                    const locked   = !unlocked && !claimed;
                    const r        = RARITY[quest.rarity];
                    const pct      = p.total > 0 ? Math.round((p.current / p.total) * 100) : 0;
                    const claiming = claimingId === quest.id;
                    return (
                      <AnimatePresence key={quest.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={claiming ? { scale: [1, 1.04, 0.96, 1], opacity: [1, 1, 1, claimed ? 0.55 : 1] } : { opacity: 1, y: 0 }}
                          transition={claiming ? { duration: 0.5 } : { delay: i * 0.06, duration: 0.35 }}
                          className="glass-card p-6 flex flex-col relative overflow-hidden"
                          style={{
                            borderColor: locked ? 'rgba(255,255,255,0.04)' : claimed ? 'rgba(255,255,255,0.06)' : p.complete ? r.color : `${r.color}40`,
                            opacity: locked || claimed ? 0.5 : 1,
                            boxShadow: p.complete && !claimed && !locked ? `0 0 24px ${r.glow}` : 'none',
                            filter: locked ? 'grayscale(0.6)' : 'none',
                          }}
                        >
                          {/* Pulsing glow */}
                          {p.complete && !claimed && !locked && (
                            <motion.div className="absolute inset-0 pointer-events-none rounded-xl" animate={{ opacity: [0, 0.09, 0] }} transition={{ duration: 2.2, repeat: Infinity }} style={{ background: r.color }} />
                          )}

                          {/* Claimed stamp */}
                          {claimed && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.15)' }}>
                              <Check size={9} style={{ color: '#4ade80' }} /><span className="text-[7px] font-black uppercase" style={{ color: '#4ade80' }}>Claimed</span>
                            </motion.div>
                          )}

                          {/* Locked overlay */}
                          {locked && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 rounded-xl" style={{ background: 'rgba(0,0,0,0.55)' }}>
                              <span className="text-3xl mb-2">🔒</span>
                              <p className="text-[8px] font-black uppercase text-gray-500 text-center px-4">
                                Complete: {quest.requires?.map(r => QUEST_DEFS.find(q => q.id === r)?.title).join(', ')}
                              </p>
                            </div>
                          )}

                          {/* Rarity + XP */}
                          <div className="flex items-center justify-between mb-4">
                            <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest" style={{ color: r.color, background: r.glow }}>{quest.rarity}</span>
                            <span className="text-[10px] font-black" style={{ color: r.color }}>+{quest.xp} XP</span>
                          </div>

                          {/* Icon + title */}
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 rounded-xl shrink-0" style={{ color: r.color, background: r.glow }}>{quest.icon}</div>
                            <h3 className="font-black uppercase text-sm text-white leading-tight pt-1">{quest.title}</h3>
                          </div>

                          <p className="text-[10px] text-gray-500 leading-relaxed mb-4 flex-1 italic">{quest.flavor}</p>

                          {/* Progress */}
                          {!claimed && !locked && (
                            <div className="mb-4">
                              <div className="flex justify-between text-[8px] font-black uppercase text-gray-600 mb-1">
                                <span>Progress</span><span>{p.current} / {p.total}</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.06 }} style={{ backgroundColor: r.color }} />
                              </div>
                            </div>
                          )}

                          {/* Claim button */}
                          {!claimed && !locked && (
                            <motion.button
                              disabled={!p.complete || !!claimingId}
                              onClick={() => claimQuest(quest.id)}
                              whileHover={p.complete ? { scale: 1.03 } : {}}
                              whileTap={p.complete ? { scale: 0.97 } : {}}
                              className="w-full py-3 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                              style={p.complete ? { background: r.color, color: '#000', boxShadow: `0 0 16px ${r.glow}` } : { background: 'rgba(255,255,255,0.05)', color: '#555' }}
                            >
                              {claiming ? <RefreshCw size={12} className="animate-spin" /> : p.complete ? <><Zap size={12} /> Claim Reward</> : 'In Progress...'}
                            </motion.button>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    );
                  })}
                </div>

                {filtered.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600 font-black uppercase text-[10px] tracking-widest">No quests in this category.</p>
                  </div>
                )}


              </motion.div>
            );
          })()}

          {activeTab === 'achievements' && (() => {
            const aHeroXP = heroTotalXP;
            const isAdmin = (user as any)?.role === 'admin';
            const aHeroRaw = getHeroLevel(aHeroXP);
            const aHero = isAdmin ? { ...LEVEL_DATA[14], level: 15 } : aHeroRaw;
            const aNext = isAdmin ? null : getNextHeroLevel(aHeroXP);
            const aRarity = RARITY['Legendary'];
            const aLvlPct = isAdmin ? 100 : (aNext ? Math.round(((aHeroXP - aHeroRaw.xp) / (aNext.xp - aHeroRaw.xp)) * 100) : 100);
            const allBadges = Object.entries(LEVEL_REWARDS).filter(([, r]) => r.type === 'badge');
            const allAuras = Object.entries(LEVEL_REWARDS).filter(([, r]) => r.type === 'aura');
            const earnedAuras = allAuras.filter(([lv]) => parseInt(lv) <= aHero.level);
            const activeAura = earnedAuras.length > 0 ? earnedAuras[earnedAuras.length - 1][1] : null;
            const bonuses = getLevelBonuses();
            const AchAvatar = user && AVATARS.find(a => a.id === (user as any).avatar_url)?.icon || User;
            const achColor = user && AVATARS.find(a => a.id === (user as any).avatar_url)?.color || '#00f2ff';
            return (
              <motion.div key="achievements" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl space-y-10">

                {/* ── Admin badge ── */}
                {isAdmin && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl p-5 flex items-center gap-5"
                    style={{ background: 'linear-gradient(135deg, #ffd70015, #ffb80010)', border: '1px solid #ffd70040' }}>
                    <motion.span className="text-5xl" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>⚜️</motion.span>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-yellow-600 mb-0.5">Exclusive · One of a Kind</p>
                      <h3 className="text-xl font-black uppercase text-white">{ADMIN_BADGE.name}</h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">{ADMIN_BADGE.desc}</p>
                    </div>
                  </motion.div>
                )}

                {/* ── Hero card ── */}
                <div className="glass-card p-8 flex items-center gap-8" style={{ borderColor: isAdmin ? '#ffd70040' : aRarity.color + '40', boxShadow: isAdmin ? '0 0 40px #ffd70015' : undefined }}>
                  <motion.div animate={{ boxShadow: isAdmin ? [`0 0 18px #ffd70040`, `0 0 36px #ffd70080`, `0 0 18px #ffd70040`] : [`0 0 18px ${achColor}40`, `0 0 32px ${achColor}70`, `0 0 18px ${achColor}40`] }} transition={{ duration: 2.5, repeat: Infinity }}
                    className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: achColor + '20', border: `2px solid ${isAdmin ? '#ffd70060' : achColor + '60'}` }}>
                    <AchAvatar size={36} color={isAdmin ? '#ffd700' : achColor} />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h2 className="text-2xl font-black uppercase text-white">{(user as any)?.display_name || (user as any)?.username}</h2>
                      <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-full shrink-0" style={{ background: isAdmin ? '#ffd70020' : aRarity.color + '20', color: isAdmin ? '#ffd700' : aRarity.color }}>
                        {isAdmin ? '👑 Grand Overseer · Lv 15' : `Lv ${aHero.level} · ${aHero.title}`}
                      </span>
                      {activeAura && <span className="text-xl" title={activeAura.name}>{activeAura.icon}</span>}
                    </div>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-3">{isAdmin ? 'Max Level — All rewards unlocked' : `${aHeroXP.toLocaleString()} total XP`}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${aLvlPct}%` }} transition={{ duration: 1 }}
                          style={{ background: isAdmin ? 'linear-gradient(90deg, #ffb800, #ffd700)' : `linear-gradient(90deg, ${aRarity.color}88, ${aRarity.color})` }} />
                      </div>
                      <span className="text-[9px] font-black shrink-0" style={{ color: isAdmin ? '#ffd700' : '#555' }}>{isAdmin ? '🏆 Max Level' : aNext ? `${(aNext.xp - aHeroXP).toLocaleString()} to Lv ${aNext.level}` : 'Max Level'}</span>
                    </div>
                  </div>
                </div>

                {/* ── Badges ── */}
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4 flex items-center gap-2"><Trophy size={11} /> Badges — {isAdmin ? allBadges.length : allBadges.filter(([lv]) => parseInt(lv) <= aHero.level).length} / {allBadges.length} earned</p>
                  <div className="grid grid-cols-6 gap-4">
                    {allBadges.map(([lv, r]) => {
                      const earned = isAdmin || parseInt(lv) <= aHero.level;
                      const color = isAdmin ? '#ffd700' : aRarity.color;
                      return (
                        <div key={lv} className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all"
                          style={{ background: earned ? color + '12' : 'rgba(255,255,255,0.03)', border: `1px solid ${earned ? color + '40' : 'rgba(255,255,255,0.06)'}`, opacity: earned ? 1 : 0.35 }}>
                          <span className="text-3xl" style={{ filter: earned ? 'none' : 'grayscale(1)' }}>{r.icon}</span>
                          <span className="text-[8px] font-black uppercase text-center leading-tight" style={{ color: earned ? color : '#444' }}>{r.name}</span>
                          <span className="text-[7px] font-bold" style={{ color: earned ? '#4ade80' : '#333' }}>{earned ? '✓ Earned' : `Lv ${lv}`}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Auras ── */}
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4 flex items-center gap-2">✨ Auras — {isAdmin ? allAuras.length : earnedAuras.length} / {allAuras.length} unlocked</p>
                  <div className="grid grid-cols-3 gap-4">
                    {allAuras.map(([lv, r]) => {
                      const earned = isAdmin || parseInt(lv) <= aHero.level;
                      const isActive = isAdmin ? r === allAuras[allAuras.length - 1][1] : activeAura === r;
                      const color = isAdmin ? '#ffd700' : aRarity.color;
                      return (
                        <div key={lv} className="flex items-center gap-4 p-5 rounded-2xl relative"
                          style={{ background: earned ? color + '10' : 'rgba(255,255,255,0.03)', border: `1px solid ${earned ? (isActive ? color : color + '40') : 'rgba(255,255,255,0.06)'}`, opacity: earned ? 1 : 0.35 }}>
                          {isActive && <span className="absolute top-2 right-2 text-[6px] font-black uppercase px-1.5 py-0.5 rounded-full" style={{ background: color + '30', color }}>Active</span>}
                          <span className="text-3xl" style={{ filter: earned ? 'none' : 'grayscale(1)' }}>{r.icon}</span>
                          <div>
                            <p className="text-[10px] font-black uppercase" style={{ color: earned ? color : '#444' }}>{r.name}</p>
                            <p className="text-[8px] text-gray-600">{earned ? (isActive ? 'Currently equipped' : 'Unlocked') : `Unlocks at level ${lv}`}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── XP Bonuses ── */}
                {(bonuses.daily > 0 || bonuses.training > 0 || bonuses.quest > 0) && (
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4 flex items-center gap-2">⚡ Active XP Bonuses</p>
                    <div className="flex gap-4">
                      {bonuses.daily > 0 && (
                        <div className="flex-1 p-5 rounded-2xl text-center" style={{ background: '#ffb80012', border: '1px solid #ffb80030' }}>
                          <p className="text-2xl mb-2">⚡</p>
                          <p className="text-lg font-black text-amber-400">+{bonuses.daily} XP</p>
                          <p className="text-[9px] text-gray-500 mt-1">per daily action</p>
                        </div>
                      )}
                      {bonuses.training > 0 && (
                        <div className="flex-1 p-5 rounded-2xl text-center" style={{ background: '#00f2ff12', border: '1px solid #00f2ff30' }}>
                          <p className="text-2xl mb-2">🎯</p>
                          <p className="text-lg font-black text-cyan-400">+{bonuses.training} XP</p>
                          <p className="text-[9px] text-gray-500 mt-1">per training game</p>
                        </div>
                      )}
                      {bonuses.quest > 0 && (
                        <div className="flex-1 p-5 rounded-2xl text-center" style={{ background: '#bd00ff12', border: '1px solid #bd00ff30' }}>
                          <p className="text-2xl mb-2">💎</p>
                          <p className="text-lg font-black" style={{ color: '#bd00ff' }}>+{bonuses.quest} XP</p>
                          <p className="text-[9px] text-gray-500 mt-1">per quest claimed</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Level Roadmap ── */}
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6 flex items-center gap-2"><Star size={11} /> Level Roadmap</p>
                  <div className="relative">
                    <div className="absolute left-[19px] top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, #bd00ff60, #00f2ff60)' }} />
                    <div className="space-y-1.5">
                      {LEVEL_DATA.map((ld) => {
                        const reward = LEVEL_REWARDS[ld.level];
                        const isCurrentLevel = isAdmin ? ld.level === 15 : ld.level === aHero.level;
                        const isPast = isAdmin ? ld.level < 15 : ld.level < aHero.level;
                        const isFuture = !isAdmin && ld.level > aHero.level;
                        const nodeColor = isPast ? '#4ade80' : isCurrentLevel ? (isAdmin ? '#ffd700' : aRarity.color) : '#1a1a2a';
                        return (
                          <div key={ld.level} className="flex items-center gap-4 py-1.5 pl-1">
                            <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-black text-[10px] z-10 border-2 transition-all"
                              style={{ background: nodeColor, borderColor: isPast ? '#4ade80' : isCurrentLevel ? (isAdmin ? '#ffd700' : aRarity.color) : '#2a2a3a', color: isPast || isCurrentLevel ? '#000' : '#333' }}>
                              {isPast ? '✓' : ld.level}
                            </div>
                            <div className="flex-1 flex items-center gap-3 py-2 px-4 rounded-xl"
                              style={{ background: isCurrentLevel ? (isAdmin ? '#ffd70010' : aRarity.color + '10') : isFuture ? 'rgba(255,255,255,0.02)' : 'rgba(74,222,128,0.05)', border: `1px solid ${isCurrentLevel ? (isAdmin ? '#ffd70030' : aRarity.color + '30') : isFuture ? 'rgba(255,255,255,0.04)' : 'rgba(74,222,128,0.15)'}` }}>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black uppercase" style={{ color: isPast ? '#4ade80' : isCurrentLevel ? (isAdmin ? '#ffd700' : aRarity.color) : '#333' }}>{ld.title}</span>
                                  {isCurrentLevel && <span className="text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full" style={{ background: (isAdmin ? '#ffd700' : aRarity.color) + '30', color: isAdmin ? '#ffd700' : aRarity.color }}>You</span>}
                                </div>
                                <span className="text-[8px] text-gray-600">{ld.xp.toLocaleString()} XP</span>
                              </div>
                              {reward && (
                                <div className="flex items-center gap-2">
                                  <span className="text-lg" style={{ filter: isFuture ? 'grayscale(1)' : 'none', opacity: isFuture ? 0.3 : 1 }}>{reward.icon}</span>
                                  <span className="text-[8px] font-black" style={{ color: isFuture ? '#333' : isPast ? '#4ade80' : (isAdmin ? '#ffd700' : aRarity.color) }}>{reward.name}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </motion.div>
            );
          })()}

          {activeTab === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              <div className="grid grid-cols-3 gap-8">
                {[{ l: 'Heroes', v: adminStats?.total_users, i: Users }, { l: 'Potions', v: adminStats?.total_potions, i: Beaker }, { l: 'Status', v: adminStats?.kingdom_status, i: Shield }].map((s, i) => (
                  <div key={i} className="glass-card p-8 text-center"><div className="p-4 inline-block bg-white/5 rounded-full mb-4"><s.i size={32} /></div><p className="text-[10px] font-black uppercase text-gray-500 mb-2">{s.l}</p><h3 className="text-3xl font-black">{s.v || '...'}</h3></div>
                ))}
              </div>
              <div className="glass-card p-8 border-danger-red/10">
                <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-3 text-danger-red"><Radar size={20} /> Breach Control</h3>
                <p className="text-[10px] font-black uppercase text-gray-500 mb-6">Auto-scan runs every 24h. Trigger a manual scan of all vault entries now.</p>
                <button
                  disabled={scanning}
                  onClick={async () => {
                    setScanning(true);
                    try {
                      const res = await axios.post(`${API_BASE}/admin/breach-scan`, {}, { headers: { Authorization: `Bearer ${token}` } });
                      setScanResult(res.data);
                    } catch { showToast('Scan failed. Check backend connection.', 'error'); }
                    finally { setScanning(false); }
                  }}
                  className="px-6 py-3 bg-danger-red/10 text-danger-red border border-danger-red/20 rounded-xl font-black uppercase text-[10px] hover:bg-danger-red hover:text-white transition-all flex items-center gap-2 disabled:opacity-40"
                >
                  {scanning ? <RefreshCw size={14} className="animate-spin" /> : <Radar size={14} />}
                  {scanning ? 'Scouting the Underdark...' : 'Run Breach Scan Now'}
                </button>
              </div>
              <div className="glass-card p-10">
                <h3 className="text-xl font-black uppercase mb-8 flex items-center gap-3 text-neon-cyan"><Users /> Hall of Heroes</h3>
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black uppercase text-gray-500 border-b border-white/5">
                    <tr><th className="pb-6">Hero</th><th className="pb-6">Role</th><th className="pb-6 text-right">Action</th></tr>
                  </thead>
                  <tbody className="font-bold text-sm">
                    {allUsers.map((u: any) => (
                      <tr key={u.id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-all">
                        <td className="py-6 flex items-center gap-3"><div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center"><User size={16} /></div>{u.display_name || u.username}</td>
                        <td><span className={`px-3 py-1 rounded-full text-[8px] uppercase font-black ${u.role === 'admin' ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-white/5 text-gray-500'}`}>{u.role}</span></td>
                        <td className="text-right">{u.username !== (user as any)?.username && <button onClick={() => banishUser(u.id, u.username)} className="p-3 bg-danger-red/10 text-danger-red rounded-lg hover:bg-danger-red hover:text-white"><Skull size={18} /></button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Breach Alert Modal */}
      <AnimatePresence>
        {breachAlert && (() => {
          const alertItem = vaultItems.find((i: any) => i.id === breachAlert.itemId) as any;
          const daysOld = alertItem ? getDaysOld(alertItem.created_at) : null;
          const severity =
            breachAlert.count >= 1_000_000 ? { label: 'Catastrophic', color: '#ff003c' } :
            breachAlert.count >= 100_000  ? { label: 'Critical',      color: '#ff2d55' } :
            breachAlert.count >= 10_000   ? { label: 'Severe',        color: '#ff6b35' } :
            breachAlert.count >= 1_000    ? { label: 'High',          color: '#ffb800' } :
            breachAlert.count >= 100      ? { label: 'Moderate',      color: '#ffd700' } :
                                            { label: 'Low',            color: '#a8e063' };
          return (
            <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 10001, pointerEvents: 'none' }}>
              <motion.div
                initial={{ scale: 0.85, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.85, y: 30, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                style={{ background: 'rgba(10,3,3,0.98)', border: '1px solid rgba(255,0,60,0.4)', borderRadius: '14px', width: '320px', position: 'relative', overflow: 'hidden', boxShadow: '0 0 40px rgba(255,0,60,0.2), 0 8px 32px rgba(0,0,0,0.6)', pointerEvents: 'auto' }}
                className="p-6 text-center"
              >
                {/* Pulsing red vignette */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{ opacity: [0.05, 0.14, 0.05] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,0,60,0.5) 0%, transparent 70%)' }}
                />
                {/* Top sweep bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                    style={{ width: '40%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,0,60,0.9), transparent)' }}
                  />
                </div>

                <div className="relative">
                  {/* Skull with pulse ring */}
                  <div className="relative inline-flex mb-3 items-center justify-center">
                    <motion.div
                      className="absolute rounded-full"
                      animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                      style={{ width: 64, height: 64, background: 'rgba(255,0,60,0.25)' }}
                    />
                    <motion.div
                      animate={{ rotate: [0, -4, 4, -4, 0] }}
                      transition={{ duration: 0.35, repeat: Infinity, repeatDelay: 2.5 }}
                      className="p-3 rounded-xl"
                      style={{ background: 'rgba(255,0,60,0.12)', color: '#ff003c' }}
                    >
                      <Skull size={32} />
                    </motion.div>
                  </div>

                  <p className="text-[7px] font-black uppercase tracking-[0.5em] mb-1" style={{ color: 'rgba(255,0,60,0.55)' }}>
                    ⚠ Breach Detected ⚠
                  </p>
                  <h2 className="text-xl font-black uppercase tracking-tight text-white leading-none mb-0.5">Your Secret</h2>
                  <h2 className="text-xl font-black uppercase tracking-tight leading-none mb-4" style={{ color: '#ff003c' }}>Has Been Seen</h2>

                  <div className="inline-block px-3 py-1 rounded-lg border mb-4" style={{ borderColor: 'rgba(255,0,60,0.35)', background: 'rgba(255,0,60,0.1)' }}>
                    <span className="font-black uppercase text-xs tracking-widest" style={{ color: '#ff003c' }}>{breachAlert.serviceName}</span>
                  </div>

                  <div className="rounded-xl border p-3 mb-4" style={{ background: 'rgba(255,0,60,0.08)', borderColor: 'rgba(255,0,60,0.2)' }}>
                    <p className="text-[7px] font-black uppercase tracking-widest mb-1" style={{ color: 'rgba(255,0,60,0.5)' }}>Dark Web Exposures</p>
                    <p className="text-3xl font-black tabular-nums" style={{ color: '#ff003c', textShadow: '0 0 20px rgba(255,0,60,0.5)' }}>
                      {breachAlert.count.toLocaleString()}
                    </p>
                  </div>

                  <p className="text-[10px] text-gray-500 mb-4 leading-relaxed">
                    Enemies may already hold this secret — forge a new one.
                  </p>

                  {/* More Info toggle */}
                  <button
                    onClick={() => setBreachDetailsOpen(o => !o)}
                    className="w-full flex items-center justify-center gap-1 py-2 mb-4 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                    style={{ color: 'rgba(255,0,60,0.6)', background: 'rgba(255,0,60,0.06)', border: '1px solid rgba(255,0,60,0.15)' }}
                  >
                    <ShieldAlert size={11} />
                    {breachDetailsOpen ? 'Hide Details' : 'More Information'}
                    <motion.span animate={{ rotate: breachDetailsOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="inline-block">
                      <ChevronDown size={11} />
                    </motion.span>
                  </button>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {breachDetailsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="space-y-3 mb-4 text-left">
                          {/* Severity */}
                          <div className="rounded-lg p-3 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
                            <p className="text-[7px] font-black uppercase tracking-widest text-gray-600 mb-1">Threat Level</p>
                            <div className="flex items-center gap-2">
                              <motion.div
                                animate={{ opacity: [1, 0.4, 1] }}
                                transition={{ duration: 1.2, repeat: Infinity }}
                                className="w-2 h-2 rounded-full"
                                style={{ background: severity.color }}
                              />
                              <span className="text-sm font-black uppercase" style={{ color: severity.color }}>{severity.label}</span>
                            </div>
                            <p className="text-[9px] text-gray-500 mt-2 leading-relaxed">
                              {breachAlert.count >= 1_000_000
                                ? `This password has been leaked ${breachAlert.count.toLocaleString()} times — it lives in every hacker's wordlist. Automated attack tools will crack an account using this password in seconds. Treat it as already stolen.`
                                : breachAlert.count >= 100_000
                                ? `Seen ${breachAlert.count.toLocaleString()} times across major breach dumps. It appears in widely distributed databases that attackers actively download and use in credential-stuffing attacks against popular services.`
                                : breachAlert.count >= 10_000
                                ? `Found ${breachAlert.count.toLocaleString()} times in known breach data. This password has spread across enough dumps that any serious attacker's list will include it. Don't rely on it for any account.`
                                : breachAlert.count >= 1_000
                                ? `Exposed ${breachAlert.count.toLocaleString()} times. It has appeared in multiple breach datasets — targeted attacks and credential-stuffing tools may already carry it.`
                                : breachAlert.count >= 100
                                ? `Spotted ${breachAlert.count.toLocaleString()} times in breach records. It has leaked at least once and is circulating in niche breach collections. Still a real risk.`
                                : `Appeared ${breachAlert.count.toLocaleString()} time${breachAlert.count > 1 ? 's' : ''} in known breach data. Uncommon, but confirmed compromised — it must still be rotated immediately.`}
                            </p>
                          </div>

                          {/* Stats row */}
                          <div className="grid grid-cols-2 gap-2">
                            {daysOld !== null && (
                              <div className="rounded-lg p-2 border text-center" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
                                <p className="text-[7px] font-black uppercase tracking-widest text-gray-600 mb-0.5">Password Age</p>
                                <p className="text-base font-black text-white">{daysOld}d</p>
                              </div>
                            )}
                            {alertItem?.armor_class && (
                              <div className="rounded-lg p-2 border text-center" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
                                <p className="text-[7px] font-black uppercase tracking-widest text-gray-600 mb-0.5">Armor Class</p>
                                <p className="text-base font-black text-white">{alertItem.armor_class}</p>
                              </div>
                            )}
                          </div>

                          {/* Action checklist */}
                          <div className="rounded-lg p-3 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
                            <p className="text-[7px] font-black uppercase tracking-widest text-gray-600 mb-2">Recommended Actions</p>
                            {[
                              'Rotate this password immediately',
                              'Use a unique password for this service',
                              'Enable 2FA if available',
                              'Never reuse this password elsewhere',
                            ].map(action => (
                              <div key={action} className="flex items-start gap-2 mb-1 last:mb-0">
                                <span style={{ color: '#ff003c', flexShrink: 0, marginTop: 1 }}>›</span>
                                <span className="text-[9px] text-gray-400 leading-tight">{action}</span>
                              </div>
                            ))}
                          </div>

                          {/* How it works */}
                          <div className="rounded-lg p-3 border" style={{ background: 'rgba(0,242,255,0.03)', borderColor: 'rgba(0,242,255,0.1)' }}>
                            <p className="text-[7px] font-black uppercase tracking-widest mb-1" style={{ color: 'rgba(0,242,255,0.5)' }}>How We Check</p>
                            <p className="text-[9px] leading-relaxed" style={{ color: 'rgba(0,242,255,0.45)' }}>
                              Only the first 5 characters of your password's SHA-1 hash are sent to HaveIBeenPwned. Your actual password never leaves this device.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const item = vaultItems.find((i: any) => i.id === breachAlert.itemId);
                        setBreachAlert(null);
                        if (item) {
                          navigateTab('vault');
                          setEditingId(breachAlert.itemId);
                          setEditService((item as any).service_name);
                          setEditPassword('');
                          setEditNotes((item as any).notes || '');
                        }
                      }}
                      className="flex-1 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all flex items-center justify-center gap-1"
                      style={{ background: '#ff003c', color: '#fff' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,0,60,0.75)')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#ff003c')}
                    >
                      <RefreshCw size={12} /> Rotate Now
                    </button>
                    <button
                      onClick={() => setBreachAlert(null)}
                      className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 font-black uppercase text-[9px] tracking-widest hover:bg-white/10 transition-all"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Scan Result Modal */}
      <AnimatePresence>
        {scanResult && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', pointerEvents: 'auto', cursor: 'default' }}
            onClick={() => { setScanResult(null); fetchAdminStats(); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{ background: 'rgba(18,18,22,0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', pointerEvents: 'auto', position: 'relative', maxWidth: '448px', width: '100%' }}
              className="p-12 text-center overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className={`absolute inset-0 opacity-5 ${scanResult.compromised > 0 ? 'bg-danger-red' : 'bg-neon-cyan'}`} />
              <div className={`p-5 inline-flex rounded-2xl mb-6 ${scanResult.compromised > 0 ? 'bg-danger-red/10 text-danger-red' : 'bg-neon-cyan/10 text-neon-cyan'}`}>
                {scanResult.compromised > 0 ? <Skull size={48} /> : <Shield size={48} />}
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">Underdark Scout Report</p>
              <h2 className={`text-3xl font-black uppercase tracking-tight mb-2 ${scanResult.compromised > 0 ? 'text-danger-red' : 'text-neon-cyan'}`}>
                {scanResult.compromised > 0 ? 'Demons Detected' : 'Kingdom Secure'}
              </h2>
              <p className="text-gray-500 text-xs mb-10">
                {scanResult.compromised > 0
                  ? `${scanResult.compromised} of your secrets have been spotted in the dark web.`
                  : 'No traces of your secrets were found in the darkness.'}
              </p>
              <div className="grid grid-cols-3 gap-4 mb-10">
                {[
                  { label: 'Scouted', value: scanResult.total, color: 'text-white' },
                  { label: 'Compromised', value: scanResult.compromised, color: 'text-danger-red' },
                  { label: 'Safe', value: scanResult.safe, color: 'text-neon-cyan' },
                ].map(s => (
                  <div key={s.label} className="p-4 bg-white/5 rounded-xl">
                    <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                    <p className="text-[8px] font-black uppercase text-gray-600 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <button
                style={{ pointerEvents: 'auto', cursor: 'pointer', position: 'relative', zIndex: 1 }}
                onClick={() => {
                  if (scanResult.compromised > 0) navigateTab('vault');
                  setScanResult(null);
                  fetchAdminStats();
                }}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${scanResult.compromised > 0 ? 'bg-danger-red/10 text-danger-red hover:bg-danger-red hover:text-white border border-danger-red/20' : 'bg-neon-cyan text-black hover:opacity-90'}`}
              >
                {scanResult.compromised > 0 ? 'Understood — Check My Vault' : 'Return to the Kingdom'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Onboarding Quest Modal */}
      <AnimatePresence>
        {showOnboarding && (() => {
          const steps = [
            { icon: FlaskConical, color: '#00f2ff', title: 'The Alchemist\'s Lab', body: 'Brew powerful password potions using the Lab. Choose your potion length and complexity — or forge memorable Rune Words. Your first line of defence.' },
            { icon: Scroll, color: '#bd00ff', title: 'The Secret Vault', body: 'Every secret you forge is encrypted with AES-256 and stored safely in your Vault. Add notes, copy with one click, and edit any time.' },
            { icon: Radar, color: '#ff003c', title: 'Breach Scouting', body: 'Your vault automatically checks passwords against known data breaches every 24 hours. A red badge on the Vault tab means something needs your attention.' },
          ];
          const step = steps[onboardStep];
          const StepIcon = step.icon;
          const isLast = onboardStep === steps.length - 1;
          const dismiss = () => { localStorage.setItem('vq_onboarded', 'true'); setShowOnboarding(false); };
          return (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
              <motion.div
                key={onboardStep}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}
                style={{ background: 'rgba(18,18,22,0.99)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', maxWidth: '420px', width: '100%' }}
                className="p-10 text-center"
              >
                <div className="flex justify-center gap-2 mb-8">
                  {steps.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all ${i === onboardStep ? 'w-8 bg-neon-cyan' : 'w-4 bg-white/10'}`} />
                  ))}
                </div>
                <div className="p-5 inline-flex rounded-2xl mb-6" style={{ backgroundColor: `${step.color}15`, color: step.color }}>
                  <StepIcon size={44} />
                </div>
                <h3 className="text-xl font-black uppercase mb-3" style={{ color: step.color }}>{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-10">{step.body}</p>
                <div className="flex gap-3">
                  {onboardStep > 0 && (
                    <button onClick={() => setOnboardStep(s => s - 1)} className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 font-black uppercase text-[10px] hover:bg-white/10 transition-all">Back</button>
                  )}
                  <button
                    onClick={() => isLast ? dismiss() : setOnboardStep(s => s + 1)}
                    className="flex-1 py-3 rounded-xl bg-neon-cyan text-black font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                  >
                    {isLast ? 'Begin Your Quest' : <><span>Next</span><ArrowRight size={12} /></>}
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* ── LEVEL-UP MODAL ── */}
      <AnimatePresence>
        {levelUpModal && (() => {
          const reward = LEVEL_REWARDS[levelUpModal.level];
          const auraColor = levelUpModal.level >= 15 ? '#ffd700' : levelUpModal.level >= 8 ? '#ffd700' : '#bd00ff';
          return (
            <motion.div key="levelup-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-6"
              style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(16px)' }}
            >
              <motion.div initial={{ opacity: 0, scale: 0.8, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 40 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="relative w-full max-w-sm rounded-2xl overflow-hidden text-center"
                style={{ background: 'linear-gradient(160deg, #0a0a14 0%, #12001f 100%)', border: `2px solid ${auraColor}60` }}
              >
                {/* Glow ring */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${auraColor}20 0%, transparent 70%)` }} />

                {/* Stars burst */}
                <div className="absolute top-0 left-0 right-0 flex justify-center pt-4 gap-2 pointer-events-none">
                  {['✦','✧','✦','✧','✦'].map((s, i) => (
                    <motion.span key={i} initial={{ opacity: 0, y: -10, scale: 0 }} animate={{ opacity: [0, 1, 0], y: [-10, -30, -50], scale: [0, 1, 0.5] }}
                      transition={{ delay: i * 0.1, duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
                      className="text-xs" style={{ color: auraColor }}>
                      {s}
                    </motion.span>
                  ))}
                </div>

                <div className="px-8 pt-12 pb-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
                    className="text-7xl mb-4 inline-block">
                    ⬆️
                  </motion.div>

                  <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-1" style={{ color: auraColor }}>Level Up!</p>
                  <h2 className="text-4xl font-black text-white mb-1">Level {levelUpModal.level}</h2>
                  <p className="text-base font-bold mb-6" style={{ color: auraColor }}>{levelUpModal.title}</p>

                  {reward ? (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                      className="rounded-xl p-4 mb-6 text-left"
                      style={{ background: `${auraColor}15`, border: `1px solid ${auraColor}40` }}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{reward.icon}</span>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: auraColor }}>Reward Unlocked</p>
                          <p className="text-sm font-black text-white">{reward.name}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">{reward.desc}</p>
                    </motion.div>
                  ) : (
                    <div className="mb-6" />
                  )}

                  <motion.button
                    onClick={() => setLevelUpModal(null)}
                    className="cursor-pointer w-full py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all"
                    style={{ background: auraColor, color: '#000' }}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    Claim Reward ✓
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ── PROFILE MODAL ── */}
      <AnimatePresence>
        {profileOpen && (() => {
          const pHeroXP = heroTotalXP;
          const isAdmin = (user as any)?.role === 'admin';
          const pHeroRaw = getHeroLevel(pHeroXP);
          const pHero = isAdmin ? { ...LEVEL_DATA[14] } : pHeroRaw;
          const pNext = isAdmin ? null : getNextHeroLevel(pHeroXP);
          const pHeroR = isAdmin ? RARITY['Legendary'] : RARITY[pHeroRaw.level >= 9 ? 'Legendary' : pHeroRaw.level >= 6 ? 'Epic' : pHeroRaw.level >= 3 ? 'Rare' : 'Common'];
          const pLvlPct = isAdmin ? 100 : (pNext ? Math.round(((pHeroXP - pHeroRaw.xp) / (pNext.xp - pHeroRaw.xp)) * 100) : 100);
          const allPBadges = Object.entries(LEVEL_REWARDS).filter(([, r]) => r.type === 'badge');
          const earnedAuras = Object.entries(LEVEL_REWARDS).filter(([lv]) => parseInt(lv) <= pHero.level && LEVEL_REWARDS[parseInt(lv)].type === 'aura');
          const activeAura = isAdmin ? Object.entries(LEVEL_REWARDS).filter(([, r]) => r.type === 'aura').at(-1)?.[1] ?? null : (earnedAuras.length > 0 ? earnedAuras[earnedAuras.length - 1][1] : null);
          const ProfileAvatar = user && AVATARS.find(a => a.id === (user as any).avatar_url)?.icon || User;
          const profileColor = user && AVATARS.find(a => a.id === (user as any).avatar_url)?.color || '#00f2ff';
          return (
            <motion.div key="profile-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-6"
              style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(14px)' }}
              onClick={(e) => { if (e.target === e.currentTarget) setProfileOpen(false); }}>
              <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                className="w-full max-w-md rounded-2xl overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #0a0a14 0%, #12001f 100%)', border: `1px solid ${pHeroR.color}40` }}>
                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${pHeroR.color}, ${profileColor})` }} />
                <div className="p-6 space-y-5">
                  {/* Close */}
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Hero Profile</p>
                    <button onClick={() => setProfileOpen(false)}
                      className="cursor-pointer w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all font-black text-sm">✕</button>
                  </div>
                  {/* Avatar + identity */}
                  <div className="flex items-center gap-4">
                    <motion.div animate={{ boxShadow: [`0 0 16px ${profileColor}40`, `0 0 28px ${profileColor}70`, `0 0 16px ${profileColor}40`] }} transition={{ duration: 2.5, repeat: Infinity }}
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: profileColor + '20', border: `2px solid ${profileColor}60` }}>
                      <ProfileAvatar size={28} color={profileColor} />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-black uppercase text-white truncate">{(user as any)?.display_name || (user as any)?.username}</h2>
                      <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-2 truncate">{(user as any)?.username}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full" style={{ background: pHeroR.color + '20', color: pHeroR.color }}>Lv {pHero.level} · {pHero.title}</span>
                        {isAdmin && <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full" style={{ background: '#ffd70020', color: '#ffd700' }}>👑 Admin</span>}
                        {activeAura && <span className="text-base" title={activeAura.name}>{activeAura.icon}</span>}
                      </div>
                    </div>
                  </div>
                  {/* XP bar */}
                  <div>
                    <div className="flex justify-between text-[8px] font-black uppercase text-gray-600 mb-1.5">
                      <span>{pHeroXP.toLocaleString()} XP</span>
                      <span>{pNext ? `${(pNext.xp - pHeroXP).toLocaleString()} to Lv ${pNext.level}` : 'Max Level'}</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${pLvlPct}%` }} transition={{ duration: 1 }} style={{ background: `linear-gradient(90deg, ${pHeroR.color}88, ${pHeroR.color})` }} />
                    </div>
                  </div>
                  {/* Badges */}
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-[0.25em] text-gray-500 mb-2 flex items-center gap-1.5">
                      <Trophy size={9} /> Badges
                      {isAdmin && <span className="ml-1 text-yellow-600">⚜️ Grand Overseer</span>}
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {allPBadges.map(([lv, r]) => {
                        const earned = isAdmin || parseInt(lv) <= pHero.level;
                        return (
                          <div key={lv} className="flex flex-col items-center gap-1 p-2.5 rounded-xl"
                            style={{ background: earned ? pHeroR.color + '12' : 'rgba(255,255,255,0.03)', border: `1px solid ${earned ? pHeroR.color + '35' : 'rgba(255,255,255,0.05)'}`, opacity: earned ? 1 : 0.35 }}>
                            <span className="text-xl" style={{ filter: earned ? 'none' : 'grayscale(1)' }}>{r.icon}</span>
                            <span className="text-[7px] font-black uppercase text-center leading-tight" style={{ color: earned ? pHeroR.color : '#444' }}>{r.name}</span>
                            {!earned && <span className="text-[6px] text-gray-700">Lv {lv}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* CTA buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button onClick={() => { setProfileOpen(false); navigateTab('achievements'); }}
                      className="cursor-pointer py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all flex items-center justify-center gap-1.5"
                      style={{ background: pHeroR.color + '18', color: pHeroR.color, border: `1px solid ${pHeroR.color}40` }}>
                      <Trophy size={11} /> Achievements
                    </button>
                    <button onClick={() => { setProfileOpen(false); navigateTab('quests'); }}
                      className="cursor-pointer py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all flex items-center justify-center gap-1.5 bg-white/5 text-gray-400 hover:text-white border border-white/10">
                      <Zap size={11} /> Quests
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ── REWARDS ROADMAP MODAL ── */}
      <AnimatePresence>
        {rewardsRoadmapOpen && (() => {
          const rHero = getHeroLevel(heroTotalXP);
          const rHeroR = RARITY[rHero.level >= 9 ? 'Legendary' : rHero.level >= 6 ? 'Epic' : rHero.level >= 3 ? 'Rare' : 'Common'];
          return (
            <motion.div key="rewards-roadmap-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[65] flex items-center justify-center p-6 overflow-y-auto"
              style={{ background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(14px)' }}
              onClick={(e) => { if (e.target === e.currentTarget) setRewardsRoadmapOpen(false); }}>
              <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24 }}
                transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                className="w-full max-w-md rounded-2xl overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #0a0a14 0%, #12001f 100%)', border: `1px solid ${rHeroR.color}40` }}>
                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, #bd00ff, #00f2ff)` }} />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-0.5">Level Rewards</p>
                      <h2 className="text-lg font-black uppercase text-white">Rewards Roadmap</h2>
                    </div>
                    <button onClick={() => setRewardsRoadmapOpen(false)}
                      className="cursor-pointer w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all font-black text-sm">✕</button>
                  </div>

                  <div className="relative">
                    <div className="absolute left-[19px] top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, #bd00ff60, #00f2ff60)' }} />
                    <div className="space-y-1.5">
                      {LEVEL_DATA.map((ld, i) => {
                        const reward = LEVEL_REWARDS[ld.level];
                        const isCurrentLevel = ld.level === rHero.level;
                        const isPast = ld.level < rHero.level;
                        const isFuture = ld.level > rHero.level;
                        const nodeColor = isPast ? '#4ade80' : isCurrentLevel ? rHeroR.color : '#1a1a2a';
                        const nodeBorder = isPast ? '#4ade80' : isCurrentLevel ? rHeroR.color : '#2a2a3a';
                        return (
                          <motion.div key={ld.level}
                            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.025 }}
                            className="relative flex items-center gap-4 py-2">
                            {/* Node */}
                            <div className="shrink-0 w-10 flex justify-center">
                              <motion.div
                                animate={isCurrentLevel ? { boxShadow: [`0 0 6px ${rHeroR.color}60`, `0 0 14px ${rHeroR.color}90`, `0 0 6px ${rHeroR.color}60`] } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-5 h-5 rounded-full flex items-center justify-center border-2 text-[7px] font-black"
                                style={{ backgroundColor: nodeColor + '20', borderColor: nodeBorder, color: isPast ? '#4ade80' : isCurrentLevel ? rHeroR.color : '#444' }}>
                                {isPast ? '✓' : ld.level}
                              </motion.div>
                            </div>
                            {/* Content row */}
                            <div className="flex-1 flex items-center gap-2 min-w-0">
                              <div className="flex-1 min-w-0">
                                <span className="text-[8px] font-black uppercase" style={{ color: isFuture ? '#333' : isPast ? '#4ade80' : rHeroR.color }}>{ld.title}</span>
                                <span className="text-[7px] text-gray-700 ml-2">{ld.xp.toLocaleString()} XP</span>
                              </div>
                              {reward ? (
                                <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-lg"
                                  style={{ background: isFuture ? 'rgba(255,255,255,0.03)' : rHeroR.color + '15', border: `1px solid ${isFuture ? 'rgba(255,255,255,0.05)' : rHeroR.color + '30'}` }}>
                                  <span style={{ filter: isFuture ? 'grayscale(1) opacity(0.4)' : 'none' }}>{reward.icon}</span>
                                  <span className="text-[7px] font-black" style={{ color: isFuture ? '#333' : isPast ? '#4ade80' : rHeroR.color }}>{reward.name}</span>
                                </div>
                              ) : (
                                <span className="text-[7px] text-gray-800 px-2">—</span>
                              )}
                              {isCurrentLevel && (
                                <span className="text-[6px] font-black uppercase px-1.5 py-0.5 rounded-full border shrink-0"
                                  style={{ color: rHeroR.color, borderColor: rHeroR.color + '50', background: rHeroR.color + '15' }}>You</span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>


      {/* ── MINI-GAME OVERLAY ── */}
      <AnimatePresence>
        {activeMiniGame && (
          <motion.div key="minigame-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
            style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }}>
            <div className="min-h-full flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 24 }}
                transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                className="w-full max-w-xl">
                <AnimatePresence mode="wait">
                    {/* ─ PASSWORD DUEL ─ */}
                    {activeMiniGame === 'duel' && (
                      <motion.div key="duel-active" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 rounded-full text-[8px] font-black uppercase text-danger-red bg-danger-red/10">Password Duel</span>
                            <span className="text-white font-black uppercase text-sm">{duelDone ? 'Results' : `Round ${duelRound + 1} / ${duelPairs.length}`}</span>
                          </div>
                          <button onClick={() => setActiveMiniGame(null)} className="text-gray-600 hover:text-white font-black uppercase text-[9px] tracking-widest transition-colors">← Exit</button>
                        </div>
                        {!duelDone ? (
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 text-center mb-5">Which password is stronger?</p>
                            <div className="grid grid-cols-2 gap-5 mb-4">
                              {(['a', 'b'] as const).map(side => {
                                const pwd = duelPairs[duelRound]?.[side] || '';
                                const isStronger = duelPairs[duelRound]?.stronger === side;
                                const picked = duelPicked === side;
                                const revealed = duelPicked !== null;
                                return (
                                  <motion.button key={side} whileHover={!revealed ? { scale: 1.02 } : {}} whileTap={!revealed ? { scale: 0.97 } : {}}
                                    onClick={() => { if (duelPicked !== null) return; setDuelPicked(side); if (isStronger) setDuelScore(prev => prev + 1); }}
                                    className="glass-card p-6 flex flex-col items-center gap-3 cursor-pointer transition-all"
                                    style={{ borderColor: !revealed ? 'rgba(255,255,255,0.08)' : isStronger ? 'rgba(74,222,128,0.5)' : picked ? 'rgba(255,0,60,0.5)' : 'rgba(255,255,255,0.04)', background: !revealed ? 'rgba(255,255,255,0.03)' : isStronger ? 'rgba(0,255,100,0.06)' : picked ? 'rgba(255,0,60,0.06)' : 'rgba(255,255,255,0.01)' }}>
                                    <span className="text-[9px] font-black uppercase text-gray-600">Option {side.toUpperCase()}</span>
                                    <code className="text-sm text-white font-mono text-center break-all leading-relaxed">{pwd}</code>
                                    {revealed && <span className="text-[9px] font-black uppercase" style={{ color: isStronger ? '#4ade80' : picked ? '#ff003c' : '#444' }}>{isStronger ? '✓ Stronger' : picked ? '✗ Weaker' : ''}</span>}
                                  </motion.button>
                                );
                              })}
                            </div>
                            {duelPicked && (
                              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                                <div><p className="text-[8px] font-black uppercase text-gray-600 mb-1">Tip</p><p className="text-[10px] text-gray-400">{duelPairs[duelRound]?.hint}</p></div>
                                <button onClick={() => { if (duelRound + 1 >= duelPairs.length) { setDuelDone(true); } else { setDuelRound(r => r + 1); setDuelPicked(null); } }}
                                  className="ml-6 shrink-0 px-5 py-2.5 rounded-xl bg-danger-red/20 text-danger-red font-black uppercase text-[9px] tracking-widest hover:bg-danger-red hover:text-white transition-all">
                                  {duelRound + 1 >= duelPairs.length ? 'Finish' : 'Next →'}
                                </button>
                              </motion.div>
                            )}
                            <div className="mt-3 flex justify-between text-[8px] font-black uppercase text-gray-600">
                              <span>Score</span><span style={{ color: '#ff003c' }}>{duelScore} / {duelRound + (duelPicked ? 1 : 0)}</span>
                            </div>
                          </div>
                        ) : (
                          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 text-center" style={{ borderColor: 'rgba(255,62,62,0.25)' }}>
                            <div className="p-5 inline-flex rounded-2xl mb-4" style={{ background: 'rgba(255,0,60,0.1)', color: '#ff003c' }}><Shield size={40} /></div>
                            <h3 className="text-2xl font-black uppercase text-white mb-2">Duel Complete!</h3>
                            <p className="text-4xl font-black mb-1" style={{ color: '#ff003c' }}>{duelScore}<span className="text-xl text-gray-600"> / {duelPairs.length}</span></p>
                            <p className="text-gray-500 text-sm mb-6">{isDailyDone('duel') ? 'XP already earned today — come back tomorrow!' : `+${duelScore * 10} XP awarded`}</p>
                            <button onClick={() => setActiveMiniGame(null)} className="px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest bg-danger-red/20 text-danger-red hover:bg-danger-red hover:text-white transition-all">Back to Training</button>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {/* ─ SPEED RATER ─ */}
                    {activeMiniGame === 'speed' && (
                      <motion.div key="speed-active" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 rounded-full text-[8px] font-black uppercase text-safety-amber bg-safety-amber/10">Speed Rater</span>
                            <span className="text-white font-black uppercase text-sm">{speedDone ? 'Results' : `Round ${speedRound + 1} / ${speedItems.length}`}</span>
                          </div>
                          <button onClick={() => setActiveMiniGame(null)} className="text-gray-600 hover:text-white font-black uppercase text-[9px] tracking-widest transition-colors">← Exit</button>
                        </div>
                        {!speedDone ? (
                          <div className="glass-card p-8" style={{ borderColor: 'rgba(255,184,0,0.2)' }}>
                            <div className="mb-5">
                              <div className="flex justify-between text-[8px] font-black uppercase text-gray-600 mb-1"><span>Time</span><span>{speedPicked !== null ? '—' : `${speedTime}s`}</span></div>
                              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                {speedPicked === null && <motion.div className="h-full rounded-full" key={`timer-${speedRound}`} initial={{ width: '100%' }} animate={{ width: '0%' }} transition={{ duration: 4, ease: 'linear' }} style={{ background: speedTime > 2 ? '#ffb800' : '#ff003c' }} />}
                              </div>
                            </div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 text-center mb-3">Rate this password</p>
                            <code className="block text-2xl font-mono text-white text-center mb-6 break-all">{speedItems[speedRound]?.pwd}</code>
                            <div className="grid grid-cols-4 gap-3 mb-4">
                              {(['Trash', 'Weak', 'Decent', 'Strong'] as SpeedRating[]).map(rating => {
                                const correct = speedItems[speedRound]?.rating;
                                const isCorrect = rating === correct;
                                const isSelected = speedPicked === rating;
                                const revealed = speedPicked !== null;
                                const ratingColors: Record<SpeedRating, string> = { Trash: '#ff003c', Weak: '#ffb800', Decent: '#00ff41', Strong: '#00f2ff' };
                                return (
                                  <motion.button key={rating} whileHover={!revealed ? { scale: 1.04 } : {}}
                                    onClick={() => { if (revealed) return; setSpeedPicked(rating); if (rating === correct) setSpeedScore(prev => prev + 1); }}
                                    className="py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all border"
                                    style={{ background: !revealed ? 'rgba(255,255,255,0.05)' : isCorrect ? ratingColors[rating] + '20' : isSelected ? 'rgba(255,0,60,0.1)' : 'rgba(255,255,255,0.02)', borderColor: !revealed ? 'rgba(255,255,255,0.1)' : isCorrect ? ratingColors[rating] : isSelected ? '#ff003c' : 'rgba(255,255,255,0.04)', color: !revealed ? '#888' : isCorrect ? ratingColors[rating] : isSelected ? '#ff003c' : '#444' }}>
                                    {rating}
                                  </motion.button>
                                );
                              })}
                            </div>
                            {speedPicked !== null && (
                              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                                <div>
                                  <p className="text-[9px] font-black uppercase mb-1" style={{ color: speedPicked === speedItems[speedRound]?.rating ? '#4ade80' : '#ff003c' }}>
                                    {speedPicked === '__timeout__' ? `⏱ Too slow! It was: ${speedItems[speedRound]?.rating}` : speedPicked === speedItems[speedRound]?.rating ? '✓ Correct!' : `✗ It was: ${speedItems[speedRound]?.rating}`}
                                  </p>
                                  <p className="text-[9px] text-gray-500">{speedItems[speedRound]?.hint}</p>
                                </div>
                                <button onClick={() => { if (speedRound + 1 >= speedItems.length) { setSpeedDone(true); } else { setSpeedRound(r => r + 1); setSpeedPicked(null); setSpeedTime(4); } }}
                                  className="ml-6 shrink-0 px-5 py-2.5 rounded-xl bg-safety-amber/20 text-safety-amber font-black uppercase text-[9px] tracking-widest hover:bg-safety-amber hover:text-black transition-all">
                                  {speedRound + 1 >= speedItems.length ? 'Finish' : 'Next →'}
                                </button>
                              </motion.div>
                            )}
                          </div>
                        ) : (
                          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 text-center" style={{ borderColor: 'rgba(255,184,0,0.25)' }}>
                            <div className="p-5 inline-flex rounded-2xl mb-4" style={{ background: 'rgba(255,184,0,0.1)', color: '#ffb800' }}><Zap size={40} /></div>
                            <h3 className="text-2xl font-black uppercase text-white mb-2">Speed Trial Done!</h3>
                            <p className="text-4xl font-black mb-1" style={{ color: '#ffb800' }}>{speedScore}<span className="text-xl text-gray-600"> / {speedItems.length}</span></p>
                            <p className="text-gray-500 text-sm mb-6">{isDailyDone('speed') ? 'XP already earned today — come back tomorrow!' : `+${speedScore * 10} XP awarded`}</p>
                            <button onClick={() => setActiveMiniGame(null)} className="px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest bg-safety-amber/20 text-safety-amber hover:bg-safety-amber hover:text-black transition-all">Back to Training</button>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {/* ─ VAULT MEMORY ─ */}
                    {activeMiniGame === 'memory' && (
                      <motion.div key="memory-active" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 rounded-full text-[8px] font-black uppercase text-neon-cyan bg-neon-cyan/10">Vault Memory</span>
                            <span className="text-white font-black uppercase text-sm">{memPhase === 'flash' ? 'Memorize!' : memPhase === 'pick' ? 'Recall' : 'Results'}</span>
                          </div>
                          <button onClick={() => { setActiveMiniGame(null); setMemPhase(null); }} className="text-gray-600 hover:text-white font-black uppercase text-[9px] tracking-widest transition-colors">← Exit</button>
                        </div>
                        {memPhase === 'flash' && (
                          <motion.div key="flash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 text-center" style={{ borderColor: 'rgba(0,242,255,0.2)' }}>
                            <p className="text-[9px] font-black uppercase tracking-widest text-neon-cyan mb-4">Memorize these 4 services!</p>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-6">
                              <motion.div className="h-full rounded-full bg-neon-cyan" initial={{ width: '100%' }} animate={{ width: '0%' }} transition={{ duration: 3, ease: 'linear' }} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              {memTargets.map(svc => <div key={svc} className="glass-card p-4 text-center font-black text-white uppercase text-sm" style={{ borderColor: 'rgba(0,242,255,0.3)' }}>{svc}</div>)}
                            </div>
                          </motion.div>
                        )}
                        {memPhase === 'pick' && (
                          <motion.div key="pick" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8" style={{ borderColor: 'rgba(0,242,255,0.2)' }}>
                            <p className="text-[9px] font-black uppercase tracking-widest text-neon-cyan text-center mb-6">Which 4 services were you shown?</p>
                            <div className="grid grid-cols-4 gap-3 mb-6">
                              {memChoices.map(svc => {
                                const selected = memPicked.has(svc);
                                return (
                                  <motion.button key={svc} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                    onClick={() => { const next = new Set(memPicked); if (selected) next.delete(svc); else next.add(svc); setMemPicked(next); }}
                                    className="py-3 px-2 rounded-xl font-black text-[10px] uppercase text-center transition-all border"
                                    style={{ background: selected ? 'rgba(0,242,255,0.15)' : 'rgba(255,255,255,0.03)', borderColor: selected ? 'rgba(0,242,255,0.5)' : 'rgba(255,255,255,0.06)', color: selected ? '#00f2ff' : '#888' }}>
                                    {svc}
                                  </motion.button>
                                );
                              })}
                            </div>
                            <button onClick={() => { const score = [...memPicked].filter(s => memTargets.includes(s)).length; setMemScore(score); setMemPhase('done'); }}
                              disabled={memPicked.size === 0}
                              className="w-full py-3 rounded-xl bg-neon-cyan text-black font-black uppercase text-[9px] tracking-widest disabled:opacity-30 disabled:cursor-not-allowed">
                              Confirm ({memPicked.size}/4 selected)
                            </button>
                          </motion.div>
                        )}
                        {memPhase === 'done' && (
                          <motion.div key="memory-done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 text-center" style={{ borderColor: 'rgba(0,242,255,0.25)' }}>
                            <div className="p-5 inline-flex rounded-2xl mb-4" style={{ background: 'rgba(0,242,255,0.1)', color: '#00f2ff' }}><Star size={40} /></div>
                            <h3 className="text-2xl font-black uppercase text-white mb-2">Memory Test Complete!</h3>
                            <p className="text-4xl font-black mb-3" style={{ color: '#00f2ff' }}>{memScore}<span className="text-xl text-gray-600"> / 4</span></p>
                            <div className="flex justify-center gap-2 mb-6 flex-wrap">
                              {memChoices.map(svc => {
                                const wasTarget = memTargets.includes(svc);
                                const wasPicked = memPicked.has(svc);
                                let bg = 'rgba(255,255,255,0.05)', col = '#555';
                                if (wasTarget && wasPicked)   { bg = 'rgba(0,255,100,0.12)';  col = '#4ade80'; }
                                else if (wasTarget)           { bg = 'rgba(255,184,0,0.12)';  col = '#ffb800'; }
                                else if (wasPicked)           { bg = 'rgba(255,0,60,0.12)';   col = '#ff003c'; }
                                return <span key={svc} className="px-3 py-1 rounded-full text-[9px] font-black uppercase" style={{ background: bg, color: col }}>{svc}</span>;
                              })}
                            </div>
                            <p className="text-[8px] font-black uppercase text-gray-600 mb-1">Green = correct · Amber = missed · Red = wrong pick</p>
                            <p className="text-gray-500 text-sm mb-6">{isDailyDone('memory') ? 'XP already earned today — come back tomorrow!' : `+${memScore * 15} XP awarded`}</p>
                            <button onClick={() => { setActiveMiniGame(null); setMemPhase(null); }} className="px-8 py-3 rounded-xl bg-neon-cyan text-black font-black uppercase text-[9px] tracking-widest">Back to Training</button>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {/* ─ PHISH OR LEGIT ─ */}
                    {activeMiniGame === 'phish' && (() => {
                      const item = phishItems[phishRound];
                      const revealed = phishPicked !== null;
                      const correct = revealed && ((phishPicked === 'phish') === item?.isPhish);
                      return (
                        <motion.div key="phish-active" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
                          <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                              <span className="px-2.5 py-1 rounded-full text-[8px] font-black uppercase text-danger-red bg-danger-red/10">Phish or Legit</span>
                              <span className="text-white font-black uppercase text-sm">{phishDone ? 'Results' : `Round ${phishRound + 1} / ${phishItems.length}`}</span>
                            </div>
                            <button onClick={() => setActiveMiniGame(null)} className="text-gray-600 hover:text-white font-black uppercase text-[9px] tracking-widest transition-colors">← Exit</button>
                          </div>
                          {!phishDone && item && (
                            <div>
                              {/* Progress dots */}
                              <div className="flex gap-1.5 mb-5">
                                {phishItems.map((it, i) => (
                                  <div key={i} className="flex-1 h-1 rounded-full transition-all" style={{ background: i < phishRound ? '#4ade80' : i === phishRound ? '#ff003c' : 'rgba(255,255,255,0.06)' }} />
                                ))}
                              </div>
                              {/* Item display */}
                              <div className="glass-card p-6 mb-4 text-center relative overflow-hidden" style={{ borderColor: revealed ? (correct ? 'rgba(74,222,128,0.4)' : 'rgba(255,0,60,0.4)') : 'rgba(255,0,60,0.2)' }}>
                                <div className="absolute inset-0 pointer-events-none" style={{ background: revealed ? (correct ? 'rgba(74,222,128,0.04)' : 'rgba(255,0,60,0.04)') : 'transparent' }} />
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-3">{item.label}</p>
                                <p className="font-mono text-lg font-black text-white break-all leading-relaxed">{item.text}</p>
                                {revealed && (
                                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 pt-4 border-t border-white/5">
                                    <p className="text-sm font-black mb-1" style={{ color: correct ? '#4ade80' : '#ff6666' }}>{correct ? '✓ Correct' : `✗ Wrong — this was ${item.isPhish ? 'a PHISH' : 'LEGIT'}`}</p>
                                    <p className="text-[11px] text-gray-400 leading-relaxed">{item.why}</p>
                                  </motion.div>
                                )}
                              </div>
                              {/* Buttons */}
                              {!revealed ? (
                                <div className="grid grid-cols-2 gap-4">
                                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    onClick={() => { setPhishPicked('phish'); if (item.isPhish) setPhishScore(s => s + 1); }}
                                    className="cursor-pointer p-5 rounded-2xl font-black uppercase text-sm tracking-widest transition-all border-2 flex flex-col items-center gap-2"
                                    style={{ background: 'rgba(255,0,60,0.08)', borderColor: 'rgba(255,0,60,0.3)', color: '#ff003c' }}>
                                    <span className="text-3xl">🎣</span> Phish
                                  </motion.button>
                                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    onClick={() => { setPhishPicked('legit'); if (!item.isPhish) setPhishScore(s => s + 1); }}
                                    className="cursor-pointer p-5 rounded-2xl font-black uppercase text-sm tracking-widest transition-all border-2 flex flex-col items-center gap-2"
                                    style={{ background: 'rgba(74,222,128,0.08)', borderColor: 'rgba(74,222,128,0.3)', color: '#4ade80' }}>
                                    <span className="text-3xl">✅</span> Legit
                                  </motion.button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-black" style={{ color: '#ff003c' }}>Score: {phishScore}/{phishRound + 1}</span>
                                  <button onClick={() => {
                                    if (phishRound + 1 >= phishItems.length) { setPhishDone(true); }
                                    else { setPhishRound(r => r + 1); setPhishPicked(null); }
                                  }} className="cursor-pointer px-6 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest" style={{ background: '#ff003c', color: '#fff' }}>
                                    {phishRound + 1 >= phishItems.length ? 'See Results' : 'Next →'}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                          {phishDone && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 text-center" style={{ borderColor: 'rgba(255,0,60,0.25)' }}>
                              <div className="text-6xl mb-4">{phishScore >= 7 ? '🦅' : phishScore >= 5 ? '🎯' : '🎣'}</div>
                              <h3 className="text-2xl font-black uppercase text-white mb-2">Phish or Legit</h3>
                              <p className="text-5xl font-black mb-1" style={{ color: '#ff003c' }}>{phishScore}<span className="text-xl text-gray-600">/{phishItems.length}</span></p>
                              <p className="text-sm text-gray-500 mb-2">{phishScore === phishItems.length ? 'Perfect — nothing gets past you!' : phishScore >= 6 ? 'Solid instincts.' : 'A few got through — review the hints.'}</p>
                              <p className="text-gray-500 text-sm mb-6">{isDailyDone('phish') ? 'XP already earned today — come back tomorrow!' : `+${phishScore * 12} XP awarded`}</p>
                              <button onClick={() => setActiveMiniGame(null)} className="cursor-pointer px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest bg-danger-red/20 text-danger-red hover:bg-danger-red hover:text-white transition-all">Back to Training</button>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })()}

                    {/* ─ CRACK TIMER ─ */}
                    {activeMiniGame === 'crack' && (() => {
                      const item = crackItems[crackRound];
                      const barWidthMap: Record<CrackTier, string> = { instant: '100%', minutes: '100%', years: '38%', forever: '6%' };
                      const barDurMap: Record<CrackTier, number> = { instant: 0.5, minutes: 1.4, years: 2.2, forever: 1.8 };
                      const tierColors: Record<CrackTier, string> = { instant: '#ff003c', minutes: '#ff6b35', years: '#ffb800', forever: '#4ade80' };
                      return (
                        <motion.div key="crack-active" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
                          <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                              <span className="px-2.5 py-1 rounded-full text-[8px] font-black uppercase text-safety-amber bg-safety-amber/10">Crack Timer</span>
                              <span className="text-white font-black uppercase text-sm">{crackDone ? 'Results' : `Password ${crackRound + 1} / ${crackItems.length}`}</span>
                            </div>
                            <button onClick={() => setActiveMiniGame(null)} className="text-gray-600 hover:text-white font-black uppercase text-[9px] tracking-widest transition-colors">← Exit</button>
                          </div>
                          {!crackDone && item && (
                            <div>
                              {/* Progress */}
                              <div className="flex gap-1.5 mb-5">
                                {crackItems.map((_, i) => (
                                  <div key={i} className="flex-1 h-1 rounded-full" style={{ background: i < crackRound ? '#4ade80' : i === crackRound ? '#ffb800' : 'rgba(255,255,255,0.06)' }} />
                                ))}
                              </div>
                              <div className="glass-card p-6 mb-4" style={{ borderColor: 'rgba(255,184,0,0.2)' }}>
                                <p className="text-[9px] font-black uppercase tracking-widest text-safety-amber text-center mb-4">How fast does this crack?</p>
                                <code className="block text-2xl font-mono text-white text-center mb-6 break-all">{item.pwd}</code>
                                {/* Crack animation bar */}
                                {crackPicked && (
                                  <div className="mb-5">
                                    <div className="flex justify-between text-[8px] font-black uppercase text-gray-600 mb-2">
                                      <span>Cracking at 10 billion attempts/sec...</span>
                                      <span style={{ color: crackPicked === 'instant' || crackPicked === 'minutes' ? '#ff003c' : '#4ade80' }}>
                                        {crackShowResult ? (crackPicked === 'instant' ? '☠️ CRACKED' : crackPicked === 'minutes' ? '☠️ CRACKED' : crackPicked === 'years' ? '⏰ Takes years' : '🛡️ Uncrackable') : '...'}
                                      </span>
                                    </div>
                                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                      <motion.div className="h-full rounded-full"
                                        initial={{ width: '0%' }}
                                        animate={{ width: barWidthMap[crackPicked] }}
                                        transition={{ duration: barDurMap[crackPicked], ease: crackPicked === 'instant' ? 'linear' : 'easeOut' }}
                                        style={{ background: crackPicked === 'instant' || crackPicked === 'minutes' ? 'linear-gradient(90deg, #ff003c, #ff6b35)' : 'linear-gradient(90deg, #4ade80, #00f2ff)' }}
                                      />
                                    </div>
                                  </div>
                                )}
                                {/* Answer buttons */}
                                {!crackPicked ? (
                                  <div className="grid grid-cols-2 gap-3">
                                    {(['instant', 'minutes', 'years', 'forever'] as CrackTier[]).map(tier => (
                                      <motion.button key={tier} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                        onClick={() => { setCrackPicked(tier); if (tier === item.tier) setCrackScore(s => s + 1); }}
                                        className="cursor-pointer py-4 px-5 rounded-xl font-black uppercase text-sm border-2 transition-all flex flex-col items-center gap-1"
                                        style={{ background: tierColors[tier] + '12', borderColor: tierColors[tier] + '50', color: tierColors[tier] }}>
                                        <span className="text-2xl">{tier === 'instant' ? '⚡' : tier === 'minutes' ? '🕐' : tier === 'years' ? '📅' : '♾️'}</span>
                                        {tier === 'instant' ? 'Instantly' : tier === 'minutes' ? 'Minutes' : tier === 'years' ? 'Years' : 'Centuries+'}
                                      </motion.button>
                                    ))}
                                  </div>
                                ) : crackShowResult && (
                                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                    <div className="p-3 rounded-xl" style={{ background: (crackPicked === item.tier ? '#4ade80' : '#ff003c') + '12', borderLeft: `3px solid ${crackPicked === item.tier ? '#4ade80' : '#ff003c'}` }}>
                                      <p className="text-[9px] font-black uppercase" style={{ color: crackPicked === item.tier ? '#4ade80' : '#ff6666' }}>
                                        {crackPicked === item.tier ? '✓ Correct!' : `✗ Wrong — actual: ${item.label}`}
                                      </p>
                                      <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{item.why}</p>
                                    </div>
                                    <button onClick={() => {
                                      if (crackRound + 1 >= crackItems.length) { setCrackDone(true); }
                                      else { setCrackRound(r => r + 1); setCrackPicked(null); setCrackShowResult(false); }
                                    }} className="cursor-pointer w-full py-3 rounded-xl font-black uppercase text-[9px] tracking-widest" style={{ background: '#ffb800', color: '#000' }}>
                                      {crackRound + 1 >= crackItems.length ? 'See Results' : 'Next →'}
                                    </button>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          )}
                          {crackDone && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 text-center" style={{ borderColor: 'rgba(255,184,0,0.25)' }}>
                              <div className="text-6xl mb-4">{crackScore >= 5 ? '🔐' : crackScore >= 3 ? '⏱️' : '💥'}</div>
                              <h3 className="text-2xl font-black uppercase text-white mb-2">Crack Timer</h3>
                              <p className="text-5xl font-black mb-1" style={{ color: '#ffb800' }}>{crackScore}<span className="text-xl text-gray-600">/{crackItems.length}</span></p>
                              <p className="text-sm text-gray-500 mb-2">{crackScore === crackItems.length ? 'You think like a threat model.' : crackScore >= 4 ? 'Strong instincts on password strength.' : 'Password strength can be surprising — keep practicing.'}</p>
                              <p className="text-gray-500 text-sm mb-6">{isDailyDone('crack') ? 'XP already earned today — come back tomorrow!' : `+${crackScore * 15} XP awarded`}</p>
                              <button onClick={() => setActiveMiniGame(null)} className="cursor-pointer px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest bg-safety-amber/20 text-safety-amber hover:bg-safety-amber hover:text-black transition-all">Back to Training</button>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })()}

                    {/* ─ TYPE IT OUT ─ */}
                    {activeMiniGame === 'type' && (() => {
                      const secs = Math.round(typeElapsed / 1000);
                      const score = typeDone ? Math.max(20, 100 - typeMistakes * 4 - Math.max(0, secs - 10) * 2) : 0;
                      return (
                        <motion.div key="type-active" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
                          <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                              <span className="px-2.5 py-1 rounded-full text-[8px] font-black uppercase text-neon-cyan bg-neon-cyan/10">Type It Out</span>
                              <span className="text-white font-black uppercase text-sm">{typePhase === 'ready' ? 'Ready' : typePhase === 'typing' ? `${secs}s — ${typeMistakes} mistakes` : 'Done!'}</span>
                            </div>
                            <button onClick={() => setActiveMiniGame(null)} className="text-gray-600 hover:text-white font-black uppercase text-[9px] tracking-widest transition-colors">← Exit</button>
                          </div>
                          {!typeDone ? (
                            <div className="glass-card p-6" style={{ borderColor: 'rgba(0,242,255,0.2)' }}>
                              <p className="text-[9px] font-black uppercase tracking-widest text-neon-cyan text-center mb-4">Type this password exactly</p>
                              {/* Target display */}
                              <div className="flex flex-wrap justify-center gap-1 mb-6">
                                {typePwd.split('').map((ch, i) => {
                                  const typed = typeInput[i];
                                  const isCorrect = typed === ch;
                                  const isWrong = typed !== undefined && typed !== ch;
                                  const isCurrent = i === typeInput.length;
                                  return (
                                    <span key={i} className="w-8 h-10 flex items-center justify-center rounded-lg font-mono font-black text-base transition-all border"
                                      style={{
                                        background: isCorrect ? 'rgba(74,222,128,0.15)' : isWrong ? 'rgba(255,0,60,0.15)' : isCurrent ? 'rgba(0,242,255,0.1)' : 'rgba(255,255,255,0.04)',
                                        borderColor: isCorrect ? 'rgba(74,222,128,0.5)' : isWrong ? 'rgba(255,0,60,0.5)' : isCurrent ? 'rgba(0,242,255,0.6)' : 'rgba(255,255,255,0.06)',
                                        color: isCorrect ? '#4ade80' : isWrong ? '#ff6666' : isCurrent ? '#00f2ff' : '#888',
                                        boxShadow: isCurrent ? '0 0 8px rgba(0,242,255,0.3)' : 'none',
                                      }}>
                                      {ch}
                                    </span>
                                  );
                                })}
                              </div>
                              {/* Input */}
                              <input
                                autoFocus
                                type="text"
                                value={typeInput}
                                onChange={e => {
                                  const val = e.target.value;
                                  if (val.length > typePwd.length) return;
                                  if (typePhase === 'ready') { setTypePhase('typing'); setTypeStartTime(Date.now()); }
                                  if (val.length > typeInput.length) {
                                    const idx = typeInput.length;
                                    if (val[idx] !== typePwd[idx]) setTypeMistakes(m => m + 1);
                                  }
                                  setTypeInput(val);
                                  if (val === typePwd) { setTypeElapsed(Date.now() - typeStartTime); setTypeDone(true); setTypePhase('done'); }
                                }}
                                placeholder={typePhase === 'ready' ? 'Start typing to begin...' : ''}
                                className="w-full px-4 py-3 rounded-xl font-mono text-base bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neon-cyan/50 text-center"
                                style={{ letterSpacing: '0.1em' }}
                              />
                              {typePhase === 'typing' && (
                                <div className="mt-3 flex justify-between text-[9px] font-black uppercase text-gray-600">
                                  <span>⏱ {secs}s elapsed</span>
                                  <span style={{ color: typeMistakes > 5 ? '#ff6666' : typeMistakes > 0 ? '#ffb800' : '#4ade80' }}>{typeMistakes} mistakes</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 text-center" style={{ borderColor: 'rgba(0,242,255,0.25)' }}>
                              <div className="text-6xl mb-4">{typeMistakes === 0 ? '🏆' : typeMistakes <= 3 ? '⚡' : '💪'}</div>
                              <h3 className="text-2xl font-black uppercase text-white mb-4">Complete!</h3>
                              <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="p-3 rounded-xl" style={{ background: 'rgba(0,242,255,0.08)', border: '1px solid rgba(0,242,255,0.2)' }}>
                                  <p className="text-[8px] text-gray-500 font-black uppercase mb-1">Time</p>
                                  <p className="text-xl font-black text-white">{secs}s</p>
                                </div>
                                <div className="p-3 rounded-xl" style={{ background: typeMistakes === 0 ? 'rgba(74,222,128,0.08)' : 'rgba(255,107,53,0.08)', border: `1px solid ${typeMistakes === 0 ? 'rgba(74,222,128,0.2)' : 'rgba(255,107,53,0.2)'}` }}>
                                  <p className="text-[8px] text-gray-500 font-black uppercase mb-1">Mistakes</p>
                                  <p className="text-xl font-black" style={{ color: typeMistakes === 0 ? '#4ade80' : '#ff6b35' }}>{typeMistakes}</p>
                                </div>
                                <div className="p-3 rounded-xl" style={{ background: 'rgba(0,242,255,0.08)', border: '1px solid rgba(0,242,255,0.2)' }}>
                                  <p className="text-[8px] text-gray-500 font-black uppercase mb-1">Score</p>
                                  <p className="text-xl font-black text-neon-cyan">{score}</p>
                                </div>
                              </div>
                              <p className="text-gray-500 text-sm mb-6">{isDailyDone('type') ? 'XP already earned today — come back tomorrow!' : `+${score} XP awarded`}</p>
                              <div className="flex gap-3 justify-center">
                                <button onClick={startType} className="cursor-pointer px-6 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 transition-all">Try Again</button>
                                <button onClick={() => setActiveMiniGame(null)} className="cursor-pointer px-6 py-3 rounded-xl bg-neon-cyan text-black font-black uppercase text-[9px] tracking-widest">Back to Training</button>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })()}


                    {/* ─ PASSWORD FORGE ─ */}
                    {activeMiniGame === 'forge' && (
                      <motion.div key="forge-active" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 rounded-full text-[8px] font-black uppercase text-neon-cyan bg-neon-cyan/10">Password Forge</span>
                            <span className="text-white font-black uppercase text-sm">
                              {forgeDone ? 'Forged!' : `${forgeMana} Mana Left`}
                            </span>
                          </div>
                          <button onClick={() => setActiveMiniGame(null)} className="text-gray-600 hover:text-white font-black uppercase text-[9px] tracking-widest transition-colors">← Exit</button>
                        </div>

                        {!forgeDone && (
                          <div className="glass-card p-6" style={{ borderColor: 'rgba(0,242,255,0.2)' }}>
                            <p className="text-[8px] font-black uppercase tracking-widest text-neon-cyan mb-3">Forge your password</p>
                            <div className="glass-card p-4 mb-2 text-center" style={{ borderColor: 'rgba(0,242,255,0.15)' }}>
                              <p className="font-mono text-white text-sm break-all tracking-wide">{forgePwd}</p>
                            </div>
                            {(() => {
                              const str = getPasswordStrength(forgePwd);
                              return (
                                <div className="mb-5">
                                  <div className="flex gap-1 mb-1">
                                    {[0,1,2,3,4].map(i => (
                                      <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-300"
                                        style={{ background: i <= str.score ? str.color : 'rgba(255,255,255,0.06)' }} />
                                    ))}
                                  </div>
                                  <p className="text-[8px] font-black text-right" style={{ color: str.color }}>{str.label}</p>
                                </div>
                              );
                            })()}
                            <div className="flex gap-1.5 mb-5">
                              {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex-1 h-2.5 rounded-full transition-all duration-300"
                                  style={{ background: i < forgeMana ? '#00f2ff' : 'rgba(255,255,255,0.06)' }} />
                              ))}
                            </div>
                            <div className="grid grid-cols-2 gap-2.5 mb-4">
                              {FORGE_UPGRADES.map(upg => {
                                const used = forgeUsed.has(upg.id);
                                const disabled = used || forgeMana <= 0;
                                return (
                                  <motion.button key={upg.id} whileHover={{ scale: disabled ? 1 : 1.02 }} whileTap={{ scale: disabled ? 1 : 0.98 }}
                                    disabled={disabled}
                                    onClick={() => {
                                      if (disabled) return;
                                      setForgePwd(upg.apply(forgePwd));
                                      setForgeUsed(prev => new Set([...prev, upg.id]));
                                      setForgeMana(prev => {
                                        const next = prev - 1;
                                        if (next <= 0) setForgeDone(true);
                                        return next;
                                      });
                                    }}
                                    className="p-3 rounded-xl text-left transition-all border"
                                    style={{ background: used ? 'rgba(255,255,255,0.02)' : 'rgba(0,242,255,0.05)', borderColor: used ? 'rgba(255,255,255,0.04)' : 'rgba(0,242,255,0.2)', opacity: disabled ? 0.4 : 1 }}>
                                    <span className="text-base block mb-1">{upg.icon}</span>
                                    <p className="font-black text-[9px] uppercase text-white leading-tight">{upg.label}</p>
                                    <p className="text-[8px] text-gray-500 mt-0.5">{upg.desc}</p>
                                  </motion.button>
                                );
                              })}
                            </div>
                            <button onClick={() => setForgeDone(true)}
                              className="w-full py-3 rounded-xl font-black uppercase text-[9px] tracking-widest"
                              style={{ background: 'rgba(0,242,255,0.1)', color: '#00f2ff', border: '1px solid rgba(0,242,255,0.2)' }}>
                              Submit Forge
                            </button>
                          </div>
                        )}

                        {forgeDone && (() => {
                          const str = getPasswordStrength(forgePwd);
                          const xp = str.score >= 4 ? 80 : str.score >= 3 ? 60 : str.score >= 2 ? 30 : 0;
                          return (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 text-center" style={{ borderColor: 'rgba(0,242,255,0.25)' }}>
                              <div className="p-5 inline-flex rounded-2xl mb-4" style={{ background: 'rgba(0,242,255,0.1)', color: '#00f2ff' }}><FlaskConical size={40} /></div>
                              <h3 className="text-2xl font-black uppercase text-white mb-2">Forge Complete!</h3>
                              <p className="font-mono text-gray-300 text-sm break-all mb-2">{forgePwd}</p>
                              <p className="text-xl font-black mb-1" style={{ color: str.color }}>{str.label}</p>
                              <p className="text-[8px] text-gray-500 mb-3">Strength {str.score + 1}/5</p>
                              <p className="text-gray-500 text-sm mb-6">{isDailyDone('forge') ? 'XP already earned today' : xp > 0 ? `+${xp} XP awarded` : 'No XP — forge a stronger password next time!'}</p>
                              <div className="flex gap-3 justify-center">
                                <button onClick={startForge} className="px-6 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest border" style={{ color: '#00f2ff', borderColor: 'rgba(0,242,255,0.3)' }}>Try Again</button>
                                <button onClick={() => setActiveMiniGame(null)} className="px-6 py-3 rounded-xl bg-neon-cyan text-black font-black uppercase text-[9px] tracking-widest">Back to Training</button>
                              </div>
                            </motion.div>
                          );
                        })()}
                      </motion.div>
                    )}

                    {/* ─ GAMES HUB ─ */}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── QUIZ MODAL ── */}
      <AnimatePresence>
        {quizOpen && (() => {
          const cat = QUIZ_CATEGORIES.find(c => c.id === activeQuizCat);
          const catColor = cat?.color || '#00f2ff';
          const quizDoneToday = activeQuizCat ? isDailyDone(`quiz_${activeQuizCat}`) : false;
          return (
            <motion.div key="quiz-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-y-auto"
              style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }}
            >
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 24 }}
                transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                className="w-full max-w-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-full text-[9px] font-black uppercase" style={{ color: catColor, background: catColor + '20', border: `1px solid ${catColor}40` }}>{cat?.name}</div>
                    <span className="text-white font-black uppercase text-base">Knowledge Trial</span>
                  </div>
                  <button onClick={() => { setQuizOpen(false); setActiveQuizCat(null); }}
                    className="cursor-pointer p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all font-black text-sm">
                    ✕
                  </button>
                </div>
                <AnimatePresence mode="wait">
                  {!quizDone ? (
                    <motion.div key={`q-${quizIdx}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}
                      className="glass-card p-8" style={{ borderColor: catColor + '40', boxShadow: `0 0 40px ${catColor}15` }}>
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Question {quizIdx + 1} of {quizQuestions.length}</span>
                        <div className="flex gap-1">
                          {quizQuestions.map((_, i) => (
                            <div key={i} className="w-8 h-1.5 rounded-full transition-all" style={{ background: i < quizIdx ? catColor : i === quizIdx ? catColor + '80' : 'rgba(255,255,255,0.1)' }} />
                          ))}
                        </div>
                      </div>
                      <p className="text-lg font-black text-white mb-8 leading-snug">{quizQuestions[quizIdx].q}</p>
                      <div className="grid grid-cols-2 gap-3">
                        {quizQuestions[quizIdx].options.map((opt, oi) => {
                          const isCorrect = oi === quizQuestions[quizIdx].answer;
                          const isSelected = quizSelected === oi;
                          const revealed = quizSelected !== null;
                          return (
                            <motion.button key={oi}
                              whileHover={!revealed ? { scale: 1.02 } : {}} whileTap={!revealed ? { scale: 0.98 } : {}}
                              onClick={() => { if (revealed) return; setQuizSelected(oi); }}
                              className="p-4 rounded-xl text-left font-bold text-sm transition-all border cursor-pointer"
                              style={{
                                background: !revealed ? 'rgba(255,255,255,0.05)' : isCorrect ? 'rgba(0,255,100,0.15)' : isSelected ? 'rgba(255,0,60,0.15)' : 'rgba(255,255,255,0.03)',
                                borderColor: !revealed ? 'rgba(255,255,255,0.08)' : isCorrect ? 'rgba(0,255,100,0.4)' : isSelected ? 'rgba(255,0,60,0.4)' : 'rgba(255,255,255,0.05)',
                                color: !revealed ? '#e2e2e6' : isCorrect ? '#4ade80' : isSelected ? '#ff003c' : '#555',
                                cursor: revealed ? 'default' : 'pointer',
                              }}>
                              {opt}
                            </motion.button>
                          );
                        })}
                      </div>
                      {quizSelected !== null && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex items-center justify-between pt-5 border-t border-white/5">
                          <p className="text-[10px] font-black uppercase" style={{ color: quizSelected === quizQuestions[quizIdx].answer ? '#4ade80' : '#ff003c' }}>
                            {quizSelected === quizQuestions[quizIdx].answer ? '✓ Correct! +20 XP' : `✗ Answer: ${quizQuestions[quizIdx].options[quizQuestions[quizIdx].answer]}`}
                          </p>
                          <button onClick={() => { const na = [...quizAnswers, quizSelected!]; setQuizAnswers(na); if (quizIdx + 1 >= quizQuestions.length) { setQuizDone(true); } else { setQuizIdx(i => i + 1); setQuizSelected(null); } }}
                            className="cursor-pointer px-5 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest hover:opacity-90 transition-opacity"
                            style={{ background: catColor, color: '#000' }}>
                            {quizIdx + 1 >= quizQuestions.length ? 'See Results' : 'Next →'}
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div key="quiz-done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className="glass-card p-12 text-center" style={{ borderColor: catColor + '40', boxShadow: `0 0 60px ${catColor}20` }}>
                      {(() => {
                        const correctCount = quizQuestions.filter((q, i) => quizAnswers[i] === q.answer).length;
                        const pct = Math.round((correctCount / quizQuestions.length) * 100);
                        return (<>
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}
                            className="w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                            style={{ background: catColor + '20', border: `2px solid ${catColor}60`, boxShadow: `0 0 40px ${catColor}30` }}>
                            <span className="text-4xl font-black" style={{ color: catColor }}>{pct}%</span>
                          </motion.div>
                          <h3 className="text-3xl font-black uppercase text-white mb-2">Trial Complete!</h3>
                          <p className="text-5xl font-black mb-2" style={{ color: catColor }}>{correctCount}<span className="text-2xl text-gray-600"> / {quizQuestions.length}</span></p>
                          <p className="text-gray-500 text-sm mb-8">{quizDoneToday ? 'XP already earned today — come back tomorrow!' : correctCount > 0 ? `+${correctCount * 20} XP awarded` : 'No XP this time — try again tomorrow!'}</p>
                          <div className="flex gap-3 justify-center">
                            <button onClick={() => { setQuizOpen(false); setActiveQuizCat(null); }}
                              className="cursor-pointer px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest border border-white/10 bg-white/5 text-gray-400 hover:text-white transition-all">
                              Close
                            </button>
                            <button onClick={() => { if (activeQuizCat) startQuizCat(activeQuizCat); }}
                              className="cursor-pointer px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:opacity-90 transition-opacity"
                              style={{ background: catColor, color: '#000' }}>
                              Play Again
                            </button>
                          </div>
                        </>);
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ── CODEX MODAL ── */}
      <AnimatePresence>
        {codexOpen && (() => {
          const chapter = CODEX_CHAPTERS.find(c => c.id === codexChapter) || CODEX_CHAPTERS[0];
          const slide = chapter.slides[Math.min(codexSlide, chapter.slides.length - 1)];
          const prev = () => setCodexSlide(s => Math.max(0, s - 1));
          const next = () => setCodexSlide(s => Math.min(chapter.slides.length - 1, s + 1));
          return (
            <motion.div key="codex-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-y-auto"
              style={{ background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(16px)' }}
            >
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 24 }}
                transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                className="w-full max-w-2xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3 flex-wrap">
                    {CODEX_CHAPTERS.map(c => (
                      <button key={c.id} onClick={() => { setCodexChapter(c.id); setCodexSlide(0); }}
                        className="cursor-pointer px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border"
                        style={codexChapter === c.id
                          ? { backgroundColor: c.color, color: '#000', borderColor: 'transparent' }
                          : { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.08)', color: '#6b7280' }}>
                        {c.name}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setCodexOpen(false)}
                    className="cursor-pointer shrink-0 ml-3 p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all font-black text-sm">
                    ✕
                  </button>
                </div>

                {/* Slide */}
                <AnimatePresence mode="wait">
                  <motion.div key={`${codexChapter}-${codexSlide}`}
                    initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.22 }}
                    className="glass-card relative overflow-hidden"
                    style={{ borderColor: chapter.color + '40', boxShadow: `0 0 50px ${chapter.color}12` }}>
                    <motion.div className="absolute inset-0 pointer-events-none"
                      style={{ background: `radial-gradient(ellipse at 10% 80%, ${chapter.color}12, transparent 65%)` }} />
                    <div className="relative p-10">
                      {/* Slide header */}
                      <div className="flex items-center gap-2 mb-8">
                        <div className="text-[8px] font-black uppercase tracking-widest" style={{ color: chapter.color }}>{chapter.name}</div>
                        <div className="text-gray-700">·</div>
                        <div className="text-[8px] font-black uppercase tracking-widest text-gray-600">Slide {codexSlide + 1} of {chapter.slides.length}</div>
                      </div>

                      <div className="flex items-start gap-6 mb-8">
                        <div className="p-4 rounded-2xl shrink-0" style={{ backgroundColor: chapter.color + '18', color: chapter.color }}>
                          {slide.icon}
                        </div>
                        <div>
                          <h2 className="text-2xl font-black uppercase text-white leading-tight mb-3">{slide.title}</h2>
                          <p className="text-gray-400 text-sm leading-relaxed">{slide.body}</p>
                        </div>
                      </div>

                      {/* Bullets OR Knowledge Check */}
                      {slide.check ? (
                        <div className="space-y-5 mb-8">
                          {slide.check.map((q, qi) => {
                            const selected = codexCheckAnswers[qi];
                            return (
                              <div key={qi}>
                                <p className="text-sm font-black text-white mb-3">
                                  <span className="text-[9px] font-black uppercase tracking-widest mr-2" style={{ color: chapter.color }}>Q{qi + 1}</span>
                                  {q.question}
                                </p>
                                <div className="space-y-2">
                                  {q.options.map((opt, oi) => {
                                    const isSelected = selected === oi;
                                    const isCorrect = codexCheckSubmitted && oi === q.answer;
                                    const isWrong = codexCheckSubmitted && isSelected && oi !== q.answer;
                                    return (
                                      <button key={oi}
                                        onClick={() => {
                                          if (codexCheckSubmitted) return;
                                          setCodexCheckAnswers(prev => ({ ...prev, [qi]: oi }));
                                        }}
                                        className="w-full p-3 rounded-xl text-left text-sm font-medium transition-all border"
                                        style={{
                                          borderColor: isCorrect ? '#4ade80' : isWrong ? '#ff4444' : isSelected ? chapter.color + '80' : 'rgba(255,255,255,0.08)',
                                          background: isCorrect ? '#4ade8012' : isWrong ? '#ff444412' : isSelected ? chapter.color + '12' : 'rgba(255,255,255,0.03)',
                                          color: isCorrect ? '#4ade80' : isWrong ? '#ff7777' : isSelected ? chapter.color : '#6b7280',
                                          cursor: codexCheckSubmitted ? 'default' : 'pointer',
                                        }}>
                                        {isCorrect ? '✓ ' : isWrong ? '✗ ' : ''}{opt}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                          <div className="flex items-center gap-4 pt-1">
                            {!codexCheckSubmitted ? (
                              <button
                                onClick={() => setCodexCheckSubmitted(true)}
                                disabled={Object.keys(codexCheckAnswers).length < slide.check.length}
                                className="cursor-pointer px-5 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                style={{ background: chapter.color + '20', color: chapter.color, borderColor: chapter.color + '40' }}>
                                Check Answers →
                              </button>
                            ) : (
                              <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                                className="text-sm font-black" style={{ color: slide.check.filter((q, qi) => codexCheckAnswers[qi] === q.answer).length === slide.check.length ? '#4ade80' : '#ffb800' }}>
                                {slide.check.filter((q, qi) => codexCheckAnswers[qi] === q.answer).length}/{slide.check.length} correct
                                {slide.check.filter((q, qi) => codexCheckAnswers[qi] === q.answer).length === slide.check.length ? ' — Perfect! ✓' : ' — Review the slides and try again!'}
                              </motion.div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2.5 mb-8">
                          {slide.bullets.map((b, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                              className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ backgroundColor: chapter.color }} />
                              <p className="text-white text-sm font-medium leading-relaxed">{b}</p>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Key insight */}
                      <div className="rounded-xl px-5 py-4 flex items-start gap-3" style={{ backgroundColor: chapter.color + '12', borderLeft: `3px solid ${chapter.color}` }}>
                        <Zap size={15} className="shrink-0 mt-0.5" style={{ color: chapter.color }} />
                        <p className="text-sm font-bold leading-relaxed" style={{ color: chapter.color }}>
                          <span className="font-black uppercase text-[9px] tracking-widest block mb-1 opacity-70">Key Insight</span>
                          {slide.tip}
                        </p>
                      </div>

                      {/* Navigation */}
                      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                        <button onClick={prev} disabled={codexSlide === 0}
                          className="cursor-pointer px-6 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all border border-white/10 bg-white/5 text-gray-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed">
                          ← Previous
                        </button>
                        <div className="flex gap-2.5">
                          {chapter.slides.map((_, i) => (
                            <button key={i} onClick={() => setCodexSlide(i)}
                              className="cursor-pointer rounded-full transition-all hover:scale-125"
                              style={{ width: i === codexSlide ? '24px' : '8px', height: '8px', backgroundColor: i === codexSlide ? chapter.color : 'rgba(255,255,255,0.15)' }} />
                          ))}
                        </div>
                        {codexSlide < chapter.slides.length - 1 ? (
                          <button onClick={next}
                            className="cursor-pointer px-6 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all border hover:opacity-90"
                            style={{ backgroundColor: chapter.color, color: '#000', borderColor: 'transparent' }}>
                            Next →
                          </button>
                        ) : (
                          <button onClick={() => setCodexOpen(false)}
                            className="cursor-pointer px-6 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all border hover:opacity-90"
                            style={{ backgroundColor: chapter.color, color: '#000', borderColor: 'transparent' }}>
                            Done ✓
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.message}
            initial={{ opacity: 0, y: 20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: 20 }}
            style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 10000, pointerEvents: 'none' }}
            className={`flex items-center gap-3 px-5 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-2xl ${
              toast.type === 'success' ? 'bg-neon-cyan text-black' :
              toast.type === 'error' ? 'bg-danger-red text-white' :
              'bg-white/10 text-white border border-white/20'
            }`}
          >
            {toast.type === 'success' && <Check size={14} />}
            {toast.type === 'error' && <Skull size={14} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
