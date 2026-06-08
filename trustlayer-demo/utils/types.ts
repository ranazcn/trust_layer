export interface Metrics {
  ageInMonths: number;
  activeDays: number;
  dailyLogins: number;
  txCount: number;
  riskyInteractions: number;
  trustVotes: number;
}

export interface Profile {
  id?: number;
  address: string;
  name: string;
  metrics: Metrics;
}

export interface TrustResult {
  score: number;
  breakdown: string[];
  status: string;
  color: string;
}

export interface SearchState {
  query: string;
  isLoading: boolean;
  error: string | null;
}
