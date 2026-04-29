import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/api';
import { useMusic } from '../context/MusicContext';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useMusic();

  const validateEmail = (val) => {
    if (!val.trim()) return 'Email өрісі міндетті';
    if (/^\d+$/.test(val.trim())) return 'Email тек сандардан тұра алмайды';
    if (!emailRegex.test(val.trim())) return 'Email форматы дұрыс емес (мысалы: user@mail.com)';
    return '';
  };

  const validatePassword = (val) => {
    if (!val) return 'Құпия сөз міндетті';
    if (val.length < 6) return 'Құпия сөз кемінде 6 таңба болуы керек';
    return '';
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: validateEmail(val) }));
    }
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: validatePassword(val) }));
    }
  };

  const handleBlur = (field) => {
    if (field === 'email') setFieldErrors((prev) => ({ ...prev, email: validateEmail(email) }));
    if (field === 'password') setFieldErrors((prev) => ({ ...prev, password: validatePassword(password) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const errs = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setFieldErrors(errs);
    if (Object.values(errs).some(Boolean)) return;

    setLoading(true);
    try {
      const res = await login({ email, password });
      localStorage.setItem('token', res.data.token);
      if (res.data.refreshToken) {
        localStorage.setItem('refreshToken', res.data.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setSuccess('Сәтті кірдіңіз');
      setTimeout(() => navigate('/'), 350);
    } catch (err) {
      setError(err.response?.data?.message || 'Кіру сәтсіз аяқталды');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Кіру</h2>
        {error ? <p className="error-text auth-feedback">{error}</p> : null}
        {success ? <p className="success-text auth-feedback">{success}</p> : null}
        <form onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => handleBlur('email')}
              className={fieldErrors.email ? 'input-error' : ''}
            />
            {fieldErrors.email ? <p className="field-error">{fieldErrors.email}</p> : null}
          </div>
          <div className="field-group">
            <input
              type="password"
              placeholder="Құпия сөз"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => handleBlur('password')}
              className={fieldErrors.password ? 'input-error' : ''}
            />
            {fieldErrors.password ? <p className="field-error">{fieldErrors.password}</p> : null}
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Жүктелуде...' : 'Кіру'}</button>
        </form>
        <div className="auth-link">
          Тіркелмегенсіз бе? <Link to="/register">Тіркелу</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;