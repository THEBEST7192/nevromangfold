import React, { useState } from 'react';
import './LoginPage.css';

type AuthMode = 'login' | 'register';

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      console.log('Login attempt', loginData);
    } else {
      console.log('Register attempt', registerData);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {mode === 'login' ? (
          <form className="auth-form" onSubmit={handleSubmit}>
            <h1>Velkommen tilbake</h1>
            <p className="auth-subtitle">Logg inn for å følge med på arrangementer, frivillig arbeid og nyheter.</p>

            <label htmlFor="login-email">E-post</label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="navn@eksempel.no"
              value={loginData.email}
              onChange={handleLoginChange}
              required
            />

            <label htmlFor="login-password">Passord</label>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />

            <button type="submit" className="primary-btn">Logg inn</button>

            <button
              type="button"
              className="ghost-btn"
              onClick={() => setMode('register')}
            >
              Opprett ny konto
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <h1>Bli med i fellesskapet</h1>
            <p className="auth-subtitle">Lag en konto for å delta på arrangementer og holde deg oppdatert.</p>

            <label htmlFor="register-name">Navn</label>
            <input
              id="register-name"
              name="name"
              type="text"
              placeholder="Ditt navn"
              value={registerData.name}
              onChange={handleRegisterChange}
              required
            />

            <label htmlFor="register-email">E-post</label>
            <input
              id="register-email"
              name="email"
              type="email"
              placeholder="navn@eksempel.no"
              value={registerData.email}
              onChange={handleRegisterChange}
              required
            />

            <label htmlFor="register-password">Passord</label>
            <input
              id="register-password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={registerData.password}
              onChange={handleRegisterChange}
              required
            />

            <button type="submit" className="primary-btn">Opprett konto</button>

            <button
              type="button"
              className="ghost-btn"
              onClick={() => setMode('login')}
            >
              Allerede medlem? Logg inn
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
