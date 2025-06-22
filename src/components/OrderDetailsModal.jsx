import React from 'react';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-lg w-full transform transition-all"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center mb-4 border-b pb-3 dark:border-gray-600">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">&times;</button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <strong className="text-gray-600 dark:text-gray-300">Order ID:</strong>
            <span className="col-span-2 font-mono">{order.id}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <strong className="text-gray-600 dark:text-gray-300">Customer:</strong>
            <span className="col-span-2">{order.name} ({order.email})</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <strong className="text-gray-600 dark:text-gray-300">Game:</strong>
            <span className="col-span-2">{order.game} - {order.package}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <strong className="text-gray-600 dark:text-gray-300">Player ID:</strong>
            <span className="col-span-2">{order.playerId}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <strong className="text-gray-600 dark:text-gray-300">Contact Phone:</strong>
            <span className="col-span-2">{order.phone}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <strong className="text-gray-600 dark:text-gray-300">Price:</strong>
            <span className="col-span-2">EGP {order.price.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <strong className="text-gray-600 dark:text-gray-300">Payment Method:</strong>
            <span className="col-span-2">{order.paymentMethod}</span>
          </div>
           <div className="grid grid-cols-3 gap-4">
            <strong className="text-gray-600 dark:text-gray-300">Status:</strong>
            <span className="col-span-2">{order.status}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <strong className="text-gray-600 dark:text-gray-300">Date:</strong>
            <span className="col-span-2">{new Date(order.createdAt).toLocaleString()}</span>
          </div>
        </div>

        <button 
          onClick={onClose} 
          className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsModal; 