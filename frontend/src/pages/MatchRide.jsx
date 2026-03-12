import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import '../styles/MatchRide.css'

function MatchRide() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Searching...");

  useEffect(() => {
    const findMatch = async () => {
      try {
        const res = await API.get(`/ride/match/${id}`);

        if (res.data.groupId) {
          navigate(`/group/${res.data.groupId}`);
        } else {
          setStatus(res.data.message || "Searching...");
        }
      } catch (err) {
        setStatus("Error finding match");
      }
    };

    const interval = setInterval(findMatch, 3000);
    return () => clearInterval(interval);
  }, [id, navigate]);

  return <h2>{status}</h2>;
}

export default MatchRide;
