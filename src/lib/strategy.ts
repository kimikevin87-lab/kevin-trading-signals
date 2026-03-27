import { Signal, Direction } from '../types';

export const calculateLotSize = (balance: number, riskPercent: number, stopPips: number) => {
  const riskAmount = balance * (riskPercent / 100);
  return (riskAmount / (stopPips * 10)).toFixed(2);
};

export const MOCK_SIGNALS: Signal[] = [
  {
    id: '1',
    pair: 'XAUUSD',
    timeframe: 'M5',
    direction: 'BUY',
    timestamp: new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }),
    price: 2345.50,
    stopLoss: 2340.25,
    takeProfit: 2356.00,
    lotSize: 0.38,
    riskReward: '1:2',
    marketStructure: {
      liquiditySweep: true,
      bos: true,
      recentHigh: 2348.00,
      recentLow: 2340.00
    },
    ensemble: {
      traderA: { score: 7.5, direction: 'BUY', checklist: {} },
      traderB: { score: 8, direction: 'BUY', checklist: {} },
      traderC: { score: 6.68, direction: 'BUY', checklist: {} },
      ensembleScore: 7.39,
      agreement: 3,
      finalSignal: 'BUY'
    },
    gates: Array.from({ length: 7 }, (_, i) => ({
      id: i + 1,
      name: `Gate ${i + 1}`,
      description: 'System check passed',
      passed: true
    }))
  }
];

export const STRATEGY_GATES = [
  { id: 1, name: 'MACRO ALIGNMENT', description: 'DXY, 10Y yields, central bank tone agree' },
  { id: 2, name: 'HTF ALIGNMENT', description: 'At least 2 Traders agree' },
  { id: 3, name: 'SMART MONEY SETUP', description: 'ILDM score ≥4' },
  { id: 4, name: 'MARKET PHASE', description: 'Price in MANIPULATION (liquidity sweep confirmed)' },
  { id: 5, name: 'M5 CONFIRMATION', description: 'Clean BOS or strong pivot candle on M5' },
  { id: 6, name: 'RISK & TARGET', description: 'R:R ≥ 1:2 achievable' },
  { id: 7, name: 'HARD FILTERS', description: 'NY Overlap, ≤2 trades/day, no news' },
];