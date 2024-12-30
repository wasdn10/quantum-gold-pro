import React, { useEffect } from "react";
import { useGoldStore } from "./store/goldStore";
import PriceChart from "./components/PriceChart";
import PriceCard from "./components/PriceCard";
import { motion } from "framer-motion";

const App: React.FC = () => {
  const {
    prices,
    historical,
    loading,
    error,
    selectedCurrency,
    fetchPrices,
    fetchHistorical,
    setSelectedCurrency,
  } = useGoldStore();

  useEffect(() => {
    fetchPrices();
    fetchHistorical(selectedCurrency);
    const interval = setInterval(fetchPrices, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const currencies = ["USD", "EUR", "MYR"];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text mb-2">
          Quantum Gold Pro
        </h1>
        <p className="text-gray-400">
          Real-time Gold Price Tracker ({new Date().toUTCString()})
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {/* Currency Selector */}
        <div className="flex justify-center mb-6">
          {currencies.map((currency) => (
            <motion.button
              key={currency}
              onClick={() => setSelectedCurrency(currency)}
              className={`px-4 py-2 mx-2 rounded-lg text-sm font-medium transition-all ${
                selectedCurrency === currency
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Select ${currency}`}
            >
              {currency}
            </motion.button>
          ))}
        </div>

        {/* Price Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {currencies.map((currency) => (
            <PriceCard
              key={currency}
              currency={currency}
              price={prices[currency] || 0}
              change24h={
                historical[currency]?.length
                  ? ((prices[currency] -
                      historical[currency][historical[currency].length - 1]
                        ?.price) /
                      historical[currency][historical[currency].length - 1]
                        ?.price) *
                    100
                  : 0
              }
            />
          ))}
        </div>

        {/* Historical Chart */}
        <div>
          {historical[selectedCurrency]?.length ? (
            <PriceChart
              data={historical[selectedCurrency]}
              currency={selectedCurrency}
            />
          ) : (
            <p className="text-center text-gray-400">
              No historical data available for {selectedCurrency}.
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 text-center text-red-500 font-bold">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mt-6 text-center text-gray-400 font-bold">
            Loading data...
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-10 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Quantum Gold Pro. All Rights Reserved.
      </footer>
    </div>
  );
};

export default App;
