import { useEffect, useRef } from "react";

function LiveMap({ locations = [], commonPickup }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    const center = commonPickup || locations[0] || { lat: 0, lng: 0 };
    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 13,
    });

    // Clear previous markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // User markers
    locations.forEach((loc) => {
      if (!loc.lat || !loc.lng) return;
      const marker = new window.google.maps.Marker({
        position: { lat: loc.lat, lng: loc.lng },
        map,
        label: loc.name[0],
      });
      markersRef.current.push(marker);
    });

    // Common pickup marker
    if (commonPickup?.lat && commonPickup?.lng) {
      const pickupMarker = new window.google.maps.Marker({
        position: { lat: commonPickup.lat, lng: commonPickup.lng },
        map,
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        title: "Common Pickup Point",
      });
      markersRef.current.push(pickupMarker);
    }
  }, [locations, commonPickup]);

  return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
}

export default LiveMap;