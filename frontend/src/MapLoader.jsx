import { useEffect } from "react";

export default function MapLoader() {
  useEffect(() => {
    const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null; // renders nothing
}