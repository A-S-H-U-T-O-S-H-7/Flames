import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const OrdersRevenueChart = ({ dailyOrders, formatCurrency }) => {
  // Custom tooltip component for better styling
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-md shadow-lg border border-gray-700">
          <p className="text-gray-200 font-medium mb-1">
            {new Date(label).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="flex justify-between items-center">
              <span className="font-medium mr-2">{entry.name}:</span>
              <span className="font-bold">
                {entry.name === 'Revenue' ? formatCurrency(entry.value) : entry.value}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl p-6 h-full border border-gray-800">
      <h2 className="text-xl font-bold mb-5 text-gray-100">Orders & Revenue Trend</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dailyOrders}
            margin={{ top: 5, right: 30, left: 20, bottom: 15 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} 
              stroke="#9CA3AF" 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#4B5563' }}
            />
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              stroke="#9CA3AF" 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#4B5563' }}
              tickFormatter={(value) => value}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#9CA3AF" 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#4B5563' }}
              tickFormatter={(value) => formatCurrency(value).slice(0, -3)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: 10 }}
              formatter={(value) => <span className="text-gray-200">{value}</span>}
            />
            <Bar 
              yAxisId="left" 
              dataKey="orders" 
              name="Orders" 
              fill="#8B5CF6" /* Purple */
              radius={[4, 4, 0, 0]}
              barSize={25}
              animationDuration={1500}
            />
            <Bar 
              yAxisId="right" 
              dataKey="revenue" 
              name="Revenue" 
              fill="#EC4899" /* Pink */
              radius={[4, 4, 0, 0]}
              barSize={25}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrdersRevenueChart;