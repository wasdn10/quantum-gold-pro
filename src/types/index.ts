export interface GoldPrice {
  currency: string;
  price: number;
  change24h: number;
  changePercent: number;
  timestamp: number;
}

export interface HistoricalData {
  timestamp: number;
  price: number;
}

export type CurrencyCode = 'USD' | 'EUR' | 'MYR';

export interface MarketStats {
  high24h: number;
  low24h: number;
  volume24h: number;
  lastUpdate: string;
}
