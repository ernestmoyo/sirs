"use client";

import { sadcCountries } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import {
  Shield,
  Users,
  Wallet,
  AlertTriangle,
  BarChart3,
  TrendingDown,
  CircleDollarSign,
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
  Cell,
  PieChart,
  Pie,
} from "recharts";

// Derive household data from mock districts
function buildDistrictTransferData() {
  const allDistricts = sadcCountries.flatMap((c) => c.districts);
  return allDistricts.map((d) => {
    const totalHouseholds = Math.round(d.population / 5.2);
    const eligibleHouseholds = Math.round(
      d.affectedPopulation / 5.2 * 0.85
    );
    const registeredHouseholds = Math.round(eligibleHouseholds * (0.4 + d.riskScore * 0.35));
    const coverageGap = eligibleHouseholds - registeredHouseholds;
    const transferAmount = d.riskScore >= 0.8 ? 120 : d.riskScore >= 0.6 ? 85 : 55;
    const priority = d.riskScore >= 0.8 ? "Critical" : d.riskScore >= 0.6 ? "High" : d.riskScore >= 0.4 ? "Medium" : "Low";

    return {
      district: d.name,
      country: d.country,
      totalHouseholds,
      eligibleHouseholds,
      registeredHouseholds,
      coverageGap,
      coveragePct: Math.round((registeredHouseholds / eligibleHouseholds) * 100),
      transferAmount,
      totalTransferCost: registeredHouseholds * transferAmount,
      priority,
      povertyIndex: Math.round(d.vulnerabilityScore * 100),
    };
  }).sort((a, b) => b.eligibleHouseholds - a.eligibleHouseholds);
}

// Poverty overlay data
const povertyOverlay = [
  { country: "Mozambique", povertyRate: 62.9, multidimensionalPoverty: 72.5, socialProtectionCoverage: 18.3 },
  { country: "Malawi", povertyRate: 50.7, multidimensionalPoverty: 65.8, socialProtectionCoverage: 22.1 },
  { country: "Madagascar", povertyRate: 77.4, multidimensionalPoverty: 81.2, socialProtectionCoverage: 12.6 },
  { country: "Tanzania", povertyRate: 26.4, multidimensionalPoverty: 38.7, socialProtectionCoverage: 31.5 },
  { country: "DR Congo", povertyRate: 63.9, multidimensionalPoverty: 74.3, socialProtectionCoverage: 8.4 },
  { country: "Zimbabwe", povertyRate: 38.3, multidimensionalPoverty: 45.2, socialProtectionCoverage: 24.7 },
];

function getPriorityColor(priority: string) {
  switch (priority) {
    case "Critical":
      return "text-red-400";
    case "High":
      return "text-orange-400";
    case "Medium":
      return "text-amber-400";
    case "Low":
      return "text-emerald-400";
    default:
      return "text-zinc-400";
  }
}

function getPriorityDot(priority: string) {
  switch (priority) {
    case "Critical":
      return "bg-red-500";
    case "High":
      return "bg-orange-500";
    case "Medium":
      return "bg-amber-500";
    case "Low":
      return "bg-emerald-500";
    default:
      return "bg-zinc-500";
  }
}

export default function SocialProtectionLens() {
  const districtData = buildDistrictTransferData();

  const totalEligible = districtData.reduce((s, d) => s + d.eligibleHouseholds, 0);
  const totalRegistered = districtData.reduce((s, d) => s + d.registeredHouseholds, 0);
  const totalGap = totalEligible - totalRegistered;
  const overallCoverage = Math.round((totalRegistered / totalEligible) * 100);
  const totalTransferBudget = districtData.reduce((s, d) => s + d.totalTransferCost, 0);

  // Coverage gap donut
  const coverageDonut = [
    { name: "Registered", value: totalRegistered, color: "#a855f7" },
    { name: "Coverage Gap", value: totalGap, color: "#3f3f46" },
  ];

  // Bar chart: eligible vs registered by district
  const barData = districtData.map((d) => ({
    district: d.district,
    eligible: d.eligibleHouseholds,
    registered: d.registeredHouseholds,
    gap: d.coverageGap,
  }));

  // Poverty bar chart
  const povertyBarData = povertyOverlay.map((p) => ({
    country: p.country,
    povertyRate: p.povertyRate,
    spCoverage: p.socialProtectionCoverage,
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Users className="h-5 w-5 text-purple-400" />}
          label="Eligible Households"
          value={totalEligible}
          sub="For anticipatory cash transfers"
        />
        <MetricCard
          icon={<Shield className="h-5 w-5 text-purple-400" />}
          label="Registry Coverage"
          value={overallCoverage}
          sub={`${formatNumber(totalRegistered)} of ${formatNumber(totalEligible)} households`}
          suffix="%"
        />
        <MetricCard
          icon={<TrendingDown className="h-5 w-5 text-purple-400" />}
          label="Coverage Gap"
          value={totalGap}
          sub="Households not yet in registry"
        />
        <MetricCard
          icon={<CircleDollarSign className="h-5 w-5 text-purple-400" />}
          label="Est. Transfer Budget"
          value={totalTransferBudget}
          sub="USD for registered beneficiaries"
          prefix="$"
        />
      </div>

      {/* Summary Banner */}
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
        <div className="flex items-center gap-3 mb-3">
          <Wallet className="h-5 w-5 text-purple-400" />
          <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
            Anticipatory Cash Transfer Readiness
          </h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {districtData.filter((d) => d.priority === "Critical").length}
            </div>
            <div className="text-xs text-zinc-400">Critical Priority Districts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">
              {districtData.filter((d) => d.priority === "High").length}
            </div>
            <div className="text-xs text-zinc-400">High Priority Districts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-300">
              ${formatNumber(Math.round(totalTransferBudget * 0.72))}
            </div>
            <div className="text-xs text-zinc-400">Funded (72%)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              ${formatNumber(Math.round(totalTransferBudget * 0.28))}
            </div>
            <div className="text-xs text-zinc-400">Funding Gap (28%)</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coverage Gap Donut */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">
            Beneficiary Registry Coverage
          </h3>
          <div className="h-72 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={coverageDonut}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {coverageDonut.map((entry, i) => (
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
                  formatter={(value?: number) => [
                    formatNumber(value ?? 0),
                    "Households",
                  ]}
                />
                <Legend
                  wrapperStyle={{ color: "#a1a1aa", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">
                  {overallCoverage}%
                </div>
                <div className="text-xs text-zinc-500">Coverage</div>
              </div>
            </div>
          </div>
        </div>

        {/* Eligible vs Registered by District */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">
            Coverage Gap Analysis by District
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
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
                  formatter={(value?: number) => [formatNumber(value ?? 0)]}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", color: "#a1a1aa" }}
                />
                <Bar
                  dataKey="eligible"
                  name="Eligible"
                  fill="#7c3aed"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="registered"
                  name="Registered"
                  fill="#a855f7"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Poverty Index Overlay */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="h-5 w-5 text-purple-400" />
          <h3 className="text-sm font-semibold text-zinc-300">
            Poverty Index Overlay
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={povertyBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis
                  dataKey="country"
                  tick={{ fill: "#a1a1aa", fontSize: 10 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  tick={{ fill: "#a1a1aa", fontSize: 11 }}
                  unit="%"
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: "8px",
                    color: "#e4e4e7",
                  }}
                  formatter={(value?: number) => [`${value ?? 0}%`]}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", color: "#a1a1aa" }}
                />
                <Bar
                  dataKey="povertyRate"
                  name="Poverty Rate"
                  fill="#a855f7"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="spCoverage"
                  name="SP Coverage"
                  fill="#6d28d9"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 px-3 text-zinc-400 font-medium">
                    Country
                  </th>
                  <th className="text-right py-2 px-3 text-zinc-400 font-medium">
                    Poverty %
                  </th>
                  <th className="text-right py-2 px-3 text-zinc-400 font-medium">
                    MPI %
                  </th>
                  <th className="text-right py-2 px-3 text-zinc-400 font-medium">
                    SP Coverage %
                  </th>
                </tr>
              </thead>
              <tbody>
                {povertyOverlay.map((p, i) => (
                  <tr
                    key={i}
                    className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="py-2 px-3 text-zinc-200">{p.country}</td>
                    <td className="py-2 px-3 text-right">
                      <span
                        className={
                          p.povertyRate > 60
                            ? "text-red-400 font-medium"
                            : p.povertyRate > 40
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }
                      >
                        {p.povertyRate}%
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-zinc-400">
                      {p.multidimensionalPoverty}%
                    </td>
                    <td className="py-2 px-3 text-right">
                      <span
                        className={
                          p.socialProtectionCoverage < 15
                            ? "text-red-400 font-medium"
                            : p.socialProtectionCoverage < 25
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }
                      >
                        {p.socialProtectionCoverage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Transfer Recommendations Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="flex items-center gap-3 mb-4">
          <Wallet className="h-5 w-5 text-purple-400" />
          <h3 className="text-sm font-semibold text-zinc-300">
            Transfer Recommendations by District
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  District
                </th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  Country
                </th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  Priority
                </th>
                <th className="text-right py-3 px-3 text-zinc-400 font-medium">
                  Eligible HH
                </th>
                <th className="text-right py-3 px-3 text-zinc-400 font-medium">
                  Registered
                </th>
                <th className="text-center py-3 px-3 text-zinc-400 font-medium">
                  Coverage
                </th>
                <th className="text-right py-3 px-3 text-zinc-400 font-medium">
                  Transfer/HH
                </th>
                <th className="text-right py-3 px-3 text-zinc-400 font-medium">
                  Total Cost
                </th>
                <th className="text-center py-3 px-3 text-zinc-400 font-medium">
                  Poverty Idx
                </th>
              </tr>
            </thead>
            <tbody>
              {districtData.map((d, i) => (
                <tr
                  key={i}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="py-2.5 px-3 text-zinc-200 font-medium">
                    {d.district}
                  </td>
                  <td className="py-2.5 px-3 text-zinc-400">{d.country}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1.5 ${getPriorityColor(
                        d.priority
                      )}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${getPriorityDot(
                          d.priority
                        )}`}
                      />
                      {d.priority}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-300">
                    {formatNumber(d.eligibleHouseholds)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-300">
                    {formatNumber(d.registeredHouseholds)}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-14 bg-zinc-800 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-purple-500"
                          style={{ width: `${d.coveragePct}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-400 w-8 text-right">
                        {d.coveragePct}%
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-300">
                    ${d.transferAmount}
                  </td>
                  <td className="py-2.5 px-3 text-right text-purple-400 font-medium">
                    ${formatNumber(d.totalTransferCost)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-10 h-6 rounded text-xs font-bold ${
                        d.povertyIndex >= 80
                          ? "bg-red-500/20 text-red-400"
                          : d.povertyIndex >= 60
                          ? "bg-orange-500/20 text-orange-400"
                          : d.povertyIndex >= 40
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {d.povertyIndex}
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
  suffix,
  prefix,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
  suffix?: string;
  prefix?: string;
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
        {prefix || ""}
        {formatNumber(value)}
        {suffix || ""}
      </div>
      <div className="text-xs text-zinc-500 mt-1">{sub}</div>
    </div>
  );
}
