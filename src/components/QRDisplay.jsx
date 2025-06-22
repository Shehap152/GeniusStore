import React from 'react';

const QRDisplay = ({ qrUrl, instructions }) => (
  <div className="flex flex-col items-center">
    {qrUrl ? (
      <img src={qrUrl} alt="Payment QR Code" className="w-40 h-40 mb-4" />
    ) : null}
    {instructions ? (
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-center">
        {instructions}
      </div>
    ) : null}
  </div>
);

export default QRDisplay; 