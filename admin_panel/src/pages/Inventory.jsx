import React, { useState } from 'react';
import { Search, Package, AlertTriangle, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

const mockInventory = [
  {
    id: '1',
    productName: 'iPhone 15 Pro',
    sku: 'IPH15P-128-BLK',
    category: 'Electronics',
    currentStock: 45,
    minStock: 10,
    maxStock: 100,
    reorderPoint: 15,
    unitCost: 800,
    totalValue: 36000,
    lastRestocked: '2024-01-15',
    supplier: 'Apple Inc.',
    status: 'in_stock',
    movement: 'up'
  },
  {
    id: '2',
    productName: 'Nike Air Max 90',
    sku: 'NAM90-10-WHT',
    category: 'Footwear',
    currentStock: 8,
    minStock: 15,
    maxStock: 50,
    reorderPoint: 20,
    unitCost: 65,
    totalValue: 520,
    lastRestocked: '2024-01-10',
    supplier: 'Nike Inc.',
    status: 'low_stock',
    movement: 'down'
  },
  {
    id: '3',
    productName: 'Samsung Galaxy Watch',
    sku: 'SGW6-44-SLV',
    category: 'Electronics',
    currentStock: 0,
    minStock: 5,
    maxStock: 30,
    reorderPoint: 8,
    unitCost: 200,
    totalValue: 0,
    lastRestocked: '2024-01-05',
    supplier: 'Samsung Electronics',
    status: 'out_of_stock',
    movement: 'down'
  },
  {
    id: '4',
    productName: 'MacBook Air M2',
    sku: 'MBA-M2-256-SLV',
    category: 'Computers',
    currentStock: 12,
    minStock: 5,
    maxStock: 25,
    reorderPoint: 8,
    unitCost: 999,
    totalValue: 11988,
    lastRestocked: '2024-01-12',
    supplier: 'Apple Inc.',
    status: 'in_stock',
    movement: 'up'
  },
  {
    id: '5',
    productName: 'Sony WH-1000XM4',
    sku: 'SWH1000-BLK',
    category: 'Audio',
    currentStock: 25,
    minStock: 10,
    maxStock: 40,
    reorderPoint: 15,
    unitCost: 280,
    totalValue: 7000,
    lastRestocked: '2024-01-08',
    supplier: 'Sony Corporation',
    status: 'in_stock',
    movement: 'up'
  },
  {
    id: '6',
    productName: 'Dell XPS 13',
    sku: 'DXS13-512-BLK',
    category: 'Computers',
    currentStock: 3,
    minStock: 8,
    maxStock: 20,
    reorderPoint: 10,
    unitCost: 899,
    totalValue: 2697,
    lastRestocked: '2024-01-03',
    supplier: 'Dell Technologies',
    status: 'low_stock',
    movement: 'down'
  }
];

export default function Inventory() {
  const [inventory, setInventory] = useState(mockInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_stock':
        return 'bg-emerald-100 text-emerald-800';
      case 'low_stock':
        return 'bg-amber-100 text-amber-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'in_stock':
        return 'In Stock';
      case 'low_stock':
        return 'Low Stock';
      case 'out_of_stock':
        return 'Out of Stock';
      default:
        return 'Unknown';
    }
  };

  const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = inventory.filter(item => item.status === 'low_stock').length;
  const outOfStockItems = inventory.filter(item => item.status === 'out_of_stock').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-600 mt-2">Track stock levels, manage reorders, and monitor inventory value</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-emerald-700 flex items-center gap-2 shadow-lg transition-all">
            <RefreshCw className="h-4 w-4" />
            Sync Inventory
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Inventory Value</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">${totalValue.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-100">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Items</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{inventory.length}</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-100">
              <Package className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Low Stock Items</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{lowStockItems}</p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-100">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Out of Stock</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{outOfStockItems}</p>
            </div>
            <div className="p-3 rounded-2xl bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by product name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Footwear">Footwear</option>
              <option value="Computers">Computers</option>
              <option value="Audio">Audio</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInventory.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg mb-1">{item.productName}</h3>
                <p className="text-sm text-slate-600 mb-2">SKU: {item.sku}</p>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="text-right">
                {item.movement === 'up' ? (
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-sm font-medium text-slate-600">Current Stock</p>
                <p className={`text-2xl font-bold ${
                  item.currentStock === 0 ? 'text-red-600' :
                  item.currentStock <= item.reorderPoint ? 'text-amber-600' :
                  'text-slate-900'
                }`}>
                  {item.currentStock}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-sm font-medium text-slate-600">Total Value</p>
                <p className="text-2xl font-bold text-slate-900">${item.totalValue.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Min Stock:</span>
                <span className="font-medium text-slate-900">{item.minStock}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Reorder Point:</span>
                <span className="font-medium text-slate-900">{item.reorderPoint}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Unit Cost:</span>
                <span className="font-medium text-slate-900">${item.unitCost}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Supplier:</span>
                <span className="font-medium text-slate-900">{item.supplier}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Last Restocked:</span>
                <span className="font-medium text-slate-900">{item.lastRestocked}</span>
              </div>
            </div>

            {/* Stock Level Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Stock Level</span>
                <span>{item.currentStock} / {item.maxStock}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    item.currentStock === 0 ? 'bg-red-500' :
                    item.currentStock <= item.reorderPoint ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min((item.currentStock / item.maxStock) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Update Stock
              </button>
              {item.currentStock <= item.reorderPoint && (
                <button className="flex-1 bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                  Reorder
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 