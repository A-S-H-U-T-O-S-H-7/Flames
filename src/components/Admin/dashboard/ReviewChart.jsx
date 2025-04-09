import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

const ReviewsChart = ({ reviewData }) => {
  const { positive, negative, reviews } = reviewData;
  
  // Transform data for chart
  const chartData = [
    { name: 'Reviews', positive, negative }
  ];
  
  // Process daily reviews data if available
  const dailyReviewsData = React.useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    
    const dateMap = {};
    reviews.forEach(review => {
      if (!dateMap[review.date]) {
        dateMap[review.date] = { date: review.date, positive: 0, negative: 0 };
      }
      
      if (review.isPositive) {
        dateMap[review.date].positive += 1;
      } else {
        dateMap[review.date].negative += 1;
      }
    });
    
    return Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [reviews]);
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-md shadow-lg border border-gray-700">
          <p className="text-gray-200 font-medium mb-2">
            {payload[0].payload.name}
          </p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="flex items-center mb-1">
              <span 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              ></span>
              <span className="text-gray-300 mr-2">{entry.name}:</span>
              <span className="text-white font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl p-6 h-full border border-gray-800">
      <h2 className="text-xl font-bold mb-5 text-gray-100">Customer Reviews</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-500 bg-opacity-20 mr-3">
              <ThumbsUp size={18} className="text-green-500" />
            </div>
            <span className="text-gray-300">Positive Reviews</span>
          </div>
          <span className="text-green-500 font-bold text-xl">{positive}</span>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-red-500 bg-opacity-20 mr-3">
              <ThumbsDown size={18} className="text-red-500" />
            </div>
            <span className="text-gray-300">Negative Reviews</span>
          </div>
          <span className="text-red-500 font-bold text-xl">{negative}</span>
        </div>
      </div>
      
      <div className="h-64">
        {dailyReviewsData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dailyReviewsData}
              margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
              barGap={0}
              barCategoryGap="10%"
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
                stroke="#9CA3AF" 
                tick={{ fontSize: 12 }} 
                axisLine={{ stroke: '#4B5563' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: 10 }}
                formatter={(value) => <span className="text-gray-200">{value}</span>}
              />
              <Bar 
                dataKey="positive" 
                name="Positive" 
                stackId="a" 
                fill="#4ADE80" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
              <Bar 
                dataKey="negative" 
                name="Negative" 
                stackId="a" 
                fill="#F87171" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No review data available for selected date range
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center text-gray-400 text-sm">
        <p>Ratings ≥ 3 are considered positive, ratings &lt; 3 are considered negative</p>
      </div>
    </div>
  );
};

export default ReviewsChart;