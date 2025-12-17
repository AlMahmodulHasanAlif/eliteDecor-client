import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const ServiceCoverage = () => {
  return (
    <section className="py-16 bg-base-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Service Coverage Area</h2>
          <p className="text-xl text-gray-600">
            We serve across Dhaka and all of Bangladesh
          </p>
        </div>

        <div className="h-96 rounded-2xl overflow-hidden shadow-2xl">
          <MapContainer
            center={[23.685, 90.3563]}
            zoom={7}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Six Division Markers */}
            <Marker position={[23.8103, 90.4125]}>
              <Popup>Dhaka Division</Popup>
            </Marker>
            <Marker position={[22.3569, 91.7832]}>
              <Popup>Chittagong Division</Popup>
            </Marker>
            <Marker position={[22.8456, 89.5403]}>
              <Popup>Khulna Division</Popup>
            </Marker>
            <Marker position={[24.3636, 88.6241]}>
              <Popup>Rajshahi Division</Popup>
            </Marker>
            <Marker position={[22.701, 90.3535]}>
              <Popup>Barishal Division</Popup>
            </Marker>
            <Marker position={[24.9036, 91.873]}>
              <Popup>Sylhet Division</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </section>
  );
};

export default ServiceCoverage;
