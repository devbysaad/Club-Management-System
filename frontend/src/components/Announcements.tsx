import prisma from "@/lib/prisma";

const Announcements = async () => {
  // Fetch real announcements from database
  const announcements = await prisma.announcement.findMany({
    where: {
      isDeleted: false,
      OR: [
        { expiresAt: null }, // No expiry date
        { expiresAt: { gte: new Date() } }, // Not expired yet
      ],
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 3, // Show latest 3 announcements
  });

  // Priority badges
  const priorityBadge: Record<number, { bg: string; text: string; label: string }> = {
    3: { bg: "bg-fcGarnet/20", text: "text-fcGarnet", label: "HIGH" },
    2: { bg: "bg-fcGold/20", text: "text-fcGold", label: "MEDIUM" },
    1: { bg: "bg-fcBlue/20", text: "text-fcBlue", label: "LOW" },
  };

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
        <a href="/list/announcements" className="text-xs text-fcGold hover:text-fcGoldLight transition-colors font-medium">
          View All →
        </a>
      </div>

      {/* Announcements List */}
      <div className="flex flex-col gap-4">
        {announcements.length > 0 ? (
          announcements.map((announcement) => {
            const priority = priorityBadge[announcement.priority] || priorityBadge[1];

            return (
              <div
                key={announcement.id}
                className="bg-fcBlue/10 rounded-xl p-4 border-l-4 border-l-fcBlue hover:bg-opacity-20 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">📢</span>

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
                      className={`text-[10px] px-2 py-1 rounded-full font-medium uppercase tracking-wider ${priority.bg} ${priority.text}`}
                    >
                      {priority.label}
                    </span>

                    {/* Published Date */}
                    <span className="text-[10px] text-[var(--text-dim)] bg-[var(--bg-surface)] rounded px-2 py-1">
                      {new Date(announcement.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center rounded-lg border-2 border-dashed border-[var(--border-color)]">
            <span className="text-4xl mb-2 block">📢</span>
            <p className="text-[var(--text-primary)] font-semibold mb-1">
              No Announcements Yet
            </p>
            <p className="text-[var(--text-muted)] text-sm">
              Create your first announcement to share news with the club
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <a href="/list/announcements" className="flex-1 py-2 px-4 rounded-lg bg-fcGarnet/20 hover:bg-fcGarnet/30 text-fcGarnet text-sm font-medium transition-colors text-center">
            + Add News
          </a>
          <a href="/list/announcements" className="flex-1 py-2 px-4 rounded-lg bg-fcBlue/20 hover:bg-fcBlue/30 text-fcBlue text-sm font-medium transition-colors text-center">
            Manage
          </a>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
