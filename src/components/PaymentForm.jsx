import React, { useState } from 'react';

const PaymentForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gameId, setGameId] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Instapay');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, gameId, phone, paymentMethod });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Game ID"
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="Instapay">Instapay</option>
        <option value="Vodafone">Vodafone</option>
        <option value="Etisalat">Etisalat</option>
        <option value="Orange">Orange</option>
      </select>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Submit</button>
    </form>
  );
};

export default PaymentForm; 