import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Ban, CheckCircle, Mail, Phone, Calendar, Shield, Users as UsersIcon, UserPlus, X } from 'lucide-react';
import { usersAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
      };

      const response = await usersAPI.getUsers(params);
      const { users: usersData, pagination } = response.data.data;
      
      setUsers(usersData);
      setTotalPages(pagination.total);
      setTotalUsers(pagination.totalRecords);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length 
        ? [] 
        : filteredUsers.map(user => user._id)
    );
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      await usersAPI.updateUserRole(userId, newStatus);
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, status: newStatus } : user
      ));
      alert('User status updated successfully!');
    } catch (error) {
      alert('Error updating user status: ' + (error.response?.data?.message || error.message));
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.deleteUser(userId);
        setUsers(prev => prev.filter(user => user._id !== userId));
        setSelectedUsers(prev => prev.filter(id => id !== userId));
        alert('User deleted successfully!');
      } catch (error) {
        alert('Error deleting user: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-600 mt-2">Manage user accounts and permissions</p>
        </div>
        <button onClick={() => navigate('/users/add')} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 flex items-center gap-2 shadow-lg transition-all">
          <UserPlus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Users</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{totalUsers}</p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-100">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Admins</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-purple-100">
              <Shield className="h-6 w-6 text-purple-600" />
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
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleAllUsers}
                    className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Notifications</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleUserSelection(user._id)}
                      className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{user.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600">{user.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600">{user.phone || '—'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 text-xs">
                      <Mail className={`h-4 w-4 ${user.settings?.emailNotifications ? 'text-emerald-500' : 'text-slate-400'}`} title="Email Notifications" />
                      <Phone className={`h-4 w-4 ${user.settings?.smsNotifications ? 'text-emerald-500' : 'text-slate-400'}`} title="SMS Notifications" />
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deleteUser(user._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="text-sm text-slate-600">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalUsers)} of {totalUsers} users
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 