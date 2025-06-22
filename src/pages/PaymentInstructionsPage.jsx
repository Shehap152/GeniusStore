import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { updateOrderStatus } from '../logic/orderService';

const paymentDetails = {
  instapay: {
    title: 'Pay with Instapay',
    instructions: 'Scan the QR code below with your Instapay app or send the payment to our Instapay account.',
    details: 'Instapay Number: 7313-3739-4938-0921',
    qrCode: '/assets/instapay-qr.png', // Placeholder QR code
  },
  vodafone: {
    title: 'Pay with Vodafone Cash',
    instructions: 'Please transfer the exact order amount to the following Vodafone Cash number:',
    details: 'Wallet Number: 01010920472',
  },
  etisalat: {
    title: 'Pay with Etisalat Cash',
    instructions: 'Please transfer the exact order amount to the following Etisalat Cash number:',
    details: 'Wallet Number: 01145569738',
  },
  orange: {
    title: 'Pay with Orange Cash',
    instructions: 'Please transfer the exact order amount to the following Orange Cash number:',
    details: 'Wallet Number: 01273926729',
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

  const handlePaidClick = async () => {
    await updateOrderStatus(order.firestoreId, 'Awaiting Confirmation');
    navigate('/success', { state: { orderId: order.orderId } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 text-center">
        <h1 className="text-2xl font-bold mb-2 dark:text-white">{paymentInfo.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Order ID: <span className="font-mono bg-gray-100 dark:bg-gray-700 p-1 rounded">{order.orderId}</span></p>

        <div className="my-4 p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
          <p className="font-semibold text-blue-800 dark:text-blue-200">Please complete payment within 15 minutes.</p>
          <CountdownTimer />
        </div>

        <div className="my-6">
          <p className="text-gray-700 dark:text-gray-200 mb-2">{paymentInfo.instructions}</p>
          {paymentInfo.qrCode && <img src={paymentInfo.qrCode} alt="Payment QR Code" className="mx-auto w-48 h-48 my-4"/>}
          <p className="text-xl font-bold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">{paymentInfo.details}</p>
        </div>

        <div className="mt-6">
           <p className="mb-4">
            Status: <span className="font-bold text-yellow-500">Pending Payment</span>
          </p>
            <button
              onClick={handlePaidClick}
              className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105"
            >
              ✅ I Have Completed The Payment
            </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentInstructionsPage; 