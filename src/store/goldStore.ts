import create from "zustand";
import { goldAPI } from "../services/api";

interface GoldState {
  prices: { [key: string]: number };
  historical: { [key: string]: any[] };
  loading: boolean;
  error: string | null;
  selectedCurrency: string;
  fetchPrices: () => Promise<void>;
  fetchHistorical: (currency: string) => Promise<void>;
  setSelectedCurrency: (currency: string) => void;
}

export const useGoldStore = create<GoldState>((set, get) => ({
  prices: {},
  historical: {},
  loading: false,
  error: null,
  selectedCurrency: "USD",

  fetchPrices: async () => {
    set({ loading: true, error: null });
    try {
      const currencies = ["USD", "EUR", "MYR"];
      const prices: { [key: string]: number } = {};

      await Promise.all(
        currencies.map(async (currency) => {
          const data = await goldAPI.getGoldPrice(currency);
          prices[currency] = data.price;
        })
      );

      set({ prices, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch prices. Retrying...", loading: true });
      setTimeout(get().fetchPrices, 5000); // Retry after 5 seconds
    }
  },

  fetchHistorical: async (currency: string) => {
    try {
      const data = await goldAPI.getHistoricalData(currency);
      set((state) => ({
        historical: {
          ...state.historical,
          [currency]: data,
        },
      }));
    } catch (error) {
      set({ error: "Failed to fetch historical data" });
    }
  },

  setSelectedCurrency: (currency: string) => {
    set({ selectedCurrency: currency });
    const state = get();
    if (!state.historical[currency]) {
      state.fetchHistorical(currency);
    }
  },
}))
