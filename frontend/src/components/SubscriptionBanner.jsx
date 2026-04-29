import { Link } from 'react-router-dom';

const SubscriptionBanner = ({ plan }) => {
  if (plan && plan !== 'free') return null;

  return (
    <div className="subscription-banner">
      <p>Free жоспардасыз: күніне 10 тыңдау лимиті және preview режимі.</p>
      <Link to="/pricing" className="auth-btn login">Premium-ға өту</Link>
    </div>
  );
};

export default SubscriptionBanner;
