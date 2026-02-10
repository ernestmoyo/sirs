"use client";

import { sadcCountries } from "@/lib/mock-data";
import { formatNumber, getRiskLevel, getRiskBadgeClass } from "@/lib/utils";
import {
  Heart,
  Droplets,
  AlertTriangle,
  Users,
  Building2,
  Activity,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// Derive facility data from mock districts
function aggregateFacilities() {
  const allDistricts = sadcCountries.flatMap((c) => c.districts);
  const totalHealth = allDistricts.reduce((s, d) => s + d.facilities.health, 0);
  const healthAtRisk = allDistricts.reduce(
    (s, d) => s + d.facilities.healthAtRisk,
    0
  );
  const totalWash = allDistricts.reduce((s, d) => s + d.facilities.wash, 0);
  const washAtRisk = allDistricts.reduce(
    (s, d) => s + d.facilities.washAtRisk,
    0
  );
  return { totalHealth, healthAtRisk, totalWash, washAtRisk };
}

// Build a per-district facility table
function buildFacilityTable() {
  const rows: {
    name: string;
    type: string;
    district: string;
    riskLevel: string;
    riskScore: number;
    status: string;
  }[] = [];

  sadcCountries.forEach((country) => {
    country.districts.forEach((d) => {
      const healthPct = d.facilities.healthAtRisk / (d.facilities.health || 1);
      rows.push({
        name: `${d.name} District Hospital`,
        type: "Hospital",
        district: d.name,
        riskLevel: getRiskLevel(d.riskScore),
        riskScore: d.riskScore,
        status:
          healthPct > 0.4
            ? "At Risk"
            : healthPct > 0.15
            ? "Operational - Degraded"
            : "Operational",
      });
      rows.push({
        name: `${d.name} Primary Health Centre`,
        type: "Health Centre",
        district: d.name,
        riskLevel: getRiskLevel(d.riskScore),
        riskScore: d.riskScore,
        status:
          healthPct > 0.35
            ? "Non-Functional"
            : healthPct > 0.2
            ? "At Risk"
            : "Operational",
      });
      rows.push({
        name: `${d.name} WASH Network`,
        type: "WASH",
        district: d.name,
        riskLevel: getRiskLevel(d.riskScore),
        riskScore: d.riskScore,
        status:
          d.facilities.washAtRisk / (d.facilities.wash || 1) > 0.35
            ? "At Risk"
            : "Operational",
      });
    });
  });

  return rows.sort((a, b) => {
    const order: Record<string, number> = {
      "Non-Functional": 0,
      "At Risk": 1,
      "Operational - Degraded": 2,
      Operational: 3,
    };
    return (order[a.status] ?? 4) - (order[b.status] ?? 4);
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case "Operational":
      return "text-emerald-400";
    case "Operational - Degraded":
      return "text-yellow-400";
    case "At Risk":
      return "text-orange-400";
    case "Non-Functional":
      return "text-red-400";
    default:
      return "text-zinc-400";
  }
}

function getStatusDot(status: string) {
  switch (status) {
    case "Operational":
      return "bg-emerald-500";
    case "Operational - Degraded":
      return "bg-yellow-500";
    case "At Risk":
      return "bg-orange-500";
    case "Non-Functional":
      return "bg-red-500";
    default:
      return "bg-zinc-500";
  }
}

export default function HealthWashLens() {
  const { totalHealth, healthAtRisk, totalWash, washAtRisk } =
    aggregateFacilities();
  const facilityTable = buildFacilityTable();

  const healthOperational = totalHealth - healthAtRisk;
  const washOperational = totalWash - washAtRisk;

  // Donut chart data
  const nonFunctionalCount = facilityTable.filter(
    (f) => f.status === "Non-Functional"
  ).length;
  const atRiskCount = facilityTable.filter(
    (f) => f.status === "At Risk" || f.status === "Operational - Degraded"
  ).length;
  const operationalCount = facilityTable.filter(
    (f) => f.status === "Operational"
  ).length;

  const donutData = [
    { name: "Operational", value: operationalCount, color: "#10b981" },
    { name: "At Risk / Degraded", value: atRiskCount, color: "#f59e0b" },
    { name: "Non-Functional", value: nonFunctionalCount, color: "#ef4444" },
  ];

  // Affected patients and water access estimates
  const allDistricts = sadcCountries.flatMap((c) => c.districts);
  const totalAffectedPop = allDistricts.reduce(
    (s, d) => s + d.affectedPopulation,
    0
  );
  const patientsAffected = Math.round(totalAffectedPop * 0.12); // ~12% need health services
  const waterDisrupted = Math.round(totalAffectedPop * 0.38); // ~38% water access disrupted

  // Bar chart: facilities at risk by district
  const districtBarData = allDistricts
    .map((d) => ({
      district: d.name,
      healthAtRisk: d.facilities.healthAtRisk,
      washAtRisk: d.facilities.washAtRisk,
    }))
    .sort((a, b) => b.healthAtRisk + b.washAtRisk - (a.healthAtRisk + a.washAtRisk));

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Building2 className="h-5 w-5 text-emerald-400" />}
          label="Health Facilities"
          value={totalHealth}
          sub={`${healthAtRisk} at risk (${Math.round(
            (healthAtRisk / totalHealth) * 100
          )}%)`}
          accent="emerald"
        />
        <MetricCard
          icon={<Droplets className="h-5 w-5 text-emerald-400" />}
          label="WASH Infrastructure"
          value={totalWash}
          sub={`${washAtRisk} at risk (${Math.round(
            (washAtRisk / totalWash) * 100
          )}%)`}
          accent="emerald"
        />
        <MetricCard
          icon={<Users className="h-5 w-5 text-emerald-400" />}
          label="Patients Affected"
          value={patientsAffected}
          sub="Estimated requiring health services"
          accent="emerald"
        />
        <MetricCard
          icon={<AlertTriangle className="h-5 w-5 text-emerald-400" />}
          label="Water Access Disrupted"
          value={waterDisrupted}
          sub="Population with disrupted supply"
          accent="emerald"
        />
      </div>

      {/* Summary banners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="flex items-center gap-3 mb-3">
            <Heart className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-wider">
              Health Facilities Summary
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-400">
                {healthOperational}
              </div>
              <div className="text-xs text-zinc-400">Operational</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">
                {healthAtRisk}
              </div>
              <div className="text-xs text-zinc-400">At Risk</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-300">
                {totalHealth}
              </div>
              <div className="text-xs text-zinc-400">Total</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="flex items-center gap-3 mb-3">
            <Droplets className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-wider">
              WASH Infrastructure Summary
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-400">
                {washOperational}
              </div>
              <div className="text-xs text-zinc-400">Operational</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">
                {washAtRisk}
              </div>
              <div className="text-xs text-zinc-400">At Risk</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-300">
                {totalWash}
              </div>
              <div className="text-xs text-zinc-400">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">
            Facility Status Distribution
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {donutData.map((entry, i) => (
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
                />
                <Legend
                  wrapperStyle={{ color: "#a1a1aa", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: at risk by district */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">
            Facilities at Risk by District
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtBarData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                  horizontal={false}
                />
                <XAxis type="number" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="district"
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
                <Bar
                  dataKey="healthAtRisk"
                  name="Health"
                  fill="#10b981"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="washAtRisk"
                  name="WASH"
                  fill="#34d399"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Facility Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">
          Facility Status Detail
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  Facility
                </th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  Type
                </th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  District
                </th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  Risk Level
                </th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {facilityTable.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="py-2.5 px-3 text-zinc-200">{row.name}</td>
                  <td className="py-2.5 px-3 text-zinc-400">{row.type}</td>
                  <td className="py-2.5 px-3 text-zinc-400">{row.district}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getRiskBadgeClass(
                        row.riskScore
                      )}`}
                    >
                      {row.riskLevel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1.5 ${getStatusColor(
                        row.status
                      )}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${getStatusDot(
                          row.status
                        )}`}
                      />
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
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
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
  accent: string;
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
      </div>
      <div className="text-xs text-zinc-500 mt-1">{sub}</div>
    </div>
  );
}
