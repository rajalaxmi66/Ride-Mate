import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/RideCompleted.css";

function RideCompleted() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 200);
  }, []);

  return (
    <div className="page-fade">
      <div className="completed-wrapper">
      <div className={`completed-card ${show ? "show" : ""}`}>
        <div className="icon">🚖</div>

        <h1>RideMate Found!</h1>
        <h2>You Saved Money 💰</h2>

        <p>
          Smart pooling. Smart savings.
          <br />
          Meet you next time!
        </p>

        <button onClick={() => navigate("/ride/create")}>
          Find Another RideMate
        </button>
      </div>
    </div>
    </div>
    
  );
}

export default RideCompleted;