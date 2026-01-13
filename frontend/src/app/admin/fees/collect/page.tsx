import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import FeeCollectionButtons from "@/components/FeeCollectionButtons";
import MonthYearSelector from "@/components/MonthYearSelector";
import DeleteFeeRecordButton from "@/components/DeleteFeeRecordButton";

export default async function FeeCollectionPage({
    searchParams,
}: {
    searchParams: { month?: string; year?: string };
}) {
    const user = await currentUser();
    const role = (user?.publicMetadata?.role as string)?.toLowerCase();

    if (role !== "admin" && role !== "staff") {
        redirect("/admin");
    }

    const currentDate = new Date();
    const selectedMonth = searchParams.month ? parseInt(searchParams.month) : currentDate.getMonth() + 1;
    const selectedYear = searchParams.year ? parseInt(searchParams.year) : currentDate.getFullYear();

    // Fetch all active players with their fee records for the selected month
    const players = await prisma.student.findMany({
        where: { isDeleted: false },
        include: {
            ageGroup: {
                select: { name: true },
            },
            feeRecords: {
                where: {
                    month: selectedMonth,
                    year: selectedYear,
                    isDeleted: false,
                },
                include: {
                    feePlan: true,
                },
            },
        },
        orderBy: {
            firstName: "asc",
        },
    });

    // Fetch active fee plans
    const feePlans = await prisma.feePlan.findMany({
        where: { isActive: true },
        select: {
            id: true,
            name: true,
            amount: true,
        },
        orderBy: { createdAt: "desc" },
    });

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Calculate stats
    const totalPlayers = players.length;
    const paidPlayers = players.filter(p => p.feeRecords[0]?.status === "PAID").length;
    const unpaidPlayers = totalPlayers - paidPlayers;
    const totalCollected = players.reduce((sum, p) => sum + (p.feeRecords[0]?.paidAmount || 0), 0);

    return (
        <div className="p-6">
            <div className="glass-card rounded-2xl p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-[var(--text-primary)] mb-2">
                            💰 Fee Collection
                        </h1>
                        <p className="text-[var(--text-muted)]">
                            Quick fee collection for {monthNames[selectedMonth - 1]} {selectedYear}
                        </p>
                    </div>

                    <Link
                        href="/admin/fees"
                        className="px-4 py-2 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] rounded-lg transition-colors font-medium"
                    >
                        Back to Fee Management
                    </Link>
                </div>

                {/* Month/Year Selector */}
                <div className="mb-6">
                    <MonthYearSelector selectedMonth={selectedMonth} selectedYear={selectedYear} />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-color)]">
                        <p className="text-xs text-[var(--text-muted)]">Total Players</p>
                        <p className="text-2xl font-bold text-[var(--text-primary)]">{totalPlayers}</p>
                    </div>
                    <div className="p-4 bg-fcGreen/10 rounded-lg border border-fcGreen/30">
                        <p className="text-xs text-fcGreen">Paid</p>
                        <p className="text-2xl font-bold text-fcGreen">{paidPlayers}</p>
                    </div>
                    <div className="p-4 bg-fcGarnet/10 rounded-lg border border-fcGarnet/30">
                        <p className="text-xs text-fcGarnet">Unpaid</p>
                        <p className="text-2xl font-bold text-fcGarnet">{unpaidPlayers}</p>
                    </div>
                    <div className="p-4 bg-fcBlue/10 rounded-lg border border-fcBlue/30">
                        <p className="text-xs text-fcBlue">Collected</p>
                        <p className="text-2xl font-bold text-fcBlue">PKR {totalCollected.toLocaleString()}</p>
                    </div>
                </div>

                {/* No Records Warning */}
                {players.length > 0 && players.every(p => !p.feeRecords[0]) && (
                    <div className="mb-6 p-4 bg-fcGold/10 border border-fcGold/30 rounded-xl flex items-start gap-3">
                        <div className="text-2xl">⚠️</div>
                        <div>
                            <h3 className="font-semibold text-fcGold mb-1">No Fee Records Found</h3>
                            <p className="text-sm text-[var(--text-muted)]">
                                No fee records have been generated for {monthNames[selectedMonth - 1]} {selectedYear}.
                                Go to <Link href="/admin/fees" className="text-fcBlue hover:underline">Fee Management</Link> and click
                                "Generate Fee Records" to create records for all players.
                            </p>
                        </div>
                    </div>
                )}

                {/* Players Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--border-color)]">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--text-primary)]">Player</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--text-primary)]">Age Group</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-[var(--text-primary)]">Fee Amount</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-[var(--text-primary)]">Status</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-[var(--text-primary)]">Action</th>
                                {user?.publicMetadata?.role === "admin" && (
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-[var(--text-primary)]">Delete</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((player) => {
                                const feeRecord = player.feeRecords[0];
                                const feeAmount = feeRecord?.amount || 0;
                                const status = feeRecord?.status || "NO_RECORD";

                                return (
                                    <tr
                                        key={player.id}
                                        className="border-b border-[var(--border-color)] hover:bg-[var(--bg-surface)] transition-colors"
                                    >
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={player.photo || "/noAvatar.png"}
                                                    alt=""
                                                    width={32}
                                                    height={32}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-medium text-[var(--text-primary)]">
                                                        {player.firstName} {player.lastName}
                                                    </p>
                                                    <p className="text-xs text-[var(--text-muted)]">{player.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-[var(--text-muted)]">
                                            {player.ageGroup.name}
                                        </td>
                                        <td className="py-3 px-4 text-center font-semibold text-[var(--text-primary)]">
                                            {feeAmount > 0 ? `PKR ${feeAmount.toLocaleString()}` : "—"}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {status === "PAID" && (
                                                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-fcGreen/20 text-fcGreen">
                                                    ✓ Paid
                                                </span>
                                            )}
                                            {status === "PARTIAL" && (
                                                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-fcGold/20 text-fcGold">
                                                    Partial
                                                </span>
                                            )}
                                            {status === "UNPAID" && (
                                                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-fcGarnet/20 text-fcGarnet">
                                                    × Unpaid
                                                </span>
                                            )}
                                            {status === "NO_RECORD" && (
                                                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-500/20 text-gray-400">
                                                    No Record
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex justify-center">
                                                <FeeCollectionButtons
                                                    feeRecordId={feeRecord?.id || null}
                                                    playerId={player.id}
                                                    playerName={`${player.firstName} ${player.lastName}`}
                                                    currentStatus={status}
                                                    feeAmount={feeAmount}
                                                    month={selectedMonth}
                                                    year={selectedYear}
                                                    feePlans={feePlans}
                                                />
                                            </div>
                                        </td>
                                        {user?.publicMetadata?.role === "admin" && (
                                            <td className="py-3 px-4">
                                                <div className="flex justify-center">
                                                    {feeRecord ? (
                                                        <DeleteFeeRecordButton
                                                            feeRecordId={feeRecord.id}
                                                            playerName={`${player.firstName} ${player.lastName}`}
                                                            month={selectedMonth}
                                                            year={selectedYear}
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-[var(--text-muted)]">—</span>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {players.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-[var(--text-muted)]">No players found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
