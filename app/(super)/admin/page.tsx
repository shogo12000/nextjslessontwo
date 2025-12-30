"use client";
import { getUserLogin } from "@/ui/actions/actions";
import { useEffect, useState } from "react";

export default function page() {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
        alert("Permission denied or error");
      }
    );
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {location && (
        <p>
          Latitude: {location.lat} <br />
          Longitude: {location.lng}
        </p>
      )}
    </div>
  );
}
