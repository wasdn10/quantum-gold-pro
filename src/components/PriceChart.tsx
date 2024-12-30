import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

interface PriceChartProps {
  data: any[];
  currency: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, currency }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatPrice = (price: number) => {
    return `${currency} ${price.toFixed(2)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-[400px] w-full bg-gray-800 rounded-lg p-4 shadow-lg"
      aria-label="Gold price historical chart"
    >
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatDate}
            stroke="#9CA3AF"
          />
          <YAxis stroke="#9CA3AF" tickFormatter={formatPrice} />
          <Tooltip
            formatter={(value: number) => [formatPrice(value), "Price"]}
            contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#FCD34D"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default PriceChart;
