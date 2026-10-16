
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <main className="login-page">
      <h2>Welcome Back</h2>
      <p>Login to continue learning with EduLearn.</p>

      <form onSubmit={(e) => {
        e.preventDefault();
        navigate("/learning");
      }}>
        <input
          type="email"
          placeholder="Email address"
          required
        />

        <input
          type="password"
          placeholder="Password"
          required
        />

        <button type="submit">Login</button>
      </form>

      <button onClick={() => navigate("/")}>
        Back to Home
      </button>
    </main>
  );
}

export default Login;
