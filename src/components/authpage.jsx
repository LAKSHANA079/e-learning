import { useState } from "react";
import "./AuthPage.css";

export default function AuthPage({ onLogin }) {
  const [isSignup, setIsSignup] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const users = JSON.parse(
      localStorage.getItem("elearning-users") || "[]"
    );

    if (isSignup) {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError("Please fill in all fields.");
        return;
      }

      if (users.some(user => user.email === email.trim())) {
        setError("This email is already registered. Please log in.");
        return;
      }

      const newUser = {
        name: name.trim(),
        email: email.trim(),
        password
      };

      localStorage.setItem(
        "elearning-users",
        JSON.stringify([...users, newUser])
      );

      setIsSignup(false);
      setPassword("");
      setError("Account created! Please log in.");
      return;
    }

    const foundUser = users.find(
      user =>
        user.email === email.trim() &&
        user.password === password
    );

    if (!foundUser) {
      setError("Invalid email or password.");
      return;
    }

    onLogin({
      name: foundUser.name,
      email: foundUser.email
    });
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">✦ EduLearn</div>
        <div className="auth-message">
          <span className="auth-tag">YOUR LEARNING JOURNEY</span>
          <h1>Learn today.<br />Lead tomorrow.</h1>
          <p>
            Build new skills, explore courses, and turn
            your learning goals into achievements.
          </p>

          <div className="auth-features">
            <div>✓ Expert-designed courses</div>
            <div>✓ Track your learning progress</div>
            <div>✓ Celebrate your achievements</div>
          </div>
        </div>
        <p className="auth-copyright">
          © 2026 EduLearn · Learn without limits
        </p>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-mobile-brand">✦ EduLearn</div>

          <div className="auth-icon">🎓</div>

          <h2>{isSignup ? "Create your account" : "Welcome back!"}</h2>
          <p className="auth-subtitle">
            {isSignup
              ? "Start your learning journey with us."
              : "Log in to continue learning."}
          </p>

          <div className="auth-tabs">
            <button
              type="button"
              className={isSignup ? "active" : ""}
              onClick={() => {
                setIsSignup(true);
                setError("");
              }}
            >
              Sign Up
            </button>
            <button
              type="button"
              className={!isSignup ? "active" : ""}
              onClick={() => {
                setIsSignup(false);
                setError("");
              }}
            >
              Login
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <label>
                Full name
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </label>
            )}

            <label>
              Email address
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete={isSignup ? "new-password" : "current-password"}
                required
              />
            </label>

            {error && (
              <p className="auth-error" role="status">{error}</p>
            )}

            <button className="auth-submit" type="submit">
              {isSignup ? "Create Account →" : "Login →"}
            </button>
          </form>

          <p className="auth-switch">
            {isSignup ? "Already have an account?" : "New to EduLearn?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError("");
              }}
            >
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </p>

          <p className="auth-security">
            🔒 Demo sign-in · Do not use a real password
          </p>
        </div>
      </div>
    </div>
  );
}
