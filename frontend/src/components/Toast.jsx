import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(), 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <i className="mdi mdi-check-circle text-green-500"></i>;
      case 'error':
        return <i className="mdi mdi-alert-circle text-red-500"></i>;
      case 'warning':
        return <i className="mdi mdi-alert text-yellow-500"></i>;
      default:
        return <i className="mdi mdi-information text-blue-500"></i>;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800 dark:text-green-200';
      case 'error':
        return 'text-red-800 dark:text-red-200';
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200';
      default:
        return 'text-blue-800 dark:text-blue-200';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`max-w-sm w-full ${getBgColor()} border rounded-lg shadow-xl transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}`}>
      <div className="flex items-start p-4">
        <div className="flex-shrink-0 text-lg">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${getTextColor()}`}>
            {message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose(), 300);
            }}
            className={`inline-flex rounded-md p-1.5 ${getBgColor()} text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast; 