import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const login = async () => {
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
      navigate("/home");
      navigate("/ride/create");

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="page-fade">
      <div className="page-container">
  <div className="card auth-card">
    <h2 className="title">Login</h2>
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />

      <button onClick={login}>Login</button>

      <p>
        New user? <Link to="/register">Register here</Link>
      </p>
      </div>
    </div>
  </div>
    
  );
}

export default Login;
