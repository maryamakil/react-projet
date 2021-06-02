import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import axios from 'axios';

export default function App() {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    zoom: 1
  });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(res.data)
    }
    fetchUsers();
    const listener = e => {
      if (e.key === "Escape") {
        setSelectedUser(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);
  // console.log(users)
  return (
    <div>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/maryamit/ckpei2ggs09vd17qoc66xy588"
        onViewportChange={viewport => {
          setViewport(viewport);
        }}
      >
        {users.map(user => (

          <Marker
            key={user.id}
            latitude={parseInt(user.address.geo.lat)}
            longitude={parseInt(user.address.geo.lng)}
          >
            <button
              className="marker-btn"
              onClick={e => {
                e.preventDefault();
                setSelectedUser(user);
              }}
            >
              <img src="/marker.svg" alt="Skate Park Icon" />
            </button>
          </Marker>
        ))}

        {selectedUser ? (
          <Popup
            latitude={parseInt(selectedUser.address.geo.lat)}
            longitude={parseInt(selectedUser.address.geo.lng)}
            onClose={() => {
              setSelectedUser(null);
            }}
          >
            <div>
              <h3>{selectedUser.name}</h3>
              <p>City: {selectedUser.address.city}</p>
              <p>Email: {selectedUser.email}</p>
            </div>
          </Popup>
        ) : null}
      </ReactMapGL>
    </div>
  );
}
