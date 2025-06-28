import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitOrder } from '../logic/orderService';
import SEO from '../components/SEO';
import LoadingIndicator from '../components/LoadingIndicator';
import { FaShieldAlt, FaIdCard, FaMobileAlt, FaWallet, FaUser, FaEnvelope, FaUniversity, FaMoneyBillWave, FaMobile, FaCreditCard } from 'react-icons/fa';
import { MdSimCard } from 'react-icons/md';
import * as yup from 'yup';
import instapayIcon from '../assets/Image/payment_icon/instapay.png';
import vodafoneIcon from '../assets/Image/payment_icon/vodafone.png';
import etisalatIcon from '../assets/Image/payment_icon/etisalat.png';
import orangeIcon from '../assets/Image/payment_icon/orange.jpg';

const paymentOptions = [
  { value: 'Instapay', label: 'Instapay', icon: instapayIcon, color: 'border-blue-600' },
  { value: 'Vodafone', label: 'Vodafone Cash', icon: vodafoneIcon, color: 'border-red-600' },
  { value: 'Etisalat', label: 'Etisalat Cash', icon: etisalatIcon, color: 'border-green-600' },
  { value: 'Orange', label: 'Orange Cash', icon: orangeIcon, color: 'border-orange-500' },
];

const schema = yup.object().shape({
  name: yup.string().trim().min(2, 'Name too short').max(50, 'Name too long').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  gameId: yup.string().trim().max(30, 'Game ID too long').when('game', {
    is: (val) => val !== 'PES',
    then: (schema) => schema.required('Game ID is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  phone: yup.string().trim().matches(/^01[0-9]{9}$/, 'Invalid Egyptian phone number').required('Phone is required'),
  paymentMethod: yup.string().required('Payment method is required'),
});

const sanitize = (str) => str.replace(/<[^>]*>?/gm, '').trim();

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { game, package: selectedPackage } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', gameId: '', phone: '', paymentMethod: 'Instapay' });
  const [errors, setErrors] = useState({});

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
    setErrors({});
    const sanitizedData = {
      name: sanitize(formData.name),
      email: sanitize(formData.email),
      gameId: sanitize(formData.gameId),
      phone: sanitize(formData.phone),
      paymentMethod: formData.paymentMethod,
      game,
    };
    try {
      await schema.validate(sanitizedData, { abortEarly: false });
      const orderData = {
        game,
        package: selectedPackage.name,
        price: selectedPackage.price,
        name: sanitizedData.name,
        email: sanitizedData.email,
        playerId: sanitizedData.gameId,
        phone: sanitizedData.phone,
        paymentMethod: sanitizedData.paymentMethod,
        status: 'Pending Payment',
        createdAt: new Date().toISOString(),
      };
      const res = await submitOrder(orderData);
      setLoading(false);
      if (res.success) {
        navigate(`/payment-instructions/${formData.paymentMethod.toLowerCase()}`, { 
          state: { order: { ...orderData, firestoreId: res.firestoreId, orderId: res.orderId } } 
        });
      } else {
        alert('Failed to submit order. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      if (err.inner) {
        const formErrors = {};
        err.inner.forEach(e => { formErrors[e.path] = e.message; });
        setErrors(formErrors);
      } else {
        alert('Error submitting order.');
      }
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
            {/* Name */}
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-gray-400" />
              <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleInputChange} className="w-full p-2 pl-10 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600" required />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleInputChange} className="w-full p-2 pl-10 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600" required />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            {/* Game ID */}
            {game !== 'PES' && (
              <div className="relative">
                <FaIdCard className="absolute top-3 left-3 text-gray-400" />
                <input type="text" name="gameId" placeholder="Your Game ID" value={formData.gameId} onChange={handleInputChange} className="w-full p-2 pl-10 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600" required={game !== 'PES'} />
                {errors.gameId && <p className="text-red-500 text-xs mt-1">{errors.gameId}</p>}
              </div>
            )}
            {/* Phone */}
            <div className="relative">
              <FaMobileAlt className="absolute top-3 left-3 text-gray-400" />
              <input type="tel" name="phone" placeholder="Your Phone Number" value={formData.phone} onChange={handleInputChange} className="w-full p-2 pl-10 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600" required />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            {/* Payment Method Button Group */}
            <div className="flex gap-4 justify-between">
              {paymentOptions.map(opt => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: opt.value }))}
                  className={`flex flex-col items-center flex-1 p-3 rounded-xl border-2 transition-all duration-200 bg-white dark:bg-gray-700/50 shadow-sm cursor-pointer
                    ${formData.paymentMethod === opt.value ? `${opt.color} ring-2 ring-blue-400` : 'border-gray-200 dark:border-gray-600'}`}
                  >
                    <img src={opt.icon} alt={opt.label + ' icon'} className="w-10 h-10 object-contain" />
                    <span className={`mt-2 font-semibold text-sm ${formData.paymentMethod === opt.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}`}>{opt.label}</span>
                  </button>
                ))}
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