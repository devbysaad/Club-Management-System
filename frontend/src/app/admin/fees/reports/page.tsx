import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function FeeReportsPage() {
    const user = await currentUser();
    const role = (user?.publicMetadata?.role as string)?.toLowerCase();

    if (role !== "admin" && role !== "staff") {
        redirect("/admin");
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Get all fee records for current year
    const allRecords = await prisma.playerFeeRecord.findMany({
        where: {
            year: currentYear,
            isDeleted: false,
        },
        include: {
            player: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
            feePlan: true,
            payments: true,
        },
        orderBy: [
            { month: "desc" },
            { player: { firstName: "asc" } },
        ],
    });

    // Calculate stats
    const totalRecords = allRecords.length;
    const paidRecords = allRecords.filter(r => r.status === "PAID").length;
    const unpaidRecords = allRecords.filter(r => r.status === "UNPAID").length;
    const partialRecords = allRecords.filter(r => r.status === "PARTIAL").length;

    const totalExpected = allRecords.reduce((sum, r) => sum + Number(r.amount), 0);
    const totalCollected = allRecords.reduce((sum, r) => sum + Number(r.paidAmount), 0);
    const totalPending = totalExpected - totalCollected;

    // Monthly breakdown
    const monthlyStats = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const monthRecords = allRecords.filter(r => r.month === month);
        const collected = monthRecords.reduce((sum, r) => sum + Number(r.paidAmount), 0);
        const expected = monthRecords.reduce((sum, r) => sum + Number(r.amount), 0);

        return {
            month,
            monthName: new Date(currentYear, i).toLocaleDateString("en-US", { month: "long" }),
            collected,
            expected,
            pending: expected - collected,
            recordCount: monthRecords.length,
            paidCount: monthRecords.filter(r => r.status === "PAID").length,
        };
    });

    // Get unpaid players list
    const unpaidPlayers = allRecords
        .filter(r => r.status === "UNPAID" || r.status === "PARTIAL")
        .slice(0, 50); // Limit to 50

    return (
        <div className="p-6">
            <div className="glass-card rounded-2xl p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-heading font-bold text-[var(--text-primary)] mb-2">
                        📊 Fee Reports & Analytics
                    </h1>
                    <p className="text-[var(--text-muted)]">
                        Comprehensive fee collection reports for {currentYear}
                    </p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="p-6 bg-gradient-to-br from-fcBlue/20 to-fcBlue/5 rounded-xl border border-fcBlue/30">
                        <p className="text-xs text-fcBlue mb-2">Total Expected</p>
                        <p className="text-3xl font-bold text-fcBlue">PKR {totalExpected.toLocaleString()}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">{totalRecords} records</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-fcGreen/20 to-fcGreen/5 rounded-xl border border-fcGreen/30">
                        <p className="text-xs text-fcGreen mb-2">Total Collected</p>
                        <p className="text-3xl font-bold text-fcGreen">PKR {totalCollected.toLocaleString()}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">{paidRecords} paid</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-fcGarnet/20 to-fcGarnet/5 rounded-xl border border-fcGarnet/30">
                        <p className="text-xs text-fcGarnet mb-2">Total Pending</p>
                        <p className="text-3xl font-bold text-fcGarnet">PKR {totalPending.toLocaleString()}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">{unpaidRecords} unpaid</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-fcGold/20 to-fcGold/5 rounded-xl border border-fcGold/30">
                        <p className="text-xs text-fcGold mb-2">Collection Rate</p>
                        <p className="text-3xl font-bold text-fcGold">
                            {totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0}%
                        </p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">{partialRecords} partial</p>
                    </div>
                </div>

                {/* Monthly Breakdown */}
                <div className="mb-8">
                    <h2 className="text-xl font-heading font-semibold text-[var(--text-primary)] mb-4">
                        Monthly Breakdown
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[var(--border-color)]">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--text-primary)]">Month</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-[var(--text-primary)]">Expected</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-[var(--text-primary)]">Collected</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-[var(--text-primary)]">Pending</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-[var(--text-primary)]">Records</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-[var(--text-primary)]">Paid</th>
                                </tr>
                            </thead>
                            <tbody>
                                {monthlyStats.map((stat) => (
                                    <tr
                                        key={stat.month}
                                        className={`border-b border-[var(--border-color)] hover:bg-[var(--bg-surface)] transition-colors ${stat.month === currentMonth ? "bg-fcBlue/5" : ""
                                            }`}
                                    >
                                        <td className="py-3 px-4 font-medium text-[var(--text-primary)]">
                                            {stat.monthName}
                                            {stat.month === currentMonth && (
                                                <span className="ml-2 text-xs px-2 py-0.5 rounded bg-fcBlue/20 text-fcBlue">
                                                    Current
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right text-[var(--text-primary)]">
                                            PKR {stat.expected.toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4 text-right font-semibold text-fcGreen">
                                            PKR {stat.collected.toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4 text-right font-semibold text-fcGarnet">
                                            PKR {stat.pending.toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4 text-center text-[var(--text-muted)]">
                                            {stat.recordCount}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className="text-fcGreen font-semibold">{stat.paidCount}</span>
                                            <span className="text-[var(--text-muted)]"> / {stat.recordCount}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-[var(--border-color)] font-bold">
                                    <td className="py-4 px-4 text-[var(--text-primary)]">Total</td>
                                    <td className="py-4 px-4 text-right text-[var(--text-primary)]">
                                        PKR {totalExpected.toLocaleString()}
                                    </td>
                                    <td className="py-4 px-4 text-right text-fcGreen">
                                        PKR {totalCollected.toLocaleString()}
                                    </td>
                                    <td className="py-4 px-4 text-right text-fcGarnet">
                                        PKR {totalPending.toLocaleString()}
                                    </td>
                                    <td className="py-4 px-4 text-center text-[var(--text-muted)]">
                                        {totalRecords}
                                    </td>
                                    <td className="py-4 px-4 text-center text-fcGreen">
                                        {paidRecords}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Unpaid Players */}
                {unpaidPlayers.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-heading font-semibold text-[var(--text-primary)] mb-4">
                            Unpaid/Partial Players (Top 50)
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[var(--border-color)]">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--text-primary)]">Player</th>
                                        <th className="text-center py-3 px-4 text-sm font-semibold text-[var(--text-primary)]">Month</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-[var(--text-primary)]">Amount</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-[var(--text-primary)]">Paid</th>
                                        <th className="text-center py-3 px-4 text-sm font-semibold text-[var(--text-primary)]">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {unpaidPlayers.map((record) => (
                                        <tr
                                            key={record.id}
                                            className="border-b border-[var(--border-color)] hover:bg-[var(--bg-surface)] transition-colors"
                                        >
                                            <td className="py-3 px-4">
                                                <p className="font-medium text-[var(--text-primary)]">
                                                    {record.player.firstName} {record.player.lastName}
                                                </p>
                                                <p className="text-xs text-[var(--text-muted)]">{record.player.email}</p>
                                            </td>
                                            <td className="py-3 px-4 text-center text-[var(--text-muted)]">
                                                {new Date(record.year, record.month - 1).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="py-3 px-4 text-right font-semibold text-[var(--text-primary)]">
                                                PKR {Number(record.amount).toLocaleString()}
                                            </td>
                                            <td className="py-3 px-4 text-right text-fcGreen">
                                                PKR {Number(record.paidAmount).toLocaleString()}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {record.status === "UNPAID" && (
                                                    <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-fcGarnet/20 text-fcGarnet">
                                                        Unpaid
                                                    </span>
                                                )}
                                                {record.status === "PARTIAL" && (
                                                    <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-fcGold/20 text-fcGold">
                                                        Partial
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-4">
                    <Link
                        href="/admin/fees/collect"
                        className="px-6 py-3 bg-fcGreen hover:bg-fcGreen/80 text-white rounded-lg font-semibold transition-colors"
                    >
                        Collect Fees
                    </Link>
                    <Link
                        href="/admin/fees"
                        className="px-6 py-3 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] rounded-lg font-semibold transition-colors border border-[var(--border-color)]"
                    >
                        Back to Fee Management
                    </Link>
                </div>
            </div>
        </div>
    );
}
