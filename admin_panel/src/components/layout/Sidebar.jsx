import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Tags, 
  Award,
  Warehouse,
  FlaskConical,
  Ticket, 
  Star,
  BarChart3, 
  FileText,
  Settings,
  X,
  Store,
  User,
  Bell,
  Globe,
  MapPin,
  Building2,
  FolderOpen,
  Palette,
  Ruler
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { 
        name: 'Catalog', 
        items: [
          { name: 'Products', href: '/products', icon: Package },
          { name: 'Categories', href: '/categories', icon: Tags },
          { name: 'Brands', href: '/brands', icon: Award },
          { name: 'Departments', href: '/departments', icon: FolderOpen },
          { name: 'Countries', href: '/countries', icon: Globe },
          { name: 'States', href: '/states', icon: MapPin },
          { name: 'Cities', href: '/cities', icon: Building2 },
          { name: 'Colors', href: '/colors', icon: Palette },
          { name: 'Sizes', href: '/sizes', icon: Ruler },
          { name: 'Materials', href: '/materials', icon: FlaskConical },
          { name: 'Inventory', href: '/inventory', icon: Warehouse },
        ]
      },
  { 
    name: 'Sales', 
    items: [
      { name: 'Orders', href: '/orders', icon: ShoppingCart },
      { name: 'Coupons', href: '/coupons', icon: Ticket },
    ]
  },
  { 
    name: 'Customers', 
    items: [
      { name: 'Users', href: '/users', icon: Users },
      { name: 'Reviews', href: '/reviews', icon: Star },
    ]
  },
  { 
    name: 'Reports', 
    items: [
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      { name: 'Reports', href: '/reports', icon: FileText },
    ]
  },
  { 
    name: 'Account', 
    items: [
      { name: 'Profile', href: '/profile', icon: User },
      { name: 'Notifications', href: '/notifications', icon: Bell },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Admin Panel</h1>
              <p className="text-xs text-slate-500">E-commerce Dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          {navigation.map((item, index) => (
            <div key={index}>
              {item.href ? (
                // Single navigation item
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                  onClick={() => onClose()}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              ) : (
                // Navigation group
                <div className="space-y-1">
                  <h3 className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {item.name}
                  </h3>
                  <div className="space-y-1">
                    {item.items?.map((subItem) => (
                      <NavLink
                        key={subItem.href}
                        to={subItem.href}
                        className={({ isActive }) =>
                          `group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                          }`
                        }
                        onClick={() => onClose()}
                      >
                        <subItem.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        {subItem.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex-shrink-0">
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-xs font-bold text-white">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 