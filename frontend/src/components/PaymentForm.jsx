import { useState } from 'react';

const PaymentForm = ({ onPay }) => {
  const [phone, setPhone] = useState('');

  return (
    <form
      className="payment-form"
      onSubmit={(event) => {
        event.preventDefault();
        onPay({ provider: 'kaspi', phone });
      }}
    >
      <label>
        Kaspi нөмірі
        <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+7..." required />
      </label>
      <button type="submit">Kaspi арқылы төлеу</button>
    </form>
  );
};

export default PaymentForm;
