import prisma from "@/lib/prisma";
import Link from "next/link";

const cardConfigs: Record<string, {
  gradient: string;
  iconBg: string;
  icon: string;
  accent: string;
  label: string;
  link: string;
  query: () => Promise<number>;
}> = {
  player: {
    gradient: "from-fcGarnet/20 to-fcGarnetDark/20",
    iconBg: "bg-fcGarnet/20",
    icon: "⚽",
    accent: "border-fcGarnet",
    label: "Players",
    link: "/list/students",
    query: async () => await prisma.student.count({ where: { isDeleted: false } })
  },
  coach: {
    gradient: "from-fcBlue/20 to-fcBlueDark/20",
    iconBg: "bg-fcBlue/20",
    icon: "🎯",
    accent: "border-fcBlue",
    label: "Coaches",
    link: "/list/teachers",
    query: async () => await prisma.coach.count({ where: { isDeleted: false } })
  },
  parent: {
    gradient: "from-fcGold/20 to-fcGoldDark/20",
    iconBg: "bg-fcGold/20",
    icon: "👥",
    accent: "border-fcGold",
    label: "Parents",
    link: "/list/parents",
    query: async () => await prisma.parent.count({ where: { isDeleted: false } })
  },
  staff: {
    gradient: "from-fcGreen/20 to-fcGreen/10",
    iconBg: "bg-fcGreen/20",
    icon: "🛡️",
    accent: "border-fcGreen",
    label: "Staff",
    link: "/list/staff",
    query: async () => await prisma.staff.count({ where: { isDeleted: false } })
  },
  admission: {
    gradient: "from-purple-500/20 to-purple-600/20",
    iconBg: "bg-purple-500/20",
    icon: "📝",
    accent: "border-purple-500",
    label: "Admissions",
    link: "/admin/admission",
    query: async () => await prisma.admission.count({ where: { isDeleted: false, status: { in: ["PENDING", "UNDER_REVIEW"] } } })
  },
  order: {
    gradient: "from-orange-500/20 to-orange-600/20",
    iconBg: "bg-orange-500/20",
    icon: "🛒",
    accent: "border-orange-500",
    label: "Orders",
    link: "/admin/orders",
    query: async () => await prisma.order.count({ where: { isDeleted: false, status: { in: ["PENDING", "PROCESSING"] } } })
  }
};

type UserType = "player" | "coach" | "parent" | "staff" | "student" | "teacher" | "admission" | "order";

const UserCard = async ({ type }: { type: UserType }) => {
  try {
    // Map student/teacher to player/coach
    const mappedType = type === "student" ? "player" : type === "teacher" ? "coach" : type;
    const config = cardConfigs[mappedType];

    if (!config) {
      return (
        <div className="glass-card rounded-2xl p-5 flex-1 min-w-[130px]">
          <div className="text-center text-fcTextMuted text-sm">Invalid card type</div>
        </div>
      );
    }

    const count = await config.query();

    return (
      <Link href={config.link}>
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

          {/* Stats */}
          <div className="space-y-1">
            <h1 className="text-3xl font-heading font-bold text-[var(--text-primary)] group-hover:text-white transition-colors duration-300">
              {count}
            </h1>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-[var(--text-muted)]">
                {config.label}
              </h2>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-1 bg-[var(--bg-surface)] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${mappedType === 'player' ? 'from-fcGarnet to-fcGarnetLight' :
                  mappedType === 'coach' ? 'from-fcBlue to-fcBlueLight' :
                    mappedType === 'parent' ? 'from-fcGold to-fcGoldLight' :
                      mappedType === 'staff' ? 'from-fcGreen to-fcGreenLight' :
                        mappedType === 'admission' ? 'from-purple-500 to-purple-600' :
                          'from-orange-500 to-orange-600'
                } group-hover:animate-pulse`}
              style={{ width: `${Math.min((count / 150) * 100, 100)}%` }}
            />
          </div>
        </div>
      </Link>
    );
  } catch (error) {
    console.error(`[UserCard] Error fetching ${type} count:`, error);

    const mappedType = type === "student" ? "player" : type === "teacher" ? "coach" : type;
    const config = cardConfigs[mappedType] || cardConfigs.player;

    return (
      <div className={`
        relative overflow-hidden rounded-2xl p-5 flex-1 min-w-[200px]
        bg-gradient-to-br ${config.gradient}
        border-l-4 ${config.accent}
        glass-card opacity-50
      `}>
        <div className="flex justify-between items-start mb-4">
          <div className={`${config.iconBg} p-3 rounded-xl`}>
            <span className="text-2xl">{config.icon}</span>
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-heading font-bold text-[var(--text-primary)]">
            --
          </h1>
          <h2 className="text-sm font-medium text-[var(--text-muted)]">
            {config.label}
          </h2>
          <p className="text-xs text-fcTextMuted mt-2">
            Unable to load data
          </p>
        </div>
      </div>
    );
  }
};

export default UserCard;
