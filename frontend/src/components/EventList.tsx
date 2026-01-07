import prisma from "@/lib/prisma";

const typeStyles: Record<string, { border: string; bg: string; dot: string }> = {
    TOURNAMENT: {
        border: "border-t-fcGarnet",
        bg: "bg-fcGarnet/10",
        dot: "bg-fcGarnet",
    },
    MEETING: {
        border: "border-t-fcBlue",
        bg: "bg-fcBlue/10",
        dot: "bg-fcBlue",
    },
    CELEBRATION: {
        border: "border-t-fcGold",
        bg: "bg-fcGold/10",
        dot: "bg-fcGold",
    },
    TRIAL: {
        border: "border-t-fcGreen",
        bg: "bg-fcGreen/10",
        dot: "bg-fcGreen",
    },
    FUNDRAISER: {
        border: "border-t-purple-500",
        bg: "bg-purple-500/10",
        dot: "bg-purple-500",
    },
    OTHER: {
        border: "border-t-gray-500",
        bg: "bg-gray-500/10",
        dot: "bg-gray-500",
    },
};

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
    const date = dateParam ? new Date(dateParam) : new Date();

    const data = await prisma.event.findMany({
        where: {
            startTime: {
                gte: new Date(date.setHours(0, 0, 0, 0)),
                lte: new Date(date.setHours(23, 59, 59, 999)),
            },
        },
        orderBy: {
            startTime: "asc",
        },
    });

    return (
        <>
            {data.length > 0 ? (
                data.map((event) => {
                    const style = typeStyles[event.type] || typeStyles.OTHER;
                    return (
                        <div
                            className={`
                p-4 rounded-lg border-2 border-[var(--border-color)] 
                border-t-4 ${style.border} ${style.bg}
                hover:shadow-lg transition-all duration-300
                group
              `}
                            key={event.id}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                                    <h1 className="font-heading font-semibold text-[var(--text-primary)] group-hover:text-fcGold transition-colors">
                                        {event.title}
                                    </h1>
                                </div>
                                <span className="text-[var(--text-muted)] text-xs bg-[var(--bg-surface)] px-2 py-1 rounded">
                                    {event.startTime.toLocaleTimeString("en-UK", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    })}
                                </span>
                            </div>
                            <p className="text-[var(--text-muted)] text-sm ml-4">
                                {event.description || `${event.type} event`}
                            </p>
                            <div className="mt-2 ml-4 flex items-center gap-2">
                                <svg
                                    className="w-4 h-4 text-[var(--text-dim)]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                <span className="text-xs text-[var(--text-dim)]">
                                    {event.venue}
                                </span>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="p-8 text-center rounded-lg border-2 border-dashed border-[var(--border-color)]">
                    <span className="text-4xl mb-2 block">📅</span>
                    <p className="text-[var(--text-muted)] text-sm">
                        No events scheduled for this date
                    </p>
                </div>
            )}
        </>
    );
};

export default EventList;
