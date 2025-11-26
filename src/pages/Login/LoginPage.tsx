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
    username: '',
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginData),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          if (data && data.error === 'invalid_credentials') {
            setError('Feil e-post eller passord.');
          } else {
            setError('Kunne ikke logge inn. Prøv igjen senere.');
          }
          return;
        }

        setSuccess('Du er nå logget inn.');
        console.log('Login success', data);
      } else {
        const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registerData),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          if (data && data.error === 'user_exists') {
            setError('En bruker med denne e-posten finnes allerede.');
          } else if (data && data.error === 'username_taken') {
            setError('Brukernavnet er opptatt. Velg et annet.');
          } else if (data && data.error === 'invalid_username') {
            setError('Brukernavn må være 3-15 tegn og kan kun inneholde bokstaver, tall eller _.');
          } else if (data && data.error === 'missing_fields') {
            setError('Fyll ut alle felt.');
          } else {
            setError('Kunne ikke opprette konto. Prøv igjen senere.');
          }
          return;
        }

        setSuccess('Kontoen din er opprettet. Du kan nå logge inn.');
        console.log('Register success', data);
      }
    } catch (err) {
      setError('Uventet feil. Sjekk tilkoblingen og prøv igjen.');
    } finally {
      setLoading(false);
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

            {error && <div className="auth-message error">{error}</div>}
            {success && <div className="auth-message success">{success}</div>}

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Logger inn...' : 'Logg inn'}
            </button>

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

            <label htmlFor="register-username">Brukernavn</label>
            <input
              id="register-username"
              name="username"
              type="text"
              placeholder="Velg brukernavn"
              value={registerData.username}
              onChange={handleRegisterChange}
              required
            />

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

            {error && <div className="auth-message error">{error}</div>}
            {success && <div className="auth-message success">{success}</div>}

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Oppretter konto...' : 'Opprett konto'}
            </button>

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
