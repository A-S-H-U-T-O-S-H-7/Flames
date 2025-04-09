import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const AgeGroupsChart = ({ ageGroups }) => {
  // Transform the data for the chart
  const chartData = Object.entries(ageGroups).map(([range, count]) => ({
    range,
    count
  }));
  
  // Color array for different age groups
  const colors = ['#8B5CF6', '#EC4899', '#F59E0B', '#22C55E'];
  
  // Calculate total for percentages
  const total = chartData.reduce((sum, item) => sum + item.count, 0);
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-gray-800 p-3 rounded-md shadow-lg border border-gray-700">
          <p className="text-gray-200 font-medium mb-1">
            Age Group: {payload[0].payload.range}
          </p>
          <p className="text-white font-bold flex items-center">
            <span className="mr-2">Count:</span>
            <span>{payload[0].value}</span>
          </p>
          <p className="text-gray-300 font-medium">
            <span>{percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label renderer
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl p-6 h-full border border-gray-800">
      <h2 className="text-xl font-bold mb-5 text-gray-100">Customer Age Demographics</h2>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              innerRadius={0}
              fill="#8884d8"
              dataKey="count"
              animationDuration={1500}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-3">
        {chartData.map((item, index) => {
          const percentage = ((item.count / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center justify-between bg-gray-800 rounded-md p-2">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <span className="text-gray-300">{item.range} years</span>
              </div>
              <div className="text-right">
                <span className="text-cyan-500 font-bold">{item.count}</span>
                <span className="text-gray-400 text-sm ml-1">({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgeGroupsChart;