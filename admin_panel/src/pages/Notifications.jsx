import React, { useState, useEffect } from 'react';
import { Bell, Check, X, AlertTriangle, Info, Mail, Trash2, Filter } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading notifications
    setTimeout(() => {
      setNotifications([
        {
          id: '1',
          type: 'warning',
          title: 'Low Stock Alert',
          message: 'iPhone 15 Pro is running low on stock. Only 3 items remaining.',
          timestamp: '2024-01-15T10:30:00Z',
          read: false,
          category: 'product'
        },
        {
          id: '2',
          type: 'success',
          title: 'Order Completed',
          message: 'Order #ORD-1234 has been successfully delivered to John Doe.',
          timestamp: '2024-01-15T09:15:00Z',
          read: false,
          category: 'order'
        },
        {
          id: '3',
          type: 'info',
          title: 'New User Registration',
          message: 'A new user "jane.smith@email.com" has registered on the platform.',
          timestamp: '2024-01-15T08:45:00Z',
          read: true,
          category: 'user'
        },
        {
          id: '4',
          type: 'error',
          title: 'Payment Failed',
          message: 'Payment processing failed for Order #ORD-1235. Please review the transaction.',
          timestamp: '2024-01-15T07:20:00Z',
          read: false,
          category: 'order'
        },
        {
          id: '5',
          type: 'info',
          title: 'System Maintenance',
          message: 'Scheduled maintenance will occur tonight at 2:00 AM. Expected downtime: 30 minutes.',
          timestamp: '2024-01-14T16:00:00Z',
          read: true,
          category: 'system'
        },
        {
          id: '6',
          type: 'warning',
          title: 'High Return Rate',
          message: 'Product "Samsung Galaxy Watch" has a return rate of 15%. Consider reviewing the product.',
          timestamp: '2024-01-14T14:30:00Z',
          read: true,
          category: 'product'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
        return <Check className="h-5 w-5 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-slate-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-100 text-emerald-800';
      case 'warning':
        return 'bg-amber-100 text-amber-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'order':
        return <Mail className="h-4 w-4" />;
      case 'user':
        return <Bell className="h-4 w-4" />;
      case 'product':
        return <AlertTriangle className="h-4 w-4" />;
      case 'system':
        return <Info className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-600 mt-2">
            Manage your system notifications and alerts.
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark all as read
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">Filter by:</span>
            <div className="flex items-center space-x-2">
              {[
                { key: 'all', label: 'All', count: notifications.length },
                { key: 'unread', label: 'Unread', count: unreadCount },
                { key: 'info', label: 'Info', count: notifications.filter(n => n.type === 'info').length },
                { key: 'warning', label: 'Warning', count: notifications.filter(n => n.type === 'warning').length },
                { key: 'error', label: 'Error', count: notifications.filter(n => n.type === 'error').length },
                { key: 'success', label: 'Success', count: notifications.filter(n => n.type === 'success').length },
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                    filter === filterOption.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filterOption.label}
                  <span className="ml-1 text-xs opacity-75">({filterOption.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {filter === 'all' ? 'All Notifications' : 
             filter === 'unread' ? 'Unread Notifications' : 
             `${filter.charAt(0).toUpperCase() + filter.slice(1)} Notifications`}
          </h2>
        </div>
        <div className="divide-y divide-slate-200">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No notifications</h3>
              <p className="text-slate-600">
                {filter === 'all' ? 'You\'re all caught up!' : 
                 filter === 'unread' ? 'No unread notifications' : 
                 `No ${filter} notifications`}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-slate-50 transition-colors ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-semibold text-slate-900">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                          {notification.type}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          <span className="mr-1">{getCategoryIcon(notification.category)}</span>
                          {notification.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-500">
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {notification.message}
                    </p>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Notification Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900">Email Notifications</h4>
            <div className="space-y-3">
              {[
                { key: 'order_updates', label: 'Order status updates', enabled: true },
                { key: 'low_stock', label: 'Low stock alerts', enabled: true },
                { key: 'new_users', label: 'New user registrations', enabled: false },
                { key: 'system_alerts', label: 'System maintenance alerts', enabled: true },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{setting.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={setting.enabled}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900">In-App Notifications</h4>
            <div className="space-y-3">
              {[
                { key: 'order_updates', label: 'Order status updates', enabled: true },
                { key: 'low_stock', label: 'Low stock alerts', enabled: true },
                { key: 'new_users', label: 'New user registrations', enabled: true },
                { key: 'system_alerts', label: 'System maintenance alerts', enabled: true },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{setting.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={setting.enabled}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 