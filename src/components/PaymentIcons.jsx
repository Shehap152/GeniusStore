import React from 'react';
import { FaPaypal, FaApplePay, FaGooglePay, FaAmazonPay } from 'react-icons/fa';
import { SiVisa, SiMastercard } from 'react-icons/si';

const paymentMethods = [
  { name: 'Visa', icon: <SiVisa />, color: '#1A1F71' },
  { name: 'Mastercard', icon: <SiMastercard />, color: '#EB001B' },
  { name: 'PayPal', icon: <FaPaypal />, color: '#00457C' },
  { name: 'Apple Pay', icon: <FaApplePay />, color: '#000000' },
  { name: 'Google Pay', icon: <FaGooglePay />, color: '#5F6368' },
  { name: 'Amazon Pay', icon: <FaAmazonPay />, color: '#FF9900' },
];

const PaymentIcons = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-12">
      <h3 className="text-center text-lg font-semibold text-gray-600 dark:text-gray-400 mb-8">
        Secure Payments Accepted
      </h3>
      <div className="flex justify-center items-center flex-wrap gap-8">
        {paymentMethods.map((method) => (
          <div
            key={method.name}
            className="text-5xl text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            style={{ '--color': method.color }}
            onMouseOver={(e) => e.currentTarget.style.color = e.currentTarget.style.getPropertyValue('--color')}
            onMouseOut={(e) => e.currentTarget.style.color = ''}
          >
            {method.icon}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentIcons; 