import Image from "next/image";

const cardConfigs: Record<string, { gradient: string; iconBg: string; icon: string; accent: string }> = {
  player: {
    gradient: "from-fcGarnet/20 to-fcGarnetDark/20",
    iconBg: "bg-fcGarnet/20",
    icon: "⚽",
    accent: "border-fcGarnet"
  },
  coach: {
    gradient: "from-fcBlue/20 to-fcBlueDark/20",
    iconBg: "bg-fcBlue/20",
    icon: "🎯",
    accent: "border-fcBlue"
  },
  parent: {
    gradient: "from-fcGold/20 to-fcGoldDark/20",
    iconBg: "bg-fcGold/20",
    icon: "👥",
    accent: "border-fcGold"
  },
  staff: {
    gradient: "from-fcGreen/20 to-fcGreen/10",
    iconBg: "bg-fcGreen/20",
    icon: "🏟️",
    accent: "border-fcGreen"
  },
};

const displayNames: Record<string, string> = {
  player: "Players",
  coach: "Coaches",
  parent: "Parents",
  staff: "Staff",
  student: "Players",
  teacher: "Coaches",
};

const stats: Record<string, { count: string; change: string; trend: 'up' | 'down' }> = {
  player: { count: "128", change: "+12", trend: "up" },
  coach: { count: "24", change: "+3", trend: "up" },
  parent: { count: "89", change: "+5", trend: "up" },
  staff: { count: "45", change: "+2", trend: "up" },
  student: { count: "128", change: "+12", trend: "up" },
  teacher: { count: "24", change: "+3", trend: "up" },
};

const UserCard = ({ type }: { type: string }) => {
  const mappedType = type === "student" ? "player" : type === "teacher" ? "coach" : type;
  const config = cardConfigs[mappedType] || cardConfigs.player;
  const displayName = displayNames[type] || type;
  const stat = stats[type] || stats.player;

  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-5 flex-1 min-w-[200px]
      bg-gradient-to-br ${config.gradient}
      border-l-4 ${config.accent}
      glass-card card-animate
      group
    `}>
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className={`${config.iconBg} p-3 rounded-xl`}>
          <span className="text-2xl">{config.icon}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] px-2 py-1 rounded-full bg-[var(--bg-surface)] text-fcGold font-semibold">
            2024/25
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-1">
        <h1 className="text-3xl font-heading font-bold text-[var(--text-primary)]">
          {stat.count}
        </h1>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-[var(--text-muted)]">
            {displayName}
          </h2>
          <span className={`text-xs font-semibold flex items-center gap-1 ${stat.trend === 'up' ? 'text-fcGreen' : 'text-fcGarnet'
            }`}>
            {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-1 bg-[var(--bg-surface)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${mappedType === 'player' ? 'from-fcGarnet to-fcGarnetLight' :
            mappedType === 'coach' ? 'from-fcBlue to-fcBlueLight' :
              mappedType === 'parent' ? 'from-fcGold to-fcGoldLight' :
                'from-fcGreen to-fcGreenLight'
            }`}
          style={{ width: '75%' }}
        />
      </div>
    </div>
  );
};

export default UserCard;
