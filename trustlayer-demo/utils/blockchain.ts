/**
 * blockchain.ts
 * TrustLayer için tüm sahte blockchain verisi üreticileri.
 */

// ─── Tipler ───────────────────────────────────────────────────────────────────

export type ChainId = 'ETH' | 'POLYGON' | 'ARB' | 'BASE';

export interface NetworkStatus {
  blockNumber: number;
  gasPrice: number;     // gwei
  ethPrice: number;     // USD
  latency: number;      // ms
  tps: number;
}

export interface Transaction {
  hash: string;
  direction: 'IN' | 'OUT' | 'CONTRACT';
  counterparty: string;
  value: string;
  currency: string;
  method?: string;
  ageSeconds: number;
  status: 'confirmed' | 'pending';
}

export interface Token {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  color: string;
}

export interface RiskAlert {
  id: string;
  severity: 'LOW' | 'MED' | 'HIGH';
  category: string;
  description: string;
}

export interface ProtocolTag {
  name: string;
  color: string;
  icon: string;
}

export interface SecurityClearance {
  isHuman: boolean;        // Gitcoin Passport / ZK-KYC vb. sybil koruması
  ensName: string | null;  // On-chain kimlik
  isHardware: boolean;     // Ledger/Trezor donanım cüzdan imzası
  ageTier: string;         // 'GENESIS' | 'VETERAN' | 'NEW'
}

// ─── Sabitler ────────────────────────────────────────────────────────────────

export const CHAINS: Record<ChainId, { label: string; color: string; currency: string }> = {
  ETH:     { label: 'Ethereum',       color: '#00F5FF', currency: 'ETH' },
  POLYGON: { label: 'Polygon',        color: '#C084FC', currency: 'MATIC' },
  ARB:     { label: 'Arbitrum',       color: '#00FF88', currency: 'ETH' },
  BASE:    { label: 'Base',           color: '#FFE600', currency: 'ETH' },
};

const TX_METHODS = ['transfer()', 'swap()', 'approve()', 'mint()', 'stake()', 'claim()'];
const PROTOCOLS: ProtocolTag[] = [
  { name: 'Uniswap',  color: '#FF007A', icon: '🦄' },
  { name: 'Aave',     color: '#B6509E', icon: '👻' },
  { name: 'OpenSea',  color: '#2081E2', icon: '🌊' },
  { name: 'ENS',      color: '#5298FF', icon: '🔵' },
  { name: 'Compound', color: '#00D395', icon: '🏛' },
  { name: 'Lido',     color: '#00A3FF', icon: '🔷' },
  { name: 'Curve',    color: '#FF0000', icon: '📈' },
  { name: 'dYdX',     color: '#6966FF', icon: '📊' },
];

const TOKENS: Omit<Token, 'balance' | 'usdValue'>[] = [
  { symbol: 'ETH',   name: 'Ethereum',      color: '#00F5FF' },
  { symbol: 'USDC',  name: 'USD Coin',      color: '#2775CA' },
  { symbol: 'USDT',  name: 'Tether USD',    color: '#26A17B' },
  { symbol: 'LINK',  name: 'Chainlink',     color: '#375BD2' },
  { symbol: 'UNI',   name: 'Uniswap',       color: '#FF007A' },
  { symbol: 'AAVE',  name: 'Aave',          color: '#B6509E' },
  { symbol: 'MATIC', name: 'Polygon',       color: '#C084FC' },
  { symbol: 'ARB',   name: 'Arbitrum',      color: '#28A0F0' },
  { symbol: 'OP',    name: 'Optimism',      color: '#FF0420' },
  { symbol: 'AERO',  name: 'Aerodrome',     color: '#0052FF' },
  { symbol: 'GMX',   name: 'GMX',           color: '#28A0F0' },
];

const RISK_POOL: Omit<RiskAlert, 'id'>[] = [
  { severity: 'HIGH', category: 'MIXER_CONTACT',     description: 'Interaction with Tornado Cash contract detected.' },
  { severity: 'HIGH', category: 'PHISHING',          description: 'Approval given to a known phishing contract.' },
  { severity: 'MED',  category: 'SUSPICIOUS_DRAIN',  description: 'Token drain pattern observed (Approval exploit).' },
  { severity: 'MED',  category: 'HIGH_VELOCITY',     description: 'Abnormal transaction velocity — suspected bot activity.' },
  { severity: 'LOW',  category: 'UNVERIFIED_CONTRACT', description: 'Interaction with an unverified contract address.' },
  { severity: 'LOW',  category: 'UNUSUAL_GAS',       description: 'Unusually high gas limit detected.' },
];

// ─── Yardımcı ────────────────────────────────────────────────────────────────

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randFloat = (min: number, max: number, decimals = 2) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

const shortHash = () => {
  const hex = '0123456789abcdef';
  let h = '0x';
  for (let i = 0; i < 8; i++) h += hex[rand(0, 15)];
  return h + '...';
};

// ─── Üreticiler ──────────────────────────────────────────────────────────────

/**
 * Canlı ağ durumu verisi üret
 */
export const generateNetworkStatus = (chainId: ChainId): NetworkStatus => ({
  blockNumber: 19_000_000 + rand(0, 500_000),
  gasPrice:    chainId === 'ETH' ? randFloat(12, 80, 1) : randFloat(0.001, 0.05, 4),
  ethPrice:    randFloat(2_400, 3_800, 0),
  latency:     rand(80, 320),
  tps:         chainId === 'ETH' ? rand(12, 25) : rand(100, 4000),
});

/**
 * Sahte işlem geçmişi üret
 */
export const generateTxHistory = (riskyInteractions: number, chainId: ChainId): Transaction[] => {
  const count = rand(4, 7);
  const currency = CHAINS[chainId].currency;
  return Array.from({ length: count }, (_, i) => {
    const dir = rand(0, 2) as 0 | 1 | 2;
    const direction = dir === 0 ? 'IN' : dir === 1 ? 'OUT' : 'CONTRACT';
    return {
      hash: shortHash(),
      direction,
      counterparty: shortHash(),
      value: direction === 'CONTRACT' ? '0.000' : randFloat(0.001, 5.0, 3).toString(),
      currency,
      method: direction === 'CONTRACT' ? TX_METHODS[rand(0, TX_METHODS.length - 1)] : undefined,
      ageSeconds: rand(10, 86400 * 7),
      status: i === 0 && Math.random() > 0.7 ? 'pending' : 'confirmed',
    };
  });
};

/**
 * Token portföyü üret
 */
export const generateTokenPortfolio = (chainId: ChainId): Token[] => {
  const count = rand(2, 5);
  // Chain'e özel tokenleri başa al
  const nativeSymbol = CHAINS[chainId].currency;
  let availableTokens = [...TOKENS];
  
  if (chainId === 'POLYGON') availableTokens = availableTokens.filter(t => ['MATIC', 'USDC', 'USDT', 'LINK', 'AAVE'].includes(t.symbol));
  else if (chainId === 'ARB') availableTokens = availableTokens.filter(t => ['ETH', 'ARB', 'USDC', 'GMX', 'LINK'].includes(t.symbol));
  else if (chainId === 'BASE') availableTokens = availableTokens.filter(t => ['ETH', 'USDC', 'AERO'].includes(t.symbol));
  else availableTokens = availableTokens.filter(t => !['ARB', 'OP', 'AERO', 'GMX', 'MATIC'].includes(t.symbol));

  // Native token her zaman olsun
  const nativeToken = availableTokens.find(t => t.symbol === nativeSymbol) || TOKENS.find(t => t.symbol === nativeSymbol)!;
  const others = availableTokens.filter(t => t.symbol !== nativeSymbol).sort(() => Math.random() - 0.5).slice(0, count - 1);
  const selected = [nativeToken, ...others];

  return selected.map((t) => {
    const balance = ['USDC', 'USDT'].includes(t.symbol)
      ? randFloat(100, 10000, 2)
      : randFloat(0.01, 10, 4);
    const price = t.symbol === 'ETH' ? 3200 :
                  ['USDC', 'USDT'].includes(t.symbol) ? 1 :
                  t.symbol === 'LINK' ? 14 :
                  t.symbol === 'UNI' ? 8 :
                  t.symbol === 'AAVE' ? 120 : 
                  t.symbol === 'ARB' ? 1.5 :
                  t.symbol === 'AERO' ? 0.8 :
                  t.symbol === 'GMX' ? 30 :
                  t.symbol === 'MATIC' ? 0.7 : 0.5;
    return { ...t, balance, usdValue: parseFloat((balance * price).toFixed(2)) };
  });
};

/**
 * Risk uyarıları üret
 */
export const generateRiskAlerts = (riskyInteractions: number): RiskAlert[] => {
  if (riskyInteractions === 0) return [];
  const count = rand(1, 3);
  const shuffled = [...RISK_POOL].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map((r, i) => ({ ...r, id: `risk_${i}` }));
};

/**
 * Protokol etiketleri üret
 */
export const generateProtocolTags = (txCount: number, chainId: ChainId): ProtocolTag[] => {
  const count = Math.min(Math.floor(txCount / 8) + rand(1, 3), PROTOCOLS.length);
  
  let available = [...PROTOCOLS];
  if (chainId === 'POLYGON') available.push({ name: 'QuickSwap', color: '#2172E5', icon: '⚡' }, { name: 'Aave V3', color: '#B6509E', icon: '👻' });
  else if (chainId === 'ARB') available.push({ name: 'GMX', color: '#28A0F0', icon: '🫐' }, { name: 'Camelot', color: '#FFA500', icon: '🐪' });
  else if (chainId === 'BASE') available.push({ name: 'Aerodrome', color: '#0052FF', icon: '✈️' }, { name: 'FriendTech', color: '#1DA1F2', icon: '🤝' });

  return available.sort(() => Math.random() - 0.5).slice(0, Math.max(1, count));
};

/**
 * Cüzdan DNA'sı için adres bazlı renk paleti üret
 */
export const generateWalletDNA = (address: string): string[] => {
  const seed = address.toLowerCase().replace('0x', '');
  const palette: string[] = [];
  for (let i = 0; i < 8; i++) {
    const chunk = seed.slice(i * 5, i * 5 + 6).padEnd(6, '0');
    palette.push(`#${chunk}`);
  }
  return palette;
};

/**
 * Süreyi okunabilir formata çevir
 */
export const formatAge = (seconds: number): string => {
  if (seconds < 60)   return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

/**
 * Ekstra güven parametreleri (Security Clearance) üret
 */
export const generateSecurityClearance = (address: string, ageInMonths: number): SecurityClearance => {
  const seed = address.charCodeAt(address.length - 1);
  const isHuman = seed % 3 !== 0; // %66 ihtimalle doğrulanmış insan (bot değil)
  
  // %30 ihtimalle ENS ismi
  const ensNames = ['vitalik.eth', 'punk.eth', 'defi_chad.eth', 'vault.eth', 'treasury.eth'];
  const ensName = seed % 10 < 3 ? ensNames[seed % ensNames.length] : null;

  // %20 ihtimalle donanım cüzdanı
  const isHardware = seed % 5 === 0;

  let ageTier = 'NEW';
  if (ageInMonths > 24) ageTier = 'GENESIS_ERA';
  else if (ageInMonths > 6) ageTier = 'VETERAN';

  return { isHuman, ensName, isHardware, ageTier };
};
