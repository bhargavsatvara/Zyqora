import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNames = {
  '/': 'Dashboard',
  '/users': 'Users',
  '/products': 'Products',
  '/orders': 'Orders',
  '/categories': 'Categories',
  '/brands': 'Brands',
  '/inventory': 'Inventory',
  '/coupons': 'Coupons',
  '/reviews': 'Reviews',
  '/analytics': 'Analytics',
  '/reports': 'Reports',
  '/settings': 'Settings'
};

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-600">
      <Link
        to="/"
        className="flex items-center hover:text-blue-600 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {pathnames.map((pathname, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const routeName = routeNames[routeTo] || pathname.charAt(0).toUpperCase() + pathname.slice(1);

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            {isLast ? (
              <span className="font-medium text-slate-900">{routeName}</span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-blue-600 transition-colors"
              >
                {routeName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
} 