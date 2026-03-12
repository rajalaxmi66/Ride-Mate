import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  return (
    <div className="page-fade">
      <div className="home-container">
      <h1>🚖 Auto Pool</h1>
      <p>Share rides. Save money. Travel smart.</p>

      {!user ? (
        <div className="home-actions">
          <button onClick={() => navigate("/login")} className="btn">
            🔐 Login
          </button>
          <button onClick={() => navigate("/register")} className="btn secondary">
            📝 Register
          </button>
        </div>
      ) : (
        <div className="home-actions">
          <h2>Welcome back, {user.name} 👋</h2>

          <button onClick={() => navigate("/ride/create")} className="btn">
            🚗 Create Ride
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="btn secondary"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
    </div>
    
  );
}

export default Home;