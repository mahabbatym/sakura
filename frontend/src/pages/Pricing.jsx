import { useState } from 'react';
import { upgradeSubscription } from '../api/api';
import PaymentForm from '../components/PaymentForm';

const plans = [
  { id: 'free', title: 'Free', price: '0₸', features: ['Жарнамалы', '30 сек preview', 'Күніне 10 тыңдау'] },
  { id: 'premium', title: 'Premium', price: '799₸/ай', features: ['Жарнамасыз', 'Толық тыңдау', 'Офлайн жүктеу'] },
  { id: 'artist_pro', title: 'Artist Pro', price: '1499₸/ай', features: ['Аналитика', 'Revenue share', 'Промоция'] },
];

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [message, setMessage] = useState('');

  const handleUpgrade = async () => {
    try {
      await upgradeSubscription({ plan: selectedPlan, paymentProvider: 'kaspi' });
      setMessage('Жазылым жаңартылды');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Жаңарту сәтсіз');
    }
  };

  return (
    <main className="main-content">
      <h2 className="section-title">Жазылым жоспарлары</h2>
      <div className="pricing-grid">
        {plans.map((plan) => (
          <article key={plan.id} className={`pricing-card ${selectedPlan === plan.id ? 'active' : ''}`}>
            <h3>{plan.title}</h3>
            <p className="pricing-price">{plan.price}</p>
            {plan.features.map((feature) => <p key={feature}>{feature}</p>)}
            <button onClick={() => setSelectedPlan(plan.id)}>Таңдау</button>
          </article>
        ))}
      </div>
      <PaymentForm onPay={handleUpgrade} />
      {message ? <p className="success-text">{message}</p> : null}
    </main>
  );
};

export default Pricing;
