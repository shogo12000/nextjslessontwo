"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    // GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }

    // Hora atual
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-CA", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <p>Current time: {time}</p>

      {location && (
        <>
          <p>
            Latitude: {location.lat}
            <br />
            Longitude: {location.lng}
          </p>

          <iframe
            width="100%"
            height="300"
            loading="lazy"
            src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
          />
        </>
      )}
    </div>
  );
}
