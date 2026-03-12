import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import LiveMap from "../components/LiveMap";
import "../styles/GroupDetails.css";
import { useNavigate } from "react-router-dom";
function GroupDetails() {
  const { id } = useParams();
  const [groupMembers, setGroupMembers] = useState([]);
  const [commonPickup, setCommonPickup] = useState(null);
  const [groupStatus, setGroupStatus] = useState("");
  const locationWatcher = useRef(null);
  const navigate = useNavigate();
  // ✅ Fetch group members and common pickup
  const fetchGroupLocations = async () => {
    try {
      const res = await API.get(`/groups/locations/${id}`);
      setGroupMembers(res.data.locations);
      setCommonPickup(res.data.commonPickup);
      setGroupStatus(res.data.status);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Generate common pickup address once after group formed
  const generateCommonPickup = async () => {
    try {
      const res = await API.post(`/groups/generate-common/${id}`);
      setCommonPickup(res.data); // contains lat, lng, place
    } catch (err) {
      console.error("Failed to generate common pickup:", err);
    }
  };

  useEffect(() => {
    generateCommonPickup(); // run once
    fetchGroupLocations();

    const interval = setInterval(fetchGroupLocations, 5000); // poll for updates
    return () => clearInterval(interval);
  }, [id]);

  // 🔥 Start GPS tracking
  useEffect(() => {
    if (!navigator.geolocation) return;

    locationWatcher.current = navigator.geolocation.watchPosition(
      async (position) => {
        try {
          await API.post(`/groups/update-location/${id}`, {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        } catch (err) {
          console.error(err);
        }
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => {
      if (locationWatcher.current) {
        navigator.geolocation.clearWatch(locationWatcher.current);
      }
    };
  }, [id]);

  // 🔹 Stop lifecycle when ride is completed
  useEffect(() => {
  if (groupStatus === "COMPLETED") {
    if (locationWatcher.current) {
      navigator.geolocation.clearWatch(locationWatcher.current);
    }

    setTimeout(() => {
      navigate(`/ride/completed/${id}`);
    }, 1500);
  }
}, [groupStatus, navigate, id]);
  const arrivedCount = groupMembers.filter((m) => m.arrived).length;

  return (
    <div className="page-fade">
      <div className="group-container">
      <h2>🎉Match found! Connecting you with your RideMate.</h2>

      {commonPickup && (
        <>
          <div className="pickup-card">
            <h3>📍 Common Pickup Point</h3>
            <p>{commonPickup.place}</p>
          </div>

          <LiveMap users={groupMembers} commonPickup={commonPickup} />

          <div className="status-section">
            <h3>👥 Members Status</h3>

            {groupMembers.map((member) => (
              <div key={member._id} className="member-card">
                <span>{member.name}</span>
                <div className="status-label">
                  {member.arrived ? "Arrived" : "On the Way"}
                </div>
              </div>
            ))}

            <div className="arrival-counter">
              {arrivedCount} / {groupMembers.length} arrived
            </div>

            {groupStatus === "COMPLETED" && (
              <div className="ride-completed">✅ Ride Completed!</div>
            )}
          </div>
        </>
      )}
    </div>
    </div>
    
  );
}

export default GroupDetails;