import React, { useState } from 'react';
import { 
  Download, 
  Calendar, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Package,
  ShoppingCart,
  BarChart3,
  PieChart,
  Clock,
  CheckCircle,
  X
} from 'lucide-react';

const reportTypes = [
  {
    id: 'sales',
    name: 'Sales Report',
    description: 'Detailed sales analysis and revenue breakdown',
    icon: DollarSign,
    category: 'financial'
  },
  {
    id: 'orders',
    name: 'Orders Report',
    description: 'Order processing and fulfillment statistics',
    icon: ShoppingCart,
    category: 'operational'
  },
  {
    id: 'products',
    name: 'Products Report',
    description: 'Product performance and inventory analysis',
    icon: Package,
    category: 'inventory'
  },
  {
    id: 'customers',
    name: 'Customers Report',
    description: 'Customer behavior and demographics analysis',
    icon: Users,
    category: 'analytics'
  },
  {
    id: 'revenue',
    name: 'Revenue Report',
    description: 'Revenue trends and financial performance',
    icon: TrendingUp,
    category: 'financial'
  },
  {
    id: 'inventory',
    name: 'Inventory Report',
    description: 'Stock levels and inventory management',
    icon: BarChart3,
    category: 'inventory'
  }
];

const recentReports = [
  {
    id: '1',
    name: 'Monthly Sales Report',
    type: 'sales',
    status: 'completed',
    generatedAt: '2024-01-15T10:30:00Z',
    size: '2.4 MB',
    format: 'PDF'
  },
  {
    id: '2',
    name: 'Customer Analytics Report',
    type: 'customers',
    status: 'processing',
    generatedAt: '2024-01-15T09:15:00Z',
    size: '1.8 MB',
    format: 'Excel'
  },
  {
    id: '3',
    name: 'Inventory Status Report',
    type: 'inventory',
    status: 'completed',
    generatedAt: '2024-01-14T16:45:00Z',
    size: '3.2 MB',
    format: 'PDF'
  },
  {
    id: '4',
    name: 'Revenue Analysis Report',
    type: 'revenue',
    status: 'failed',
    generatedAt: '2024-01-14T14:20:00Z',
    size: '0 MB',
    format: 'PDF'
  }
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState('30');
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    if (!selectedReport) return;
    
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      alert('Report generated successfully!');
    }, 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'processing':
        return 'bg-amber-100 text-amber-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-600 mt-2">Generate and manage business reports</p>
        </div>
      </div>

      {/* Report Generator */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Generate New Report</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Report Type
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a report type</option>
              {reportTypes.map((report) => (
                <option key={report.id} value={report.id}>
                  {report.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              disabled={!selectedReport || isGenerating}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <div key={report.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-blue-100">
                <report.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{report.name}</h3>
                <p className="text-sm text-slate-600">{report.description}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedReport(report.id)}
              className="w-full bg-slate-50 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium"
            >
              Select Report
            </button>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Reports</h2>
        
        <div className="space-y-4">
          {recentReports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-blue-100">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{report.name}</h3>
                  <p className="text-sm text-slate-600">
                    {formatDate(report.generatedAt)} • {report.size} • {report.format.toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                  {getStatusIcon(report.status)}
                  {report.status}
                </span>
                {report.status === 'completed' && (
                  <button className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 