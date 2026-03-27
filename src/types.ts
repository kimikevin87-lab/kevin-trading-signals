export type Pair = 'EURUSD' | 'XAUUSD' | 'USDJPY';
export type Direction = 'BUY' | 'SELL' | 'NEUTRAL';
export type MarketStructure = 'BULLISH' | 'BEARISH' | 'NEUTRAL';

export interface TraderVote {
  score: number;
  direction: Direction;
  checklist: { [key: string]: boolean };
}

export interface EnsembleResult {
  traderA: TraderVote;
  traderB: TraderVote;
  traderC: TraderVote;
  ensembleScore: number;
  agreement: number;
  finalSignal: Direction;
}

export interface GateStatus {
  id: number;
  name: string;
  description: string;
  passed: boolean;
}

export interface Signal {
  id: string;
  pair: Pair;
  timeframe: string;
  direction: Direction;
  timestamp: string;
  price: number;
  stopLoss: number;
  takeProfit: number;
  lotSize: number;
  riskReward: string;
  ensemble: EnsembleResult;
  gates: GateStatus[];
  marketStructure: {
    liquiditySweep: boolean;
    bos: boolean;
    recentHigh: number;
    recentLow: number;
  };
}