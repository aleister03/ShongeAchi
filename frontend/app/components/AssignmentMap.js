"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 14);
    } else {
      map.fitBounds(points, { padding: [40, 40] });
    }
  }, [points, map]);
  return null;
}

/**
 * Shows the selected elder plus their recommended checkers on an
 * OpenStreetMap tile layer via react-leaflet. Only renders a marker for
 * records that actually have geocoded coordinates — elders/checkers
 * without coordinates (geocoding failed, or predate this feature) are
 * simply skipped rather than crashing the map. Must be loaded with
 * `next/dynamic` + `{ ssr: false }` since Leaflet requires `window`.
 *
 * @param {object} elder
 * @param {Array} recommendations
 */
export default function AssignmentMap({ elder, recommendations }) {
  const elderCoords = elder?.address?.coordinates;
  const hasElderLocation = elderCoords?.lat != null && elderCoords?.lng != null;

  const checkerPoints = (recommendations || [])
    .filter((r) => r.checker?.serviceLocation?.lat != null)
    .map((r) => ({
      id: r.checker._id,
      name: r.checker.name,
      distanceKm: r.distanceKm,
      position: [r.checker.serviceLocation.lat, r.checker.serviceLocation.lng],
    }));

  if (!hasElderLocation) {
    return (
      <div className="bg-[#f7faf5] rounded-xl p-6 text-sm text-gray-500 text-center">
        This elder&apos;s address hasn&apos;t been geocoded yet, so a map can&apos;t be shown. Run the
        geocoding backfill (POST /api/geocode/backfill) or re-save the elder&apos;s address.
      </div>
    );
  }

  const elderPosition = [elderCoords.lat, elderCoords.lng];
  const allPoints = [elderPosition, ...checkerPoints.map((c) => c.position)];

  return (
    <MapContainer
      center={elderPosition}
      zoom={13}
      style={{ height: "360px", width: "100%", borderRadius: "1rem" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={elderPosition}>
        <Popup>{elder.name} (elder)</Popup>
      </Marker>
      {checkerPoints.map((c) => (
        <Marker key={c.id} position={c.position}>
          <Popup>
            {c.name}
            {c.distanceKm != null && <> — {c.distanceKm.toFixed(1)} km away</>}
          </Popup>
        </Marker>
      ))}
      <FitBounds points={allPoints} />
    </MapContainer>
  );
}