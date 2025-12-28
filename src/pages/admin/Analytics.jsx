import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Package, ShoppingBag, Calendar } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { analyticsService } from '../../services/analyticsService';
import { orderService } from '../../services/orderService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);
  const [salesTrend, setSalesTrend] = useState({ dates: [], sales: [] });
  const [topProducts, setTopProducts] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState({});
  const [revenueSummary, setRevenueSummary] = useState({});
  const [orderStats, setOrderStats] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [salesData, productsData, categoryData, revenueData, statsData] = await Promise.all([
        analyticsService.getSalesTrend(timeRange),
        analyticsService.getTopProducts(10),
        analyticsService.getCategoryDistribution(),
        analyticsService.getRevenueSummary(),
        orderService.getOrderStats(),
      ]);

      setSalesTrend(salesData);
      setTopProducts(productsData);
      setCategoryDistribution(categoryData);
      setRevenueSummary(revenueData);
      setOrderStats(statsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sales Trend Chart Data
  const salesChartData = {
    labels: salesTrend.dates,
    datasets: [
      {
        label: 'Daily Sales (₹)',
        data: salesTrend.sales,
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const salesChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Sales Trend - Last ${timeRange} Days`,
        font: { size: 16, weight: 'bold' },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => '₹' + value.toLocaleString(),
        },
      },
    },
  };

  // Top Products Chart Data
  const topProductsChartData = {
    labels: topProducts.map(p => p.name),
    datasets: [
      {
        label: 'Units Sold',
        data: topProducts.map(p => p.soldCount),
        backgroundColor: [
          'rgba(236, 72, 153, 0.8)',
          'rgba(219, 39, 119, 0.8)',
          'rgba(190, 24, 93, 0.8)',
          'rgba(157, 23, 77, 0.8)',
          'rgba(131, 24, 67, 0.8)',
          'rgba(236, 72, 153, 0.6)',
          'rgba(219, 39, 119, 0.6)',
          'rgba(190, 24, 93, 0.6)',
          'rgba(157, 23, 77, 0.6)',
          'rgba(131, 24, 67, 0.6)',
        ],
      },
    ],
  };

  const topProductsChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Top 10 Best Selling Products',
        font: { size: 16, weight: 'bold' },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Category Distribution Chart Data
  const categoryChartData = {
    labels: Object.keys(categoryDistribution),
    datasets: [
      {
        data: Object.values(categoryDistribution),
        backgroundColor: [
          'rgba(236, 72, 153, 0.8)',
          'rgba(219, 39, 119, 0.8)',
          'rgba(190, 24, 93, 0.8)',
          'rgba(157, 23, 77, 0.8)',
          'rgba(131, 24, 67, 0.8)',
        ],
        borderColor: [
          'rgb(236, 72, 153)',
          'rgb(219, 39, 119)',
          'rgb(190, 24, 93)',
          'rgb(157, 23, 77)',
          'rgb(131, 24, 67)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Sales by Category',
        font: { size: 16, weight: 'bold' },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex gap-2">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === days
                  ? 'bg-pink-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-8 w-8 opacity-80" />
            <span className="text-sm font-medium">Today</span>
          </div>
          <p className="text-3xl font-bold">₹{revenueSummary.today?.toFixed(2) || '0.00'}</p>
          <p className="text-sm opacity-80 mt-1">Today's Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8 opacity-80" />
            <span className="text-sm font-medium">Week</span>
          </div>
          <p className="text-3xl font-bold">₹{revenueSummary.week?.toFixed(2) || '0.00'}</p>
          <p className="text-sm opacity-80 mt-1">This Week</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8 opacity-80" />
            <span className="text-sm font-medium">Month</span>
          </div>
          <p className="text-3xl font-bold">₹{revenueSummary.month?.toFixed(2) || '0.00'}</p>
          <p className="text-sm opacity-80 mt-1">This Month</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-rose-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <ShoppingBag className="h-8 w-8 opacity-80" />
            <span className="text-sm font-medium">All Time</span>
          </div>
          <p className="text-3xl font-bold">₹{orderStats?.totalRevenue?.toFixed(2) || '0.00'}</p>
          <p className="text-sm opacity-80 mt-1">Total Revenue</p>
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: 'Total', value: orderStats?.totalOrders, color: 'bg-gray-100 text-gray-800' },
          { label: 'Pending', value: orderStats?.pendingOrders, color: 'bg-yellow-100 text-yellow-800' },
          { label: 'Confirmed', value: orderStats?.confirmedOrders, color: 'bg-blue-100 text-blue-800' },
          { label: 'Shipped', value: orderStats?.shippedOrders, color: 'bg-indigo-100 text-indigo-800' },
          { label: 'Delivered', value: orderStats?.deliveredOrders, color: 'bg-green-100 text-green-800' },
          { label: 'Cancelled', value: orderStats?.cancelledOrders, color: 'bg-red-100 text-red-800' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} p-4 rounded-lg text-center`}>
            <p className="text-2xl font-bold">{stat.value || 0}</p>
            <p className="text-sm font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Line data={salesChartData} options={salesChartOptions} />
        </div>

        {/* Top Products Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Bar data={topProductsChartData} options={topProductsChartOptions} />
        </div>

        {/* Category Distribution Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Doughnut data={categoryChartData} options={categoryChartOptions} />
        </div>

        {/* Top Products Table */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold mb-4">Top Products Revenue</h3>
          <div className="space-y-3">
            {topProducts.slice(0, 5).map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-pink-600 font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-600">{product.soldCount} sold</p>
                  </div>
                </div>
                <span className="font-bold text-pink-600">₹{product.revenue?.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;