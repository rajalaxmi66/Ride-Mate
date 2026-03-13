import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const register = async () => {
    try {
      setLoading(true);

      const res = await API.post("/auth/register", form);

      localStorage.setItem("token", res.data.token);

      navigate("/ride/create");
    } catch (err) {
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-fade">
      <div className="page-container">
        <div className="card auth-card">
          <h2 className="title">Register</h2>

          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button onClick={register} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <p>
            Already registered? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;