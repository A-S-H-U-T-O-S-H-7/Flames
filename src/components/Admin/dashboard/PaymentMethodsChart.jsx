import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const PaymentMethodsChart = ({ paymentMethods }) => {
  // Prepare data for payment methods pie chart
  const paymentMethodsData = [
    { name: 'COD', value: paymentMethods.cod },
    { name: 'Prepaid', value: paymentMethods.prepaid }
  ];
  
  // Enhanced colors with better contrast
  const PAYMENT_COLORS = ['#FF9F59', '#4ECDC4'];

  // Custom label renderer to ensure text visibility
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#ffffff" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg py-6 px-4 h-full border border-gray-800">
      <h2 className="text-xl font-bold mb-4 text-white">Payment Methods</h2>
      <div className="h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={paymentMethodsData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              labelLine={false}
              label={renderCustomizedLabel}
              strokeWidth={2}
              stroke="#121212"
            >
              {paymentMethodsData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} 
                  className="hover:opacity-90 transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} Orders`, name]}
              contentStyle={{ 
                backgroundColor: '#1E1E1E', 
                border: 'none', 
                borderRadius: '8px', 
                color: 'white',
                boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
                padding: '10px'
              }}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                paddingTop: "20px",
                color: "#ffffff"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {paymentMethodsData.map((method, index) => (
          <div key={index} className="flex border border-white rounded-md px-1 py-1 items-center justify-between">
            <div className="flex  items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: PAYMENT_COLORS[index] }}
              ></div>

              <span className="text-gray-300">{method.name}</span>

            </div>
            <span className="text-green-600 font-bold">{method.value} </span><span>Orders</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodsChart;