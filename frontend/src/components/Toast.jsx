import React, { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  let bgColor = 'bg-gray-800';
  if (type === 'success') bgColor = 'bg-green-600';
  if (type === 'error') bgColor = 'bg-red-600';
  if (type === 'info') bgColor = 'bg-blue-600';

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white ${bgColor} animate-fade-in`} style={{ minWidth: 200, maxWidth: 320 }}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white font-bold">&times;</button>
    </div>
  );
}

// Add a simple fade-in animation
// In your global CSS (e.g., index.css), add:
// @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
// .animate-fade-in { animation: fade-in 0.3s ease; } 