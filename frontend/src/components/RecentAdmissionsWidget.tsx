import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function RecentAdmissionsWidget() {
    const admissions = await prisma.admission.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
        take: 5,
    });

    const statusColors: Record<string, string> = {
        PENDING: "bg-fcGold/20 text-fcGold",
        UNDER_REVIEW: "bg-fcBlue/20 text-fcBlue",
        APPROVED: "bg-fcGreen/20 text-fcGreen",
        REJECTED: "bg-fcGarnet/20 text-fcGarnet",
        CONVERTED: "bg-purple-500/20 text-purple-600",
    };

    return (
        <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-heading font-bold text-[var(--text-primary)]">
                    Recent Admissions
                </h2>
                <Link
                    href="/admin/admission"
                    className="text-sm text-fcGold hover:text-fcGoldDark transition-colors"
                >
                    View All →
                </Link>
            </div>

            <div className="space-y-3">
                {admissions.length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)] text-center py-4">
                        No admissions yet
                    </p>
                ) : (
                    admissions.map((admission) => (
                        <Link
                            key={admission.id}
                            href={`/admin/admission/${admission.id}`}
                            className="block p-3 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-light)] border border-[var(--border-color)] transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-[var(--text-primary)]">
                                        {admission.firstName} {admission.lastName}
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)]">
                                        {admission.email}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[admission.status]}`}>
                                    {admission.status}
                                </span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
