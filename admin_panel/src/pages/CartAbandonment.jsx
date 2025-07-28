import React, { useState, useEffect } from 'react';
import { FiMail, FiClock, FiBarChart3, FiPlay, FiPause, FiRefreshCw } from 'react-icons/fi';
import api from '../services/api';

const CartAbandonment = () => {
  const [stats, setStats] = useState(null);
  const [abandonedCarts, setAbandonedCarts] = useState([]);
  const [schedulerStatus, setSchedulerStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, cartsRes, statusRes] = await Promise.all([
        api.get('/admin/cart-abandonment/stats'),
        api.get('/admin/cart-abandonment/abandoned-carts'),
        api.get('/admin/cart-abandonment/scheduler/status')
      ]);

      setStats(statsRes.data.data);
      setAbandonedCarts(cartsRes.data.data);
      setSchedulerStatus(statusRes.data.data);
    } catch (error) {
      console.error('Error fetching cart abandonment data:', error);
      setMessage('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const sendEmails = async () => {
    try {
      setLoading(true);
      const response = await api.post('/admin/cart-abandonment/send-emails');
      setMessage(response.data.message);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error sending emails:', error);
      setMessage('Error sending emails');
    } finally {
      setLoading(false);
    }
  };

  const toggleScheduler = async (action) => {
    try {
      setLoading(true);
      const response = await api.post(`/admin/cart-abandonment/scheduler/${action}`);
      setMessage(response.data.message);
      fetchData(); // Refresh data
    } catch (error) {
      console.error(`Error ${action}ing scheduler:`, error);
      setMessage(`Error ${action}ing scheduler`);
    } finally {
      setLoading(false);
    }
  };

  const testService = async () => {
    try {
      setLoading(true);
      const response = await api.post('/admin/cart-abandonment/scheduler/test');
      setMessage('Test completed successfully');
      console.log('Test result:', response.data.data);
    } catch (error) {
      console.error('Error testing service:', error);
      setMessage('Error testing service');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cart Abandonment Management</h1>
        <p className="text-gray-600">Monitor and manage cart abandonment email notifications</p>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-800">{message}</p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FiBarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Abandoned Carts</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalAbandonedCarts || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiMail className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Emails Sent</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalEmailsSent || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiClock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Emails/Cart</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.averageEmailsPerCart?.toFixed(1) || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduler Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Scheduler Controls</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              schedulerStatus?.isRunning 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {schedulerStatus?.isRunning ? 'Running' : 'Stopped'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Processing:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              schedulerStatus?.isProcessing 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {schedulerStatus?.isProcessing ? 'Active' : 'Idle'}
            </span>
          </div>

          {schedulerStatus?.nextRun && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Next Run:</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(schedulerStatus.nextRun).toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex space-x-2">
            <button
              onClick={() => toggleScheduler('start')}
              disabled={loading || schedulerStatus?.isRunning}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiPlay className="h-4 w-4 mr-1" />
              Start
            </button>
            <button
              onClick={() => toggleScheduler('stop')}
              disabled={loading || !schedulerStatus?.isRunning}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiPause className="h-4 w-4 mr-1" />
              Stop
            </button>
            <button
              onClick={testService}
              disabled={loading}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiRefreshCw className="h-4 w-4 mr-1" />
              Test
            </button>
          </div>
        </div>
      </div>

      {/* Manual Email Sending */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Manual Email Sending</h2>
        <p className="text-sm text-gray-600 mb-4">
          Send cart abandonment emails manually to all eligible users
        </p>
        <button
          onClick={sendEmails}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiMail className="h-4 w-4 mr-2" />
          Send Abandonment Emails
        </button>
      </div>

      {/* Abandoned Carts List */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Abandoned Carts</h2>
        {abandonedCarts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No abandoned carts found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Emails Sent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {abandonedCarts.slice(0, 10).map((cart) => (
                  <tr key={cart._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cart.user_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cart.items?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cart.abandonment_email_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cart.last_abandonment_email_sent 
                        ? new Date(cart.last_abandonment_email_sent).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(cart.updated_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartAbandonment; 