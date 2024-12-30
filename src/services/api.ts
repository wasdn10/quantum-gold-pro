import axios from "axios";

const BASE_URL = "https://api.metals.live/v1";
const CURRENCY_API = "https://api.exchangerate-api.com/v4/latest/USD";

interface GoldPrice {
  currency: string;
  price: number;
  change24h: number;
  timestamp: number;
}

interface CurrencyRates {
  [key: string]: number;
}

class GoldAPI {
  private static instance: GoldAPI;
  private currencyRates: CurrencyRates = {};
  private cacheTime: number = 0;

  private constructor() {
    this.updateCurrencyRates();
    setInterval(() => this.updateCurrencyRates(), 3600000); // Update rates every hour
  }

  public static getInstance(): GoldAPI {
    if (!GoldAPI.instance) {
      GoldAPI.instance = new GoldAPI();
    }
    return GoldAPI.instance;
  }

  private async updateCurrencyRates(): Promise<void> {
    if (Date.now() - this.cacheTime < 3600000) return; // Cache for 1 hour
    try {
      const response = await axios.get(CURRENCY_API);
      this.currencyRates = response.data.rates;
      this.cacheTime = Date.now();
    } catch (error) {
      console.error("Error updating currency rates:", error);
    }
  }

  public async getGoldPrice(currency: string = "USD"): Promise<GoldPrice> {
    try {
      const response = await axios.get(`${BASE_URL}/spot/gold`);
      const usdPrice = response.data.price;
      const rate = this.currencyRates[currency] || 1;

      return {
        currency,
        price: usdPrice * rate,
        change24h: response.data.change24h * rate,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("Error fetching gold price:", error);
      throw new Error("Unable to fetch gold price");
    }
  }

  public async getHistoricalData(
    currency: string = "USD",
    days: number = 30
  ): Promise<GoldPrice[]> {
    try {
      const response = await axios.get(`${BASE_URL}/spot/gold/historical/${days}`);
      const rate = this.currencyRates[currency] || 1;

      return response.data.map((item: any) => ({
        currency,
        price: item.price * rate,
        timestamp: new Date(item.timestamp).getTime(),
        change24h: 0,
      }));
    } catch (error) {
      console.error("Error fetching historical data:", error);
      throw new Error("Unable to fetch historical data");
    }
  }
}

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export const goldAPI = GoldAPI.getInstance();
