import { useState } from "react";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await onLogin(username, password);
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Invalid username or password");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };
  return (
    <div>
      <h2>Log in to application</h2>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          Username
          <input
            placeholder="Username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password
          <input
            placeholder="Password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
