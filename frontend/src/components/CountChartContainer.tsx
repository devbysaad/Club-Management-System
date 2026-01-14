import prisma from "@/lib/prisma";
import CountChart from "./CountChart";

const CountChartContainer = async () => {
    try {
        const data = await prisma.student.groupBy({
            by: ["sex"],
            _count: true,
        });

        // Process the data - count boys and girls
        const boys = data.find((item) => item.sex === "MALE")?._count || 0;
        const girls = data.find((item) => item.sex === "FEMALE")?._count || 0;
        const total = boys + girls;

        // Calculate percentages
        const boysPercentage = total > 0 ? Math.round((boys / total) * 100) : 0;
        const girlsPercentage = total > 0 ? Math.round((girls / total) * 100) : 0;

        return (
            <div className="glass-card rounded-2xl w-full h-full p-6">
                {/* TITLE */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-lg font-heading font-bold text-[var(--text-primary)]">
                            Squad Overview
                        </h1>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                            Player distribution by gender
                        </p>
                    </div>
                    <button className="p-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-light)] transition-colors">
                        <svg
                            className="w-5 h-5 text-[var(--text-muted)]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                    </button>
                </div>

                {/* CHART */}
                <CountChart boys={boys} girls={girls} />

                {/* LEGEND */}
                <div className="flex justify-center gap-8 mt-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-fcGarnet rounded-full shadow-glow-garnet" />
                            <span className="text-sm font-semibold text-[var(--text-primary)]">
                                {boys}
                            </span>
                        </div>
                        <span className="text-xs text-[var(--text-muted)]">Boys</span>
                        <span className="text-[10px] text-fcGarnet">({boysPercentage}%)</span>
                    </div>
                    <div className="w-[1px] h-12 bg-[var(--border-color)]" />
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-fcBlue rounded-full shadow-glow-blue" />
                            <span className="text-sm font-semibold text-[var(--text-primary)]">
                                {girls}
                            </span>
                        </div>
                        <span className="text-xs text-[var(--text-muted)]">Girls</span>
                        <span className="text-[10px] text-fcBlue">({girlsPercentage}%)</span>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("[CountChartContainer] Error fetching student data:", error);

        // Return fallback UI
        return (
            <div className="glass-card rounded-2xl w-full h-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-lg font-heading font-bold text-[var(--text-primary)]">
                            Squad Overview
                        </h1>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                            Unable to load data
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-center h-64">
                    <p className="text-sm text-fcTextMuted">Database connection error</p>
                </div>
            </div>
        );
    }
};

export default CountChartContainer;