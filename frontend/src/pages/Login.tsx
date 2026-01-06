import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (value: string) => {
    if (!value) {
      return 'Email gereklidir';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Geçerli bir email adresi giriniz';
    }
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return 'Şifre gereklidir';
    }
    return '';
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setValidationErrors(prev => ({ ...prev, email: validateEmail(value) }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setValidationErrors(prev => ({ ...prev, password: validatePassword(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Final validation
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setValidationErrors({
      email: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) {
      return;
    }

    setLoading(true);

    try {
      await login({ email, password });
      navigate('/events');
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err?.message || err?.response?.data?.message || 'Giriş başarısız. Email veya şifre hatalı.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Giriş Yap</h1>
        <p className="auth-subtitle">Etkinliklere katılmaya devam et</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="email@example.com"
              className={validationErrors.email ? 'input-error' : ''}
            />
            {validationErrors.email && (
              <span className="validation-error">{validationErrors.email}</span>
            )}
            <span className="field-hint">Kayıtlı email adresiniz</span>
          </div>

          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="••••••••"
              className={validationErrors.password ? 'input-error' : ''}
            />
            {validationErrors.password && (
              <span className="validation-error">{validationErrors.password}</span>
            )}
            <span className="field-hint">Hesap şifreniz</span>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className="auth-footer">
          Hesabın yok mu?{' '}
          <Link to="/register" className="auth-link">
            Kayıt ol
          </Link>
        </p>

        <div className="auth-demo">
          <p><strong>Demo Hesaplar:</strong></p>
          <p>Admin: admin@example.com / admin123</p>
          <p>User: test@example.com / password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
