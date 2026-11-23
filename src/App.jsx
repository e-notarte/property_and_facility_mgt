import { useState } from 'react';

const AUTH_KEY = 'property-management-authenticated';
const REMEMBERED_EMAIL_KEY = 'property-management-email';

export default function App() {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === 'true',
  );
  const [email, setEmail] = useState(
    () => localStorage.getItem(REMEMBERED_EMAIL_KEY) || '',
  );
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(Boolean(email));
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const allowedDomains = [
      '@riibuilders.com',
      '@riibuilders.com.ph',
      '@rmrriibuilders.com',
      '@rmrriibuilders.com.ph',
    ];
    const normalizedEmail = email.trim().toLowerCase();
    const isAllowedEmail = allowedDomains.some((domain) =>
      normalizedEmail.endsWith(domain),
    );

    if (!isAllowedEmail) {
      setError('Use an authorized R-II Builders email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (rememberMe) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, normalizedEmail);
    } else {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }

    sessionStorage.setItem(AUTH_KEY, 'true');
    sessionStorage.setItem('property-management-email', normalizedEmail);
    setAuthenticated(true);
  }

  function handleLogout() {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem('property-management-email');
    setAuthenticated(false);
  }

  if (authenticated) {
    return (
      <main className="app-shell">
        <button className="logout-button" type="button" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          Logout
        </button>
        <iframe
          className="property-app"
          src={`${import.meta.env.BASE_URL}property_mgt_system_dahsboard.html`}
          title="Property Management System"
        />
      </main>
    );
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="brand-header">
          <img
            src={`${import.meta.env.BASE_URL}RII_Logo.png`}
            alt="R-II Builders logo"
          />
          <h1 id="login-title">Welcome Back</h1>
          <p>Property &amp; Facility Management System</p>
        </div>

        {error && (
          <div className="error-message" role="alert">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <i className="fa-regular fa-envelope"></i>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <i className="fa-solid fa-lock"></i>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <div className="options-row">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <button
              className="forgot-link"
              type="button"
              onClick={() => setError('Please contact an administrator to reset your password.')}
            >
              Forgot password?
            </button>
          </div>

          <button className="login-button" type="submit">
            <span>Sign In</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>

        <p className="footer-text">
          © 2026 R-II Builders, Inc. All Rights Reserved.
        </p>
      </section>
    </main>
  );
}
