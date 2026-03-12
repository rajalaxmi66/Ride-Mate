import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import '../styles/CreateRide.css'

function CreateRide() {
  const navigate = useNavigate();
  const sourceContainerRef = useRef(null);
  const destinationContainerRef = useRef(null);

  const [sourceData, setSourceData] = useState(null);
  const [destinationData, setDestinationData] = useState(null);

 useEffect(() => {
  if (!window.google) return;

  if (sourceContainerRef.current.hasChildNodes()) return;

  const sourceAutocomplete =
    new window.google.maps.places.PlaceAutocompleteElement();

  const destinationAutocomplete =
    new window.google.maps.places.PlaceAutocompleteElement();

  sourceContainerRef.current.appendChild(sourceAutocomplete);
  destinationContainerRef.current.appendChild(destinationAutocomplete);

  sourceAutocomplete.addEventListener("gmp-select", async ({ placePrediction }) => {
    const place = placePrediction.toPlace();
    await place.fetchFields({
      fields: ["displayName", "formattedAddress", "location"],
    });

    setSourceData({
      description: place.formattedAddress,
       placeId: place.id, 
      lat: place.location.lat(),
      lng: place.location.lng(),
    });
  });


  destinationAutocomplete.addEventListener("gmp-select", async ({ placePrediction }) => {
    const place = placePrediction.toPlace();
    await place.fetchFields({
      fields: ["displayName", "formattedAddress", "location"],
    });

    setDestinationData({
      description: place.formattedAddress,
       placeId: place.id, 
      lat: place.location.lat(),
      lng: place.location.lng(),
    });
  });

}, []); // ✅ useEffect ends here properly

  
  const createRide = async () => {
    if (!sourceData || !destinationData) {
      alert("Please select valid locations");
      return;
    }

    const res = await API.post("/ride/create", {
      source: sourceData,
      destination: destinationData,
    });

    navigate(`/ride/match/${res.data.rideId}`);
  };

  return (
    <div className="page-fade">
    <div className="page-container">
  <div className="card create-ride-container">
    <h2 className="title">Create Ride</h2>

      <div ref={sourceContainerRef}></div>
      <br />
      <div ref={destinationContainerRef}></div>

      <br />
      <button onClick={createRide}>Create Ride</button>
      </div>
    </div>
  </div>
   
  );
}

export default CreateRide;
