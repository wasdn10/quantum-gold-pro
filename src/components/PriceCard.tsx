import React from "react";
import { motion } from "framer-motion";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

interface PriceCardProps {
  currency: string;
  price: number;
  change24h: number;
}

const PriceCard: React.FC<PriceCardProps> = ({ currency, price, change24h }) => {
  const isPositive = change24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="bg-gray-800 rounded-lg p-6 shadow-xl transition-transform"
      aria-label={`Gold price in ${currency}`}
    >
      <h3 className="text-gray-400 text-lg mb-2">Gold/{currency}</h3>
      <div className="text-3xl font-bold mb-4">
        {currency} {price.toFixed(2)}
      </div>
      <div
        className={`flex items-center ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}
      >
        {isPositive ? <FaArrowUp /> : <FaArrowDown />}
        <span className="ml-2">{Math.abs(change24h).toFixed(2)}%</span>
      </div>
    </motion.div>
  );
};

export default PriceCard;
