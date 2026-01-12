import Announcements from "@/components/Announcements";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";

const AdminPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        {/* Welcome Banner */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-fcGarnet/20 to-fcBlue/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👋</span>
              <span className="text-xs px-2 py-1 rounded-full bg-fcGold/20 text-fcGold font-medium">
                Club Director
              </span>
            </div>
            <h1 className="text-2xl font-heading font-bold text-white mb-1">
              Welcome back, <span className="gradient-text">Carlos!</span>
            </h1>
            <p className="text-sm text-fcTextMuted">
              Here&apos;s what&apos;s happening with your club today.
            </p>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="player" />
          <UserCard type="coach" />
          <UserCard type="parent" />
          <UserCard type="staff" />
        </div>

        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChartContainer />
          </div>
        </div>

        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <EventCalendarContainer searchParams={{}} />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
