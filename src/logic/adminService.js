// adminService.js
// Handles filtering and searching orders for the admin dashboard

export function filterOrders(orders, filters) {
  const { searchTerm = '', status = '', game = '', paymentMethod = '' } = filters;

  if (!searchTerm && !status && !game && !paymentMethod) {
    return orders;
  }
  
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  return orders.filter(order => {
    const matchesStatus = !status || order.status === status;
    const matchesGameFilter = !game || order.game === game;
    const matchesPaymentFilter = !paymentMethod || order.paymentMethod === paymentMethod;

    const matchesSearch =
      !lowerCaseSearchTerm ||
      (order.id && String(order.id).toLowerCase().includes(lowerCaseSearchTerm)) ||
      (order.playerId && String(order.playerId).toLowerCase().includes(lowerCaseSearchTerm)) ||
      (order.phone && String(order.phone).toLowerCase().includes(lowerCaseSearchTerm)) ||
      (order.game && order.game.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (order.package && order.package.toLowerCase().includes(lowerCaseSearchTerm));
    
    return matchesSearch && matchesStatus && matchesGameFilter && matchesPaymentFilter;
  });
} 