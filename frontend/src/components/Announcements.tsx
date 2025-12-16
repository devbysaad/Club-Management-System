// ========== Updated Announcement Data (Schema Aligned) ==========

const announcements = [
  {
    id: "1",
    title: "Champions League Quarter-Final Draw",
    content:
      "We will face Manchester City in the quarter-finals. First leg at Camp Nou on April 9th.",
    publishedAt: "2025-03-15",
    expiresAt: "2025-03-30",
    type: "match",
    priority: "high",
    targetRoles: ["COACH", "STUDENT", "PARENT"],
  },
  {
    id: "2",
    title: "New Training Facility Opening",
    content:
      "The new Joan Gamper training facility expansion will be inaugurated next week.",
    publishedAt: "2025-03-12",
    expiresAt: "2025-03-22",
    type: "club",
    priority: "medium",
    targetRoles: ["ADMIN", "COACH"],
  },
  {
    id: "3",
    title: "Youth Academy Tryouts",
    content:
      "Open tryouts for U-16 and U-18 categories scheduled for the upcoming weekend.",
    publishedAt: "2025-03-10",
    expiresAt: "2025-03-18",
    type: "academy",
    priority: "normal",
    targetRoles: ["STUDENT", "PARENT"],
  },
];


// ========== Type Config (Unchanged) ==========

const typeConfig: Record<
  string,
  { bg: string; border: string; icon: string }
> = {
  match: {
    bg: "bg-fcGarnet/10",
    border: "border-l-fcGarnet",
    icon: "⚽",
  },
  club: {
    bg: "bg-fcBlue/10",
    border: "border-l-fcBlue",
    icon: "🏟️",
  },
  academy: {
    bg: "bg-fcGold/10",
    border: "border-l-fcGold",
    icon: "🌟",
  },
};


// ========== Priority Badges (Unchanged) ==========

const priorityBadge: Record<string, string> = {
  high: "bg-fcGarnet/20 text-fcGarnet",
  medium: "bg-fcGold/20 text-fcGold",
  normal: "bg-fcBlue/20 text-fcBlue",
};


// ========== Updated Component ==========

const Announcements = () => {
  return (
    <div className="glass-card rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-fcGarnet/20 flex items-center justify-center">
            <span className="text-xl">📢</span>
          </div>
          <div>
            <h1 className="text-lg font-heading font-bold text-[var(--text-primary)]">
              Club News
            </h1>
            <p className="text-xs text-[var(--text-muted)]">Latest announcements</p>
          </div>
        </div>
        <button className="text-xs text-fcGold hover:text-fcGoldLight transition-colors font-medium">
          View All →
        </button>
      </div>

      {/* Announcements List */}
      <div className="flex flex-col gap-4">
        {announcements.map((announcement) => {
          const config = typeConfig[announcement.type] || typeConfig.club;

          return (
            <div
              key={announcement.id}
              className={`
                ${config.bg} rounded-xl p-4 
                border-l-4 ${config.border}
                hover:bg-opacity-20 transition-all duration-300
                cursor-pointer group
              `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">{config.icon}</span>

                  <div className="flex-1">
                    <h2 className="font-heading font-semibold text-[var(--text-primary)] group-hover:text-fcGold transition-colors">
                      {announcement.title}
                    </h2>

                    <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">
                      {announcement.content}
                    </p>

                    {/* Target Roles */}
                    <p className="text-[10px] text-fcGold mt-2 font-medium">
                      {announcement.targetRoles.join(" • ")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  {/* Priority */}
                  <span
                    className={`text-[10px] px-2 py-1 rounded-full font-medium uppercase tracking-wider ${
                      priorityBadge[announcement.priority]
                    }`}
                  >
                    {announcement.priority}
                  </span>

                  {/* Published Date */}
                  <span className="text-[10px] text-[var(--text-dim)] bg-[var(--bg-surface)] rounded px-2 py-1">
                    {announcement.publishedAt}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <button className="flex-1 py-2 px-4 rounded-lg bg-fcGarnet/20 hover:bg-fcGarnet/30 text-fcGarnet text-sm font-medium transition-colors">
            + Add News
          </button>
          <button className="flex-1 py-2 px-4 rounded-lg bg-fcBlue/20 hover:bg-fcBlue/30 text-fcBlue text-sm font-medium transition-colors">
            Manage
          </button>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
