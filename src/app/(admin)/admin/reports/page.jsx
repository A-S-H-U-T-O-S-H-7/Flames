"use client";

import { useState } from 'react';
import PermissionGuard from '@/components/Admin/PermissionGuard';
import { FaChartLine, FaChartBar, FaChartPie, FaDownload, FaCalendarAlt, FaFilter } from 'react-icons/fa';

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState('sales');
  const [dateRange, setDateRange] = useState('30days');
  
  const tabs = [
    { id: 'sales', label: 'Sales Reports' },
    { id: 'products', label: 'Product Analytics' },
    { id: 'customers', label: 'Customer Insights' },
    { id: 'sellers', label: 'Seller Performance' },
    { id: 'financial', label: 'Financial Reports' }
  ];

  const reportCards = [
    {
      title: 'Sales Performance Report',
      description: 'Detailed sales analysis with trends and comparisons',
      icon: <FaChartLine className="text-2xl text-blue-600" />,
      type: 'sales',
      downloadFormat: ['PDF', 'Excel', 'CSV']
    },
    {
      title: 'Product Performance Analysis',
      description: 'Best/worst performing products, inventory turnover',
      icon: <FaChartBar className="text-2xl text-green-600" />,
      type: 'products',
      downloadFormat: ['PDF', 'Excel']
    },
    {
      title: 'Customer Behavior Report',
      description: 'Customer demographics, purchase patterns, retention',
      icon: <FaChartPie className="text-2xl text-purple-600" />,
      type: 'customers',
      downloadFormat: ['PDF', 'Excel']
    },
    {
      title: 'Seller Commission Report',
      description: 'Seller earnings, commission tracking, payout summaries',
      icon: <FaChartLine className="text-2xl text-orange-600" />,
      type: 'sellers',
      downloadFormat: ['PDF', 'Excel', 'CSV']
    },
    {
      title: 'Revenue & Profit Analysis',
      description: 'Revenue breakdown, profit margins, cost analysis',
      icon: <FaChartBar className="text-2xl text-red-600" />,
      type: 'financial',
      downloadFormat: ['PDF', 'Excel']
    },
    {
      title: 'Inventory Valuation Report',
      description: 'Stock value, dead stock analysis, reorder points',
      icon: <FaChartPie className="text-2xl text-teal-600" />,
      type: 'inventory',
      downloadFormat: ['PDF', 'Excel']
    }
  ];

  const handleDownload = (reportType, format) => {
    console.log(`Downloading ${reportType} report in ${format} format`);
    // Implement download logic here
  };

  return (
    <PermissionGuard requiredPermission="reports">
      <main className="flex min-h-screen flex-col gap-4 p-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Generate comprehensive business reports and insights</p>
          </div>
          <div className="flex gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
            <button className="flex items-center gap-2 bg-blue-800 border border-[#22c7d5] text-white text-base font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <FaFilter />
              Advanced Filters
            </button>
          </div>
        </div>
        
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹284,590</p>
                <p className="text-sm text-green-600 dark:text-green-400">+12.5% from last month</p>
              </div>
              <FaChartLine className="text-3xl text-green-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1,847</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">+8.2% from last month</p>
              </div>
              <FaChartBar className="text-3xl text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Sellers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
                <p className="text-sm text-purple-600 dark:text-purple-400">+5 new this month</p>
              </div>
              <FaChartPie className="text-3xl text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹154.20</p>
                <p className="text-sm text-orange-600 dark:text-orange-400">+3.1% from last month</p>
              </div>
              <FaChartLine className="text-3xl text-orange-600" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#22c7d5] text-white'
                  : 'bg-gray-100 dark:bg-[#0e1726] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1e2737]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCards
            .filter(report => activeTab === 'sales' || report.type === activeTab || report.type === 'inventory')
            .map((report, index) => (
            <div key={index} className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {report.icon}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-3 mb-2">{report.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{report.description}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {report.downloadFormat.map((format) => (
                  <button
                    key={format}
                    onClick={() => handleDownload(report.type, format)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                  >
                    <FaDownload className="text-xs" />
                    {format}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Scheduled Reports */}
        <div className="mt-8">
          <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Scheduled Reports</h2>
              <button className="px-4 py-2 bg-[#22c7d5] text-white rounded-lg hover:bg-[#1aa5b5] transition-colors">
                Schedule New Report
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Monthly Sales Report</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sent every 1st of the month</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Edit</button>
                  <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">Delete</button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Weekly Inventory Alert</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sent every Monday</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Edit</button>
                  <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PermissionGuard>
  );
}