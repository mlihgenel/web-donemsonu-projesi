import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    password: '',
  });
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Real-time validation
  const validateName = (value: string) => {
    if (!value) {
      return 'İsim gereklidir';
    }
    if (value.length < 2) {
      return 'İsim en az 2 karakter olmalıdır';
    }
    return '';
  };

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
    if (value.length < 6) {
      return 'Şifre en az 6 karakter olmalıdır';
    }
    return '';
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setValidationErrors(prev => ({ ...prev, name: validateName(value) }));
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
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setValidationErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
    });

    if (nameError || emailError || passwordError) {
      return;
    }

    setLoading(true);

    try {
      await register({ name, email, password });
      navigate('/events');
    } catch (err: any) {
      console.error('Register error:', err);
      const errorMessage = err?.message || err?.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        setError(errorMessage.join(', '));
      } else {
        setError(errorMessage || 'Kayıt başarısız. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Kayıt Ol</h1>
        <p className="auth-subtitle">Etkinliklere katılmaya başla</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">İsim</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ad Soyad"
              className={validationErrors.name ? 'input-error' : ''}
            />
            {validationErrors.name && (
              <span className="validation-error">{validationErrors.name}</span>
            )}
            <span className="field-hint">En az 2 karakter</span>
          </div>

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
            <span className="field-hint">Geçerli bir email adresi giriniz</span>
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
            <span className="field-hint">En az 6 karakter</span>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p className="auth-footer">
          Zaten hesabın var mı?{' '}
          <Link to="/login" className="auth-link">
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
