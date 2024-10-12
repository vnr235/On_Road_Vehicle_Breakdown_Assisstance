import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function TrackMechanic() {
  const [mechanicLocation, setMechanicLocation] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    socket.on('location_update', (data) => {
      setMechanicLocation(data);
    });

    // Cleanup the socket listener on component unmount
    return () => {
      socket.off('location_update');
    };
  }, []);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '400px' }}
        center={mechanicLocation}
        zoom={15}
      >
        {mechanicLocation.lat !== 0 && mechanicLocation.lng !== 0 && (
          <Marker position={mechanicLocation} />
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default TrackMechanic;
