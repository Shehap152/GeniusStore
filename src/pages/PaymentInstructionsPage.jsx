import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { updateOrderStatus, getOrderByOrderId } from '../logic/orderService';
import { FaTelegramPlane, FaCopy, FaWhatsapp, FaLink } from 'react-icons/fa';

const paymentDetails = {
  instapay: {
    title: 'Pay with Instapay',
    instructions: 'Scan the QR code below, use the payment link, or send the payment directly to our Instapay account.',
    details: 'Instapay Account: bnasef736@instapay',
    paymentLink: 'https://ipn.eg/S/bnasef736/instapay/3k83Pt',
    qrCode: '/assets/instapay-qr.png',
    hint: 'Please ensure all payment information is correct before proceeding.',
  },
  vodafone: {
    title: 'Pay with Vodafone Cash',
    instructions: 'Please transfer the exact order amount to the following Vodafone Cash number:',
    details: 'Wallet Number: 01127432507',
  },
  etisalat: {
    title: 'Pay with Etisalat Cash',
    instructions: 'Please transfer the exact order amount to the following Etisalat Cash number:',
    details: 'Wallet Number: 01127432507',
  },
  orange: {
    title: 'Pay with Orange Cash',
    instructions: 'Please transfer the exact order amount to the following Orange Cash number:',
    details: 'Wallet Number: 01127432507',
  },
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

  useEffect(() => {
    if (timeLeft === 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-lg font-semibold text-red-600">
      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
};

const PaymentInstructionsPage = () => {
  const navigate = useNavigate();
  const { method } = useParams();
  const location = useLocation();

  const [latestOrder, setLatestOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [copyText, setCopyText] = useState('Copy Order ID');

  // Defensive check for location.state
  if (!location.state || !location.state.order) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Order Information Missing</h1>
        <p className="text-gray-700 dark:text-gray-300 my-4">We couldn't find the details for your order. Please start the process again.</p>
        <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Go to Home
        </button>
      </div>
    );
  }

  const { order } = location.state;
  const paymentInfo = paymentDetails[method.toLowerCase()];

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError('');
      const foundOrder = await getOrderByOrderId(order.orderId);
      if (!foundOrder) {
        setError('Order not found. Please check your Order ID or start again.');
      }
      setLatestOrder(foundOrder);
      setLoading(false);
    };
    fetchOrder();
    // Optionally, you could set up polling or a real-time listener here
  }, [order.orderId]);

  if (!paymentInfo) {
    return (
      <div className="text-center mt-20">
        Invalid payment method. Please check the URL or go back.
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Go Back
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center mt-20 text-blue-600">Loading order details...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-600">{error}</div>;
  }

  const handlePaidClick = async () => {
    if (confirmationVisible) return;
    await updateOrderStatus(latestOrder.firestoreId, 'Awaiting Confirmation');

    if (latestOrder.game === 'PES') {
      setConfirmationVisible(true);
    } else {
      navigate('/success', { state: { orderId: latestOrder.id } });
    }
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(latestOrder.id);
    setCopyText('Copied!');
    setTimeout(() => setCopyText('Copy Order ID'), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 text-center">
        <h1 className="text-2xl font-bold mb-2 dark:text-white">{paymentInfo.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Order ID: <span className="font-mono bg-gray-100 dark:bg-gray-700 p-1 rounded">{latestOrder.id}</span></p>

        <div className="my-4 p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
          <p className="font-semibold text-blue-800 dark:text-blue-200">Please complete payment within 15 minutes.</p>
          <CountdownTimer />
        </div>

        <div className="my-6">
          <p className="text-gray-700 dark:text-gray-200 mb-2">{paymentInfo.instructions}</p>
          {paymentInfo.qrCode && <img src={paymentInfo.qrCode} alt="Payment QR Code" className="mx-auto w-48 h-48 my-4"/>}

          {method === 'instapay' ? (
            <div className="space-y-4">
              <p className="text-xl font-bold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                {paymentInfo.details}
              </p>
              <a
                href={paymentInfo.paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
              >
                <FaLink className="mr-2" />
                Pay with Instapay Link
              </a>
              {paymentInfo.hint && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 p-2 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg">
                  {paymentInfo.hint}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xl font-bold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">{paymentInfo.details}</p>
          )}
        </div>

        <div className="mt-6">
          {!confirmationVisible ? (
            <>
              <p className="mb-4">
                Status: <span className={`font-bold ${latestOrder.status === 'Pending Payment' ? 'text-yellow-500' : latestOrder.status === 'Awaiting Confirmation' ? 'text-blue-500' : 'text-green-600'}`}>{latestOrder.status}</span>
              </p>
              {latestOrder.status === 'Pending Payment' && (
                <button
                  onClick={handlePaidClick}
                  className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105"
                >
                  ✅ I Have Completed The Payment
                </button>
              )}
              {latestOrder.status === 'Awaiting Confirmation' && (
                <p className="mt-2 text-blue-600 font-medium">Your payment is already completed and awaiting confirmation.</p>
              )}
              {latestOrder.status === 'Completed' && (
                <p className="mt-2 text-green-600 font-medium">Your order is already completed.</p>
              )}
            </>
          ) : (
            <div className="text-center p-4 border-t-2 border-dashed mt-6 dark:border-gray-600">
              <p className="text-gray-800 dark:text-gray-200 mb-4 font-semibold">
                To confirm your payment, please contact our support team on Telegram or WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://t.me/Geniuspes1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                >
                  <FaTelegramPlane className="mr-2" />
                  Contact on Telegram
                </a>
                <a
                  href="https://wa.me/message/HPK7XPQT5V2LD1" // Replace with your WhatsApp number
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
                >
                  <FaWhatsapp className="mr-2" />
                  Contact on WhatsApp
                </a>
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="font-mono bg-gray-200 dark:bg-gray-700 p-2 rounded">{latestOrder.id}</span>
                  <button
                    onClick={handleCopyOrderId}
                    className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    <FaCopy className="mr-2" />
                    {copyText}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Please include this ID when contacting us to verify your payment faster.
                </p>
              </div>
              <button
                onClick={() => navigate('/success', { state: { orderId: latestOrder.id } })}
                className="mt-8 w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              >
                Finish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentInstructionsPage; 