import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitOrder } from '../logic/orderService';
import SEO from '../components/SEO';
import LoadingIndicator from '../components/LoadingIndicator';
import { FaShieldAlt, FaIdCard, FaMobileAlt, FaWallet, FaUser, FaEnvelope } from 'react-icons/fa';

const paymentOptions = [
  { value: 'Instapay', label: 'Instapay' },
  { value: 'Vodafone', label: 'Vodafone Cash' },
  { value: 'Etisalat', label: 'Etisalat Cash' },
  { value: 'Orange', label: 'Orange Cash' },
];

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { game, package: selectedPackage } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', gameId: '', phone: '', paymentMethod: 'Instapay' });

  if (!game || !selectedPackage) {
    return <div className="text-center mt-20 text-red-600">Missing game or package info. Please start from the home page.</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const orderData = {
      game,
      package: selectedPackage.name,
      price: selectedPackage.price,
      name: formData.name,
      email: formData.email,
      playerId: formData.gameId,
      phone: formData.phone,
      paymentMethod: formData.paymentMethod,
      status: 'Pending Payment',
      createdAt: new Date().toISOString(),
    };
    try {
      const res = await submitOrder(orderData);
      setLoading(false);
      if (res.success) {
        navigate(`/payment-instructions/${formData.paymentMethod.toLowerCase()}`, { 
          state: { order: { ...orderData, firestoreId: res.firestoreId, orderId: res.orderId } } 
        });
      } else {
        alert('Failed to submit order. Please try again.');
      }
    } catch (e) {
      setLoading(false);
      alert('Error submitting order.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <SEO title={`Payment for ${selectedPackage.name}`} description={`Complete your payment for ${selectedPackage.name} for the game ${game}.`} />
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800/50 rounded-2xl shadow-2xl backdrop-blur-lg p-8 grid md:grid-cols-2 gap-8">
        {/* Left Side: Order Summary */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Confirm Your Order</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">You're one step away from getting back in the game.</p>
            <div className="bg-gray-100 dark:bg-gray-700/50 p-6 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Game:</span>
                <span className="font-bold text-gray-800 dark:text-white">{game}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Package:</span>
                <span className="font-bold text-gray-800 dark:text-white">{selectedPackage.name}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 my-4"></div>
              <div className="flex justify-between items-center text-xl">
                <span className="text-gray-700 dark:text-gray-200">Total Price:</span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400">EGP {selectedPackage.price}</span>
              </div>
            </div>
          </div>
          <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <FaShieldAlt />
            <span>Secure payment processing. Your information is safe with us.</span>
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Enter Your Details</h2>
          <div className="space-y-4">
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-gray-400" />
              <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleInputChange} className="w-full p-2 pl-10 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600" required />
            </div>
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleInputChange} className="w-full p-2 pl-10 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600" required />
            </div>
            {/* Conditionally render Game ID input for non-PES games */}
            {game !== 'PES' && (
              <div className="relative">
                <FaIdCard className="absolute top-3 left-3 text-gray-400" />
                <input type="text" name="gameId" placeholder="Your Game ID" value={formData.gameId} onChange={handleInputChange} className="w-full p-2 pl-10 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600" required={game !== 'PES'} />
              </div>
            )}
            <div className="relative">
              <FaMobileAlt className="absolute top-3 left-3 text-gray-400" />
              <input type="tel" name="phone" placeholder="Your Phone Number" value={formData.phone} onChange={handleInputChange} className="w-full p-2 pl-10 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600" required />
            </div>
            <div className="relative">
              <FaWallet className="absolute top-3 left-3 text-gray-400" />
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="w-full p-2 pl-10 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 appearance-none" required>
                {paymentOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full mt-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400">
            {loading ? <LoadingIndicator /> : `Proceed to Pay EGP ${selectedPackage.price}`}
          </button>
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-center">
             <p className="text-sm text-gray-600 dark:text-gray-300">
               You will be redirected to the payment page to complete your purchase.
             </p>
          </div>
        </form>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="mx-auto mt-8 flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        Back
      </button>
    </div>
  );
};

export default PaymentPage; 