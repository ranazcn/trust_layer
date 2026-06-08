import { Metrics, TrustResult } from './types';
import { TRUST_SCORE, TRUST_STATUS } from './constants';

export const calculateTrustScore = (metrics: Metrics): TrustResult => {
  let score = TRUST_SCORE.BASE_SCORE;
  const breakdown: string[] = [];

  // Account Age Score
  const ageScore = Math.min(
    metrics.ageInMonths * TRUST_SCORE.AGE_MULTIPLIER,
    TRUST_SCORE.AGE_MAX_BONUS
  );
  score += ageScore;
  breakdown.push(`Wallet Age: +${ageScore}`);

  // Risky Interactions Score
  if (metrics.riskyInteractions > 0) {
    score -= TRUST_SCORE.RISKY_INTERACTION_PENALTY;
    breakdown.push(
      `Risky Address Contact: -${TRUST_SCORE.RISKY_INTERACTION_PENALTY}`
    );
  } else {
    score += TRUST_SCORE.CLEAN_HISTORY_BONUS;
    breakdown.push(`Clean History: +${TRUST_SCORE.CLEAN_HISTORY_BONUS}`);
  }

  // Transaction Pattern Score
  if (
    metrics.txCount > TRUST_SCORE.ABNORMAL_TX_THRESHOLD ||
    metrics.dailyLogins > TRUST_SCORE.ABNORMAL_LOGIN_THRESHOLD
  ) {
    score -= TRUST_SCORE.ABNORMAL_ACTIVITY_PENALTY;
    breakdown.push(
      `Abnormal Activity (Bot Suspected): -${TRUST_SCORE.ABNORMAL_ACTIVITY_PENALTY}`
    );
  } else if (metrics.txCount > TRUST_SCORE.NORMAL_TX_THRESHOLD) {
    score += TRUST_SCORE.NORMAL_ACTIVITY_BONUS;
    breakdown.push(
      `Regular Transaction Pattern: +${TRUST_SCORE.NORMAL_ACTIVITY_BONUS}`
    );
  }

  // Community Votes Score
  const voteScore = Math.min(
    metrics.trustVotes * TRUST_SCORE.VOTE_MULTIPLIER,
    TRUST_SCORE.VOTE_MAX_BONUS
  );
  score += voteScore;
  if (voteScore > 0) breakdown.push(`Community Approval: +${voteScore}`);

  // Clamp Score
  score = Math.max(
    TRUST_SCORE.MIN_SCORE,
    Math.min(score, TRUST_SCORE.MAX_SCORE)
  );

  // Determine Status and Color
  const { status, color } = getStatusAndColor(score);

  return { score, breakdown, status, color };
};

export const getStatusAndColor = (
  score: number
): { status: string; color: string } => {
  if (score >= TRUST_STATUS.TRUSTED.minScore) {
    return {
      status: TRUST_STATUS.TRUSTED.label,
      color: TRUST_STATUS.TRUSTED.color,
    };
  } else if (score >= TRUST_STATUS.MEDIUM.minScore) {
    return {
      status: TRUST_STATUS.MEDIUM.label,
      color: TRUST_STATUS.MEDIUM.color,
    };
  } else {
    return {
      status: TRUST_STATUS.RISKY.label,
      color: TRUST_STATUS.RISKY.color,
    };
  }
};

export const generateRandomMetrics = (): Metrics => {
  return {
    ageInMonths: generateRandomInRange(1, 36),
    activeDays: generateRandomInRange(5, 150),
    dailyLogins: generateRandomInRange(1, 12),
    txCount: generateRandomInRange(1, 350),
    riskyInteractions: Math.random() > TRUST_SCORE.RISKY_INTERACTION_PROBABILITY ? 1 : 0,
    trustVotes: Math.floor(Math.random() * 8),
  };
};

export const generateTxHash = (): string => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 40; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

export const generateBlockNumber = (): number => {
  // Gerçekçi bir Ethereum blok numarası üretir (~her 12 saniyede bir blok)
  const BASE_BLOCK = 19_000_000;
  return BASE_BLOCK + Math.floor(Math.random() * 500_000);
};

export const isValidAddress = (address: string): boolean => {
  // Tam Ethereum adresi (0x + 40 hex karakter) VEYA demo için en az 10 karakter
  return /^0x[a-fA-F0-9]{40}$/.test(address) || address.length >= 10;
};

const generateRandomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
