import RiskOverviewCards from "@/components/dashboard/RiskOverviewCards";
import RegionalRiskMap from "@/components/dashboard/RegionalRiskMap";
import RiskTrendChart from "@/components/dashboard/RiskTrendChart";
import ActiveEventsPanel from "@/components/dashboard/ActiveEventsPanel";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import CountryRiskTable from "@/components/dashboard/CountryRiskTable";

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      {/* Row 1: KPI Cards */}
      <RiskOverviewCards />

      {/* Row 2: Map + Active Events Panel */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RegionalRiskMap />
        </div>
        <div className="lg:col-span-1">
          <ActiveEventsPanel />
        </div>
      </div>

      {/* Row 3: Risk Trend Chart */}
      <RiskTrendChart />

      {/* Row 4: Country Table + Activity Feed */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CountryRiskTable />
        </div>
        <div className="lg:col-span-1">
          <RecentActivityFeed />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-slate-600">
            SADC Disaster Risk Reduction Unit &middot; Situational Humanitarian
            Operations Centre
          </p>
          <p className="text-[10px] text-slate-700">
            Built by 7Square &middot; Open Source
          </p>
        </div>
      </footer>
    </div>
  );
}
