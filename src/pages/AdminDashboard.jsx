import React, { useState, useEffect, useMemo, useRef } from 'react';
import { subscribeToOrders, updateOrderStatus, deleteOrder, sendOrderCompletionEmail } from '../logic/orderService';
import { subscribeToFaqs, updateFaq, addFaq, deleteFaq } from '../logic/faqService';
import { filterOrders } from '../logic/adminService';
import OrderTable from '../components/OrderTable';
import LoadingIndicator from '../components/LoadingIndicator';
import OrderDetailsModal from '../components/OrderDetailsModal';
import ToastNotification from '../components/ToastNotification';
import Sidebar from '../components/Sidebar';
import RevenueChart from '../components/RevenueChart';
import ConfirmationModal from '../components/ConfirmationModal';
import FAQManager from '../components/FAQManager';
import { FaPlus, FaEdit, FaTrash, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';
import { subscribeToTestimonialsByStatus, approveTestimonial, deleteTestimonial } from '../logic/testimonialService';
import { subscribeToPackages, savePackage, deletePackage } from '../logic/packageService';
import PackageManager from '../components/PackageManager';

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center`}>
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

// Icons
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const DocumentTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const CashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;

const TopSellingCard = ({ title, items }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">{title}</h3>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
          <span className="font-bold text-gray-800 dark:text-white">{item.count} sales</span>
        </li>
      ))}
    </ul>
  </div>
);

const AdminDashboard = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    game: '',
    paymentMethod: ''
  });
  const [dateRange, setDateRange] = useState(''); // '', 'day', 'week', 'month'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notification, setNotification] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletionInfo, setDeletionInfo] = useState(null);
  const [packages, setPackages] = useState([]);
  const [pendingTestimonials, setPendingTestimonials] = useState([]);
  const [approvedTestimonials, setApprovedTestimonials] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTestimonialsExpanded, setIsTestimonialsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isInitialLoad = useRef(true);

  useEffect(() => {
    let isMounted = true;
    
    const unsubscribeOrders = subscribeToOrders((orders) => {
        if (!isMounted) return;
        const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        if (!isInitialLoad.current && sortedOrders.length > allOrders.length) {
            setNotification('A new order has arrived!');
        }
        
        setAllOrders(sortedOrders);
        if (loading) setLoading(false);
    });

    const unsubscribeFaqs = subscribeToFaqs((faqsData) => {
        console.log('subscribeToFaqs callback, faqsData:', faqsData); // Debug
        if (!isMounted) return;
        setFaqs(faqsData);
        if (loading) setLoading(false);
    });
    
    const unsubPackages = subscribeToPackages((packagesData) => {
        if (!isMounted) return;
        setPackages(packagesData);
        if (loading) setLoading(false);
    });
    
    const unsubTestimonials = subscribeToTestimonialsByStatus('pending', (testimonials) => {
        if (!isMounted) return;
        setPendingTestimonials(testimonials);
        if (loading) setLoading(false);
    });

    const unsubApprovedTestimonials = subscribeToTestimonialsByStatus('approved', (testimonials) => {
        if (!isMounted) return;
        setApprovedTestimonials(testimonials);
    });
    
    isInitialLoad.current = false;

    return () => {
        isMounted = false;
        unsubscribeOrders();
        unsubscribeFaqs();
        unsubPackages();
        unsubTestimonials();
        unsubApprovedTestimonials();
    };
  }, []);

  const openDeleteModal = (id, deleteFunction, name) => {
    setDeletionInfo({ id, deleteFunction, name });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletionInfo) {
      await deletionInfo.deleteFunction(deletionInfo.id);
      setNotification(`'${deletionInfo.name}' has been deleted.`);
      setDeletionInfo(null);
      setIsDeleteModalOpen(false);
    }
  };

  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const ordersInDateRange = useMemo(() => {
    if (!dateRange) return allOrders;
    
    const now = new Date();
    const startDate = new Date();

    if (dateRange === 'day') {
      startDate.setHours(0, 0, 0, 0);
    } else if (dateRange === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (dateRange === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    }

    return allOrders.filter(order => new Date(order.createdAt) >= startDate);
  }, [allOrders, dateRange]);

  const { stats, topPackages, chartData } = useMemo(() => {
    const sourceData = ordersInDateRange;
    const totalOrders = sourceData.length;
    const pending = sourceData.filter(o => o.status === 'Pending Payment' || o.status === 'Awaiting Confirmation').length;
    const completed = sourceData.filter(o => o.status === 'Completed').length;
    const revenue = sourceData
      .filter(o => o.status === 'Completed')
      .reduce((acc, order) => acc + (order.price || 0), 0);

    const packageCounts = sourceData
      .filter(o => o.status === 'Completed')
      .reduce((acc, order) => {
        acc[order.package] = (acc[order.package] || 0) + 1;
        return acc;
      }, {});
    
    const topItems = Object.entries(packageCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); // Changed from 5 to 3

    // Process data for the chart
    const dailyRevenue = sourceData
      .filter(o => o.status === 'Completed')
      .reduce((acc, order) => {
        const date = new Date(order.createdAt).toLocaleDateString();
        acc[date] = (acc[date] || 0) + order.price;
        return acc;
      }, {});

    const chartLabels = Object.keys(dailyRevenue).sort((a,b) => new Date(a) - new Date(b));
    const chartValues = chartLabels.map(label => dailyRevenue[label]);
    const chartTitle = `Revenue for ${dateRange ? 'This ' + dateRange : 'All Time'}`;

    return { 
      stats: { totalOrders, pending, completed, revenue }, 
      topPackages: topItems, 
      chartData: { labels: chartLabels, values: chartValues, title: chartTitle } 
    };
  }, [ordersInDateRange]);

  const handleStatusChange = async (firestoreId, newStatus) => {
    await updateOrderStatus(firestoreId, newStatus);
    if (newStatus === 'Completed') {
      const order = allOrders.find(o => o.firestoreId === firestoreId);
      if (order) {
        await sendOrderCompletionEmail(order);
        setNotification(`Completion email sent for order ${order.id}`);
      }
    }
  };

  const handleDeleteClick = (order) => {
    openDeleteModal(order.firestoreId, deleteOrder, `Order ${order.id}`);
  };

  const exportToCSV = () => {
    const headers = ['Order ID', 'Game', 'Package', 'Player ID', 'Phone', 'Payment Method', 'Price', 'Status', 'Date'];
    const rows = filteredOrders.map(order => [
      order.id,
      order.game,
      order.package,
      order.playerId,
      order.phone,
      order.paymentMethod,
      order.price,
      order.status,
      new Date(order.createdAt).toLocaleString()
    ].join(','));
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = useMemo(
    () => filterOrders(ordersInDateRange, filters),
    [ordersInDateRange, filters]
  );

  const handleFaqSave = async (faq) => {
      console.log('handleFaqSave called with:', faq); // Debug
      if (faq.id) {
          const { id, ...data } = faq;
          await updateFaq(id, data);
      } else {
          const { id, ...data } = faq;
          await addFaq(data);
      }
  };

  const handleFaqDelete = async (id) => {
      openDeleteModal(id, deleteFaq, 'FAQ');
  };

  const handleSavePackage = async (pkg) => {
      await savePackage(pkg);
  };

  const handleDeletePackage = async (pkgId) => {
      openDeleteModal(pkgId, deletePackage, 'Package');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Genius Store</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Admin Panel</p>
        </div>
        <button
          onClick={async () => {
            const { signOut } = await import('firebase/auth');
            const { auth } = await import('../firebase');
            window.location.href = '/login';
            await signOut(auth);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
        >
          Log Out
        </button>
      </header>
      <main className="mt-20 p-4 sm:p-6 lg:p-8 w-full">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
        
        {/* Desktop Header */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 hidden lg:block">Dashboard</h1>
        
        {/* Reporting Section */}
        <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Reports</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                <button onClick={() => setDateRange('day')} className={`w-full px-4 py-2 rounded-lg shadow-sm ${dateRange === 'day' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800'}`}>Today</button>
                <button onClick={() => setDateRange('week')} className={`w-full px-4 py-2 rounded-lg shadow-sm ${dateRange === 'week' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800'}`}>This Week</button>
                <button onClick={() => setDateRange('month')} className={`w-full px-4 py-2 rounded-lg shadow-sm ${dateRange === 'month' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800'}`}>This Month</button>
                <button onClick={() => setDateRange('')} className={`w-full px-4 py-2 rounded-lg shadow-sm ${!dateRange ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800'}`}>All Time</button>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Orders" value={stats.totalOrders} icon={<DocumentTextIcon/>} color="bg-blue-100 dark:bg-blue-900/50" />
          <StatCard title="Pending / Awaiting" value={stats.pending} icon={<ClockIcon/>} color="bg-yellow-100 dark:bg-yellow-900/50"/>
          <StatCard title="Completed Orders" value={stats.completed} icon={<CheckCircleIcon/>} color="bg-green-100 dark:bg-green-900/50"/>
          <StatCard title="Total Revenue" value={`EGP ${stats.revenue.toFixed(2)}`} icon={<CashIcon/>} color="bg-purple-100 dark:bg-purple-900/50"/>
        </div>

        {/* Chart and Top Selling Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <RevenueChart data={chartData} title={chartData.title} />
          </div>
          <TopSellingCard title="Top 3 Selling Packages" items={topPackages} />
        </div>

        <div className="space-y-8">
            {/* Testimonial Management */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <button
                    className="w-full flex justify-between items-center text-xl font-semibold text-gray-700 dark:text-gray-200"
                    onClick={() => setIsTestimonialsExpanded(!isTestimonialsExpanded)}
                >
                    <span>Testimonial Management</span>
                    <FaChevronDown className={`transition-transform duration-300 ${isTestimonialsExpanded ? 'rotate-180' : ''}`} />
                </button>

                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isTestimonialsExpanded ? 'max-h-[2000px] mt-6' : 'max-h-0'}`}>
                    {/* Pending Testimonials */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Pending Testimonials</h3>
                        {pendingTestimonials.length > 0 ? (
                            <ul className="space-y-2">
                                {pendingTestimonials.map(testimonial => (
                                    <li key={testimonial.id} className="flex justify-between items-center p-4 border rounded-lg dark:border-gray-700">
                                        <span>{testimonial.name}: "{testimonial.quote}"</span>
                                        <div>
                                            <button onClick={() => approveTestimonial(testimonial.id)} className="p-2 text-green-500 hover:text-green-700"><CheckCircleIcon /></button>
                                            <button onClick={() => openDeleteModal(testimonial.id, deleteTestimonial, testimonial.name)} className="p-2 text-red-500 hover:text-red-700"><FaTrash /></button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">No pending testimonials.</p>
                        )}
                    </div>

                    {/* Approved Testimonials */}
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Approved Testimonials</h3>
                        {approvedTestimonials.length > 0 ? (
                            <ul className="space-y-4">
                                {approvedTestimonials.map(testimonial => (
                                    <li key={testimonial.id} className="flex justify-between items-center p-4 border rounded-lg dark:border-gray-700">
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">"{testimonial.quote}"</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">Likes: {testimonial.likes}, Dislikes: {testimonial.dislikes}</p>
                                        </div>
                                        <button onClick={() => openDeleteModal(testimonial.id, deleteTestimonial, testimonial.name)} className="p-2 text-red-500 hover:text-red-700">
                                            <FaTrash />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">No approved testimonials.</p>
                        )}
                    </div>
                </div>
            </div>

            <FAQManager faqs={faqs} onSave={handleFaqSave} onDelete={handleFaqDelete} />

            <PackageManager packages={packages} onSave={handleSavePackage} onDelete={handleDeletePackage} />
        </div>

        {/* Controls and Table Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 flex-grow">All Orders</h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search orders..."
                className="p-2 border rounded shadow-sm w-full sm:w-64 bg-white dark:bg-gray-700 dark:border-gray-600"
                value={filters.searchTerm}
                onChange={handleFilterChange}
                name="searchTerm"
              />
              <select
                className="p-2 border rounded shadow-sm w-full sm:w-auto bg-white dark:bg-gray-700 dark:border-gray-600"
                value={filters.status}
                onChange={handleFilterChange}
                name="status"
              >
                <option value="">All Statuses</option>
                <option value="Pending Payment">Pending Payment</option>
                <option value="Awaiting Confirmation">Awaiting Confirmation</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <OrderTable 
              orders={filteredOrders} 
              onStatusChange={handleStatusChange} 
              onDeleteClick={handleDeleteClick} 
              onRowClick={setSelectedOrder}
            />
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}

        {/* Toast Notification */}
        {notification && (
          <ToastNotification 
            message={notification} 
            onClose={() => setNotification('')} 
          />
        )}

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirm Deletion"
          message={`Are you sure you want to delete this item? This action cannot be undone.`}
        />
      </main>
    </div>
  );
};

export default AdminDashboard; 