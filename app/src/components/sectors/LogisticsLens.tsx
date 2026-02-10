"use client";

import { sadcCountries } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import {
  Truck,
  Route,
  Building,
  AlertTriangle,
  MapPin,
  Construction,
  Package,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Road network status by corridor
const roadNetworkData = [
  { corridor: "EN1 Beira-Maputo", status: "Cut-off", sections: 12, damaged: 5, reason: "Cyclone flooding - bridges submerged" },
  { corridor: "EN6 Beira-Chimoio", status: "Restricted", sections: 8, damaged: 2, reason: "Debris clearance in progress" },
  { corridor: "M1 Blantyre-Nsanje", status: "Cut-off", sections: 6, damaged: 4, reason: "Lower Shire valley flooding" },
  { corridor: "EN1 Zambezia Segment", status: "Restricted", sections: 10, damaged: 3, reason: "Partial washout, single-lane operation" },
  { corridor: "RN5A Analanjirofo", status: "Restricted", sections: 7, damaged: 2, reason: "Landslides blocking secondary routes" },
  { corridor: "A7 Dar-Morogoro", status: "Accessible", sections: 9, damaged: 0, reason: "Monitoring for urban flooding" },
  { corridor: "M3 Lilongwe-Zomba", status: "Accessible", sections: 5, damaged: 0, reason: "Normal operations" },
  { corridor: "EN10 Nampula-Nacala", status: "Accessible", sections: 8, damaged: 1, reason: "Minor pothole repairs" },
];

// Bridge status
const bridgeData = [
  { name: "Pungwe River Bridge", location: "Sofala, Mozambique", status: "Impassable", loadLimit: "0t", notes: "Structural damage - bypass required" },
  { name: "Buzi River Crossing", location: "Sofala, Mozambique", status: "Impassable", loadLimit: "0t", notes: "Submerged, water level +3.2m" },
  { name: "Shire River Bridge (Nsanje)", location: "Nsanje, Malawi", status: "Restricted", loadLimit: "5t", notes: "Weight limit imposed, single lane" },
  { name: "Licungo Bridge", location: "Zambezia, Mozambique", status: "Restricted", loadLimit: "10t", notes: "Approach road eroded" },
  { name: "Zambezi Ferry Crossing", location: "Chikwawa, Malawi", status: "Suspended", loadLimit: "0t", notes: "Ferry operations suspended - high water" },
  { name: "Mananjary Crossing", location: "Analanjirofo, Madagascar", status: "Operational", loadLimit: "25t", notes: "Normal operations" },
];

// Warehouse/hub data
const warehouseData = [
  { name: "WFP Beira Hub", location: "Beira, Mozambique", capacity: 12_000, currentStock: 8_400, status: "Active", access: "Road restricted" },
  { name: "IFRC Regional Warehouse", location: "Maputo, Mozambique", capacity: 8_500, currentStock: 7_200, status: "Active", access: "Accessible" },
  { name: "WFP Blantyre Forward Base", location: "Blantyre, Malawi", capacity: 5_000, currentStock: 3_100, status: "Active", access: "Accessible" },
  { name: "UN Hub Nsanje", location: "Nsanje, Malawi", capacity: 2_000, currentStock: 450, status: "Critical", access: "Cut-off" },
  { name: "WFP Antananarivo", location: "Antananarivo, Madagascar", capacity: 6_000, currentStock: 4_800, status: "Active", access: "Accessible" },
  { name: "SADC Regional Stockpile", location: "Gaborone, Botswana", capacity: 15_000, currentStock: 13_500, status: "Standby", access: "Accessible" },
];

// Road summary for pie chart
const accessibleCount = roadNetworkData.filter((r) => r.status === "Accessible").length;
const restrictedCount = roadNetworkData.filter((r) => r.status === "Restricted").length;
const cutoffCount = roadNetworkData.filter((r) => r.status === "Cut-off").length;

const roadPieData = [
  { name: "Accessible", value: accessibleCount, color: "#06b6d4" },
  { name: "Restricted", value: restrictedCount, color: "#f59e0b" },
  { name: "Cut-off", value: cutoffCount, color: "#ef4444" },
];

// Damage summary bar chart
const damageSummary = [
  { type: "Roads (km)", damaged: 187, total: 2340 },
  { type: "Bridges", damaged: 4, total: 28 },
  { type: "Warehouses", damaged: 1, total: 6 },
  { type: "Airstrips", damaged: 2, total: 9 },
  { type: "Port Facilities", damaged: 1, total: 4 },
];

function getRoadStatusColor(status: string) {
  switch (status) {
    case "Accessible":
      return "text-cyan-400";
    case "Restricted":
      return "text-amber-400";
    case "Cut-off":
      return "text-red-400";
    default:
      return "text-zinc-400";
  }
}

function getRoadStatusDot(status: string) {
  switch (status) {
    case "Accessible":
      return "bg-cyan-500";
    case "Restricted":
      return "bg-amber-500";
    case "Cut-off":
      return "bg-red-500";
    default:
      return "bg-zinc-500";
  }
}

function getBridgeStatusColor(status: string) {
  switch (status) {
    case "Operational":
      return "text-cyan-400";
    case "Restricted":
      return "text-amber-400";
    case "Impassable":
      return "text-red-400";
    case "Suspended":
      return "text-red-400";
    default:
      return "text-zinc-400";
  }
}

function getWarehouseStatusColor(status: string) {
  switch (status) {
    case "Active":
      return "text-cyan-400";
    case "Standby":
      return "text-amber-400";
    case "Critical":
      return "text-red-400";
    default:
      return "text-zinc-400";
  }
}

export default function LogisticsLens() {
  const totalDamagedSections = roadNetworkData.reduce(
    (s, r) => s + r.damaged,
    0
  );
  const totalCapacity = warehouseData.reduce((s, w) => s + w.capacity, 0);
  const totalStock = warehouseData.reduce((s, w) => s + w.currentStock, 0);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Route className="h-5 w-5 text-cyan-400" />}
          label="Road Corridors"
          value={roadNetworkData.length}
          sub={`${cutoffCount} cut-off, ${restrictedCount} restricted`}
        />
        <MetricCard
          icon={<Construction className="h-5 w-5 text-cyan-400" />}
          label="Bridges Affected"
          value={bridgeData.filter((b) => b.status !== "Operational").length}
          sub={`of ${bridgeData.length} monitored crossings`}
        />
        <MetricCard
          icon={<Package className="h-5 w-5 text-cyan-400" />}
          label="Warehouse Capacity"
          value={totalCapacity}
          sub={`${formatNumber(totalStock)} MT currently stocked`}
          suffix=" MT"
        />
        <MetricCard
          icon={<AlertTriangle className="h-5 w-5 text-cyan-400" />}
          label="Damaged Sections"
          value={totalDamagedSections}
          sub="Road sections requiring repair"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Road Network Pie */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">
            Road Network Accessibility
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roadPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {roadPieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: "8px",
                    color: "#e4e4e7",
                  }}
                  formatter={(value?: number, name?: string) => [
                    `${value ?? 0} corridors`,
                    name ?? "",
                  ]}
                />
                <Legend
                  wrapperStyle={{ color: "#a1a1aa", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Infrastructure Damage Summary */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">
            Transport Infrastructure Damage Summary
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={damageSummary} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                  horizontal={false}
                />
                <XAxis type="number" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="type"
                  tick={{ fill: "#a1a1aa", fontSize: 11 }}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: "8px",
                    color: "#e4e4e7",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", color: "#a1a1aa" }}
                />
                <Bar
                  dataKey="total"
                  name="Total"
                  fill="#164e63"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="damaged"
                  name="Damaged"
                  fill="#06b6d4"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Supply Route Map Placeholder */}
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
        <div className="flex items-center gap-3 mb-3">
          <MapPin className="h-5 w-5 text-cyan-400" />
          <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">
            Supply Route Accessibility Map
          </h3>
        </div>
        <div className="flex items-center justify-center h-48 rounded-lg border border-dashed border-cyan-500/30 bg-zinc-900/40">
          <div className="text-center">
            <MapPin className="h-10 w-10 text-cyan-500/30 mx-auto mb-2" />
            <p className="text-sm text-zinc-500">
              Interactive supply route map layer
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              Overlay showing accessible, restricted, and cut-off corridors across the SADC region
            </p>
          </div>
        </div>
      </div>

      {/* Road Network Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="flex items-center gap-3 mb-4">
          <Route className="h-5 w-5 text-cyan-400" />
          <h3 className="text-sm font-semibold text-zinc-300">
            Road Network Status
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  Corridor
                </th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  Status
                </th>
                <th className="text-center py-3 px-3 text-zinc-400 font-medium">
                  Sections
                </th>
                <th className="text-center py-3 px-3 text-zinc-400 font-medium">
                  Damaged
                </th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {roadNetworkData.map((road, i) => (
                <tr
                  key={i}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="py-2.5 px-3 text-zinc-200 font-medium">
                    {road.corridor}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1.5 ${getRoadStatusColor(
                        road.status
                      )}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${getRoadStatusDot(
                          road.status
                        )}`}
                      />
                      {road.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center text-zinc-400">
                    {road.sections}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={
                        road.damaged > 0
                          ? "text-red-400 font-medium"
                          : "text-zinc-500"
                      }
                    >
                      {road.damaged}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-zinc-500 text-xs">
                    {road.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bridge Status Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="flex items-center gap-3 mb-4">
          <Construction className="h-5 w-5 text-cyan-400" />
          <h3 className="text-sm font-semibold text-zinc-300">
            Bridge &amp; Crossing Status
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  Bridge / Crossing
                </th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  Location
                </th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  Status
                </th>
                <th className="text-center py-3 px-3 text-zinc-400 font-medium">
                  Load Limit
                </th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {bridgeData.map((bridge, i) => (
                <tr
                  key={i}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="py-2.5 px-3 text-zinc-200 font-medium">
                    {bridge.name}
                  </td>
                  <td className="py-2.5 px-3 text-zinc-400">
                    {bridge.location}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`font-medium ${getBridgeStatusColor(
                        bridge.status
                      )}`}
                    >
                      {bridge.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center text-zinc-400">
                    {bridge.loadLimit}
                  </td>
                  <td className="py-2.5 px-3 text-zinc-500 text-xs">
                    {bridge.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warehouse Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="flex items-center gap-3 mb-4">
          <Building className="h-5 w-5 text-cyan-400" />
          <h3 className="text-sm font-semibold text-zinc-300">
            Warehouse Locations &amp; Capacity
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  Facility
                </th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  Location
                </th>
                <th className="text-right py-3 px-3 text-zinc-400 font-medium">
                  Capacity (MT)
                </th>
                <th className="text-right py-3 px-3 text-zinc-400 font-medium">
                  Current Stock
                </th>
                <th className="text-center py-3 px-3 text-zinc-400 font-medium">
                  Utilization
                </th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  Status
                </th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  Access
                </th>
              </tr>
            </thead>
            <tbody>
              {warehouseData.map((wh, i) => {
                const utilPct = Math.round(
                  (wh.currentStock / wh.capacity) * 100
                );
                return (
                  <tr
                    key={i}
                    className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="py-2.5 px-3 text-zinc-200 font-medium">
                      {wh.name}
                    </td>
                    <td className="py-2.5 px-3 text-zinc-400">
                      {wh.location}
                    </td>
                    <td className="py-2.5 px-3 text-right text-zinc-300">
                      {formatNumber(wh.capacity)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-zinc-300">
                      {formatNumber(wh.currentStock)}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-16 bg-zinc-800 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-cyan-500"
                            style={{ width: `${utilPct}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-400">
                          {utilPct}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`font-medium ${getWarehouseStatusColor(
                          wh.status
                        )}`}
                      >
                        {wh.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={
                          wh.access === "Accessible"
                            ? "text-cyan-400"
                            : wh.access === "Road restricted"
                            ? "text-amber-400"
                            : "text-red-400"
                        }
                      >
                        {wh.access}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  sub,
  suffix,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="text-2xl font-bold text-zinc-100">
        {formatNumber(value)}
        {suffix || ""}
      </div>
      <div className="text-xs text-zinc-500 mt-1">{sub}</div>
    </div>
  );
}
