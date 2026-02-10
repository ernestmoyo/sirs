"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { sadcCountries, activeEvents } from "@/lib/mock-data";
import { getRiskColor, getRiskLevel, formatNumber } from "@/lib/utils";

// Fix default marker icon issue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Cyclone projected track (Batsirai II path from Mozambique Channel to landfall)
const cycloneTrack: [number, number][] = [
  [-14.0, 48.0],
  [-15.2, 46.5],
  [-16.0, 44.8],
  [-16.8, 43.2],
  [-17.5, 42.3], // Current position
];

const cycloneProjectedTrack: [number, number][] = [
  [-17.5, 42.3], // Current position
  [-18.0, 40.5],
  [-18.5, 38.8],
  [-19.0, 37.2],
  [-19.2, 35.8], // Projected landfall - Sofala
];

function MapSetup() {
  const map = useMap();

  useEffect(() => {
    // Disable scroll zoom by default for better UX
    map.scrollWheelZoom.disable();
    // Re-enable on focus
    map.on("focus", () => map.scrollWheelZoom.enable());
    map.on("blur", () => map.scrollWheelZoom.disable());
  }, [map]);

  return null;
}

export default function RegionalRiskMapInner() {
  const cycloneEvent = activeEvents.find((e) => e.type === "cyclone");

  return (
    <MapContainer
      center={[-15, 30]}
      zoom={4}
      className="h-full w-full"
      style={{ minHeight: "450px" }}
      zoomControl={true}
    >
      <MapSetup />
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
      />
      {/* Country labels tile layer */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
      />

      {/* Country risk markers */}
      {sadcCountries.map((country) => {
        const color = getRiskColor(country.riskScore);
        const radius = Math.max(8, country.riskScore * 28);
        return (
          <CircleMarker
            key={country.id}
            center={[country.lat, country.lng]}
            radius={radius}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: 0.25,
              weight: 2,
              opacity: 0.8,
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-100">
                    {country.name}
                  </h4>
                  <span
                    className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{
                      backgroundColor: `${color}22`,
                      color: color,
                      border: `1px solid ${color}44`,
                    }}
                  >
                    {getRiskLevel(country.riskScore)}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Risk Score</span>
                    <span className="font-semibold" style={{ color }}>
                      {(country.riskScore * 10).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Affected Pop.</span>
                    <span className="font-medium text-slate-200">
                      {formatNumber(country.affectedPopulation)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Active Alerts</span>
                    <span className="font-medium text-slate-200">
                      {country.activeAlerts}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Population</span>
                    <span className="font-medium text-slate-200">
                      {formatNumber(country.population)}
                    </span>
                  </div>
                  {/* Risk breakdown bar */}
                  <div className="pt-1.5 mt-1.5 border-t border-slate-700/50">
                    <div className="flex gap-1 text-[10px] text-slate-500 mb-1">
                      <span className="flex-1">Hazard</span>
                      <span className="flex-1">Exposure</span>
                      <span className="flex-1">Vuln.</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${country.hazardScore * 100}%`,
                            backgroundColor: getRiskColor(country.hazardScore),
                          }}
                        />
                      </div>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${country.exposureScore * 100}%`,
                            backgroundColor: getRiskColor(
                              country.exposureScore
                            ),
                          }}
                        />
                      </div>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${country.vulnerabilityScore * 100}%`,
                            backgroundColor: getRiskColor(
                              country.vulnerabilityScore
                            ),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}

      {/* Cyclone historical track (solid line) */}
      <Polyline
        positions={cycloneTrack}
        pathOptions={{
          color: "#a855f7",
          weight: 2.5,
          opacity: 0.8,
        }}
      />

      {/* Cyclone projected track (dashed line) */}
      <Polyline
        positions={cycloneProjectedTrack}
        pathOptions={{
          color: "#a855f7",
          weight: 2,
          opacity: 0.6,
          dashArray: "8, 8",
        }}
      />

      {/* Cyclone current position marker */}
      {cycloneEvent && (
        <CircleMarker
          center={[cycloneEvent.lat, cycloneEvent.lng]}
          radius={10}
          pathOptions={{
            color: "#a855f7",
            fillColor: "#a855f7",
            fillOpacity: 0.4,
            weight: 3,
            opacity: 1,
          }}
        >
          <Popup>
            <div className="min-w-[180px]">
              <h4 className="text-sm font-bold text-slate-100 mb-1">
                {cycloneEvent.name}
              </h4>
              <span className="inline-block rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/30 mb-2">
                {cycloneEvent.severity.toUpperCase()}
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {cycloneEvent.description}
              </p>
              <div className="mt-2 flex justify-between text-xs">
                <span className="text-slate-400">Affected</span>
                <span className="font-medium text-slate-200">
                  {formatNumber(cycloneEvent.affectedPopulation)}
                </span>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      )}
    </MapContainer>
  );
}
