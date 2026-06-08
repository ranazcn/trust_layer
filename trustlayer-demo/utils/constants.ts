// Trust Score Calculation Constants
export const TRUST_SCORE = {
  BASE_SCORE: 50,
  MAX_SCORE: 100,
  MIN_SCORE: 0,
  AGE_MULTIPLIER: 2,
  AGE_MAX_BONUS: 24,
  RISKY_INTERACTION_PENALTY: 30,
  CLEAN_HISTORY_BONUS: 10,
  ABNORMAL_ACTIVITY_PENALTY: 20,
  NORMAL_ACTIVITY_BONUS: 10,
  VOTE_MULTIPLIER: 3,
  VOTE_MAX_BONUS: 15,
  ABNORMAL_TX_THRESHOLD: 300,
  ABNORMAL_LOGIN_THRESHOLD: 10,
  NORMAL_TX_THRESHOLD: 10,
  RISKY_INTERACTION_PROBABILITY: 0.8,
};

export const TRUST_STATUS = {
  TRUSTED: { label: 'TRUSTED', color: '#10b981', minScore: 70 },
  MEDIUM:  { label: 'MEDIUM',  color: '#f59e0b', minScore: 40 },
  RISKY:   { label: 'RISKY',   color: '#ef4444', minScore: 0  },
};

export const SEARCH_CONFIG = {
  MIN_ADDRESS_LENGTH: 5,
  LOADING_DELAY: 2000,
  TX_HASH_LENGTH: 40,
  BLOCK_NUMBER: 18452912,
};

export const RANDOM_METRICS_RANGE = {
  ageInMonths: { min: 1,  max: 36  },
  activeDays:  { min: 5,  max: 150 },
  dailyLogins: { min: 1,  max: 12  },
  txCount:     { min: 1,  max: 350 },
  trustVotes:  { min: 0,  max: 8   },
};

// ─── 100 Profil Üreticisi ────────────────────────────────────────────────────

// Deterministik seeded random (profillar her çalışmada aynı kalır)
const seededRand = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

const seededInt = (seed: number, min: number, max: number) =>
  Math.floor(seededRand(seed) * (max - min + 1)) + min;

// Hex adres karakterleri
const HEX = '0123456789abcdefABCDEF';
const genAddress = (seed: number): string => {
  let addr = '0x';
  for (let i = 0; i < 40; i++) {
    addr += HEX[seededInt(seed * 41 + i, 0, HEX.length - 1)];
  }
  return addr;
};

// Profil tipi arketipleri
const ARCHETYPES = [
  { tag: 'Whale',           ageMin: 18, ageMax: 36, txMin: 50,  txMax: 200, loginMin: 1, loginMax: 4,  riskProb: 0.05, voteMin: 10, voteMax: 20 },
  { tag: 'DeFi Trader',     ageMin: 6,  ageMax: 24, txMin: 80,  txMax: 250, loginMin: 3, loginMax: 8,  riskProb: 0.10, voteMin: 3,  voteMax: 12 },
  { tag: 'NFT Collector',   ageMin: 4,  ageMax: 20, txMin: 20,  txMax: 100, loginMin: 1, loginMax: 5,  riskProb: 0.08, voteMin: 2,  voteMax: 10 },
  { tag: 'DAO Member',      ageMin: 12, ageMax: 30, txMin: 30,  txMax: 120, loginMin: 1, loginMax: 3,  riskProb: 0.02, voteMin: 8,  voteMax: 18 },
  { tag: 'Newbie',          ageMin: 1,  ageMax: 4,  txMin: 1,   txMax: 20,  loginMin: 1, loginMax: 3,  riskProb: 0.05, voteMin: 0,  voteMax: 2  },
  { tag: 'Suspected Bot',   ageMin: 1,  ageMax: 3,  txMin: 280, txMax: 350, loginMin: 12,loginMax: 20, riskProb: 0.90, voteMin: 0,  voteMax: 1  },
  { tag: 'Staker',          ageMin: 8,  ageMax: 28, txMin: 15,  txMax: 60,  loginMin: 1, loginMax: 2,  riskProb: 0.03, voteMin: 5,  voteMax: 15 },
  { tag: 'Mixer Contact',   ageMin: 2,  ageMax: 12, txMin: 40,  txMax: 180, loginMin: 3, loginMax: 10, riskProb: 0.95, voteMin: 0,  voteMax: 2  },
  { tag: 'Developer',       ageMin: 10, ageMax: 36, txMin: 60,  txMax: 200, loginMin: 2, loginMax: 6,  riskProb: 0.04, voteMin: 4,  voteMax: 14 },
  { tag: 'Founder',         ageMin: 20, ageMax: 36, txMin: 100, txMax: 300, loginMin: 1, loginMax: 4,  riskProb: 0.01, voteMin: 12, voteMax: 25 },
];

// 100 deterministik profil üret
const generateProfiles = () => {
  const profiles = [];
  for (let i = 0; i < 100; i++) {
    const arcIdx = seededInt(i * 7, 0, ARCHETYPES.length - 1);
    const arc = ARCHETYPES[arcIdx];
    const seed = i * 13 + arcIdx;
    const isRisky = seededRand(seed + 99) < arc.riskProb;

    profiles.push({
      id: i + 1,
      address: genAddress(seed),
      name: `${arc.tag} #${String(i + 1).padStart(3, '0')}`,
      metrics: {
        ageInMonths:       seededInt(seed * 2,  arc.ageMin,   arc.ageMax),
        activeDays:        seededInt(seed * 3,  5,            150),
        dailyLogins:       seededInt(seed * 4,  arc.loginMin, arc.loginMax),
        txCount:           seededInt(seed * 5,  arc.txMin,    arc.txMax),
        riskyInteractions: isRisky ? 1 : 0,
        trustVotes:        seededInt(seed * 6,  arc.voteMin,  arc.voteMax),
      },
    });
  }
  return profiles;
};

export const DUMMY_PROFILES = generateProfiles();
