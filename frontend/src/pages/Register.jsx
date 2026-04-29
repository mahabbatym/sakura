import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/api';
import { useMusic } from '../context/MusicContext';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useMusic();

  const validateUsername = (val) => {
    if (!val.trim()) return 'Пайдаланушы аты міндетті';
    if (val.trim().length < 2) return 'Пайдаланушы аты кемінде 2 таңба болуы керек';
    return '';
  };

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

  const validateConfirm = (val) => {
    if (!val) return 'Құпия сөзді растау міндетті';
    if (val !== password) return 'Құпия сөздер сәйкес емес';
    return '';
  };

  const handleChange = (field, val) => {
    if (field === 'username') setUsername(val);
    if (field === 'email') setEmail(val);
    if (field === 'password') setPassword(val);
    if (field === 'confirmPassword') setConfirmPassword(val);
    if (fieldErrors[field]) {
      const validators = { username: validateUsername, email: validateEmail, password: validatePassword, confirmPassword: validateConfirm };
      setFieldErrors((prev) => ({ ...prev, [field]: validators[field](val) }));
    }
  };

  const handleBlur = (field) => {
    const validators = { username: validateUsername, email: validateEmail, password: validatePassword, confirmPassword: validateConfirm };
    setFieldErrors((prev) => ({ ...prev, [field]: validators[field](field === 'username' ? username : field === 'email' ? email : field === 'password' ? password : confirmPassword) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const errs = {
      username: validateUsername(username),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirm(confirmPassword),
    };
    setFieldErrors(errs);
    if (Object.values(errs).some(Boolean)) return;

    setLoading(true);
    try {
      const res = await register({ username, email, password });
      localStorage.setItem('token', res.data.token);
      if (res.data.refreshToken) {
        localStorage.setItem('refreshToken', res.data.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setSuccess('Тіркелу сәтті аяқталды');
      setTimeout(() => navigate('/'), 350);
    } catch (err) {
      setError(err.response?.data?.message || 'Тіркелу сәтсіз аяқталды');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Тіркелу</h2>
        {error ? <p className="error-text auth-feedback">{error}</p> : null}
        {success ? <p className="success-text auth-feedback">{success}</p> : null}
        <form onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <input
              type="text"
              placeholder="Пайдаланушы аты"
              value={username}
              onChange={(e) => handleChange('username', e.target.value)}
              onBlur={() => handleBlur('username')}
              className={fieldErrors.username ? 'input-error' : ''}
            />
            {fieldErrors.username ? <p className="field-error">{fieldErrors.username}</p> : null}
          </div>
          <div className="field-group">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => handleChange('email', e.target.value)}
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
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              className={fieldErrors.password ? 'input-error' : ''}
            />
            {fieldErrors.password ? <p className="field-error">{fieldErrors.password}</p> : null}
          </div>
          <div className="field-group">
            <input
              type="password"
              placeholder="Құпия сөзді растау"
              value={confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              className={fieldErrors.confirmPassword ? 'input-error' : ''}
            />
            {fieldErrors.confirmPassword ? <p className="field-error">{fieldErrors.confirmPassword}</p> : null}
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Жүктелуде...' : 'Тіркелу'}</button>
        </form>
        <div className="auth-link">
          Қазір тіркелгенсіз бе? <Link to="/login">Кіру</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;