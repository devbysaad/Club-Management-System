import prisma from "@/lib/prisma";

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
    icon: "🛡️",
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

type UserType = "player" | "coach" | "parent" | "staff" | "student" | "teacher";

const UserCard = async ({ type }: { type: UserType }) => {
  try {
    // Map the type to the correct Prisma model
    const modelMap: Record<UserType, any> = {
      staff: prisma.staff,
      teacher: prisma.coach, // Teacher maps to Coach in the schema
      coach: prisma.coach,
      student: prisma.student,
      player: prisma.student, // Player maps to Student in the schema
      parent: prisma.parent,
    };

    const data = await modelMap[type].count();

    const mappedType = type === "student" ? "player" : type === "teacher" ? "coach" : type;
    const config = cardConfigs[mappedType] || cardConfigs.player;
    const displayName = displayNames[type] || type;

    return (
      <div className={`
      relative overflow-hidden rounded-2xl p-5 flex-1 min-w-[200px]
      bg-gradient-to-br ${config.gradient}
      border-l-4 ${config.accent}
      glass-card card-animate
      group hover:scale-105 transition-transform duration-300
    `}>
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />

        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className={`${config.iconBg} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
            <span className="text-2xl">{config.icon}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] px-2 py-1 rounded-full bg-[var(--bg-surface)] text-fcGold font-semibold">
              2024/25
            </span>
          </div>
        </div>

        <h1 className="text-3xl font-heading font-bold text-white my-3">{count}</h1>
        <h2 className={`text-sm font-medium bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
          {config.label}
        </h2>
      </div>
      </Link >
    );
  } catch (error) {
  console.error(`Error loading ${type} card:`, error);
  return (
    <div className="glass-card rounded-2xl p-5 flex-1 min-w-[130px]">
      <div className="text-center text-fcTextMuted text-sm">
        Error loading {type} data
      </div>
    </div>
  );
}
};

export default UserCard;
