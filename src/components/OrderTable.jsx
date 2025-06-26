import React from 'react';

const OrderTable = ({ orders, onStatusChange, onDeleteClick, onRowClick }) => (
  <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
    <thead>
      <tr className="bg-gray-100 dark:bg-gray-700">
        <th className="px-4 py-3 text-left">Order ID</th>
        <th className="px-4 py-3 text-left">Game</th>
        <th className="px-4 py-3 text-left">Package</th>
        <th className="px-4 py-3 text-left">Player ID</th>
        <th className="px-4 py-3 text-left">Phone</th>
        <th className="px-4 py-3 text-left">Payment</th>
        <th className="px-4 py-3 text-left">Status</th>
        <th className="px-4 py-3 text-center">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
      {orders.map((order) => (
        <tr 
          key={order.firestoreId} 
          onClick={() => onRowClick(order)}
          className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
        >
          <td className="px-4 py-2 font-mono">{order.id}</td>
          <td className="px-4 py-2">{order.game}</td>
          <td className="px-4 py-2">{order.package}</td>
          <td className="px-4 py-2">{order.playerId}</td>
          <td className="px-4 py-2">{order.phone}</td>
          <td className="px-4 py-2">{order.paymentMethod}</td>
          <td className="px-4 py-2">
            <span
              className={`whitespace-nowrap px-2 py-1 text-xs font-semibold rounded-full ${
                order.status === 'Completed'
                  ? 'bg-green-100 text-green-800'
                  : order.status === 'Awaiting Confirmation'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {order.status}
            </span>
          </td>
          <td className="px-4 py-2 text-center" onClick={e => e.stopPropagation()}>
            {order.status === 'Completed' ? (
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">Done</span>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <button
                  className="w-full px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(order.firestoreId, 'Completed');
                  }}
                >
                  Complete
                </button>
                <button
                  className="w-full px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(order.firestoreId, 'Pending Payment');
                  }}
                  disabled={order.status === 'Pending Payment'}
                >
                  Pending
                </button>
                <button
                  className="w-full px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick(order);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default OrderTable; 