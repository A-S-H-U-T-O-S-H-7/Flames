import React from 'react';
import { TrendingUp } from 'lucide-react';

const TrendingProducts = ({ products, formatCurrency }) => {
  return (
    <div className="bg-gray-900 rounded-lg shadow-xl p-6 h-full border border-gray-800">
      <div className="flex items-center mb-4">
        <TrendingUp className="text-cyan-500 mr-2" size={20} />
        <h2 className="text-xl font-bold text-gray-100">Trending Products</h2>
      </div>
      
      {products.length > 0 ? (
        <div className="divide-y divide-gray-700">
          {products.map((product, index) => (
            <div key={index} className="py-3 flex justify-between items-center">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500 bg-opacity-20 mr-3">
                  <span className="text-cyan-500 font-bold text-sm">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-white font-medium">{product.name}</h3>
                  <p className="text-gray-400 text-sm">{formatCurrency(product.revenue)}</p>
                </div>
              </div>
              <div className="bg-cyan-500 bg-opacity-20 rounded-full px-3 py-1">
                <span className="text-cyan-500 font-bold">{product.qty} sold</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          No trending products data available
        </div>
      )}
    </div>
  );
};

export default TrendingProducts;