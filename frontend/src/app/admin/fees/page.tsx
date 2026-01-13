import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { generateMonthlyFeeRecords, getActiveFeePlans } from "@/lib/fee-actions";
import Link from "next/link";
import DeleteFeePlanButton from "@/components/DeleteFeePlanButton";

export default async function FeeManagementPage() {
    const user = await currentUser();
    const role = (user?.publicMetadata?.role as string)?.toLowerCase();

    if (role !== "admin" && role !== "staff") {
        redirect("/admin");
    }

    const activeFeePlans = await getActiveFeePlans();
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="glass-card rounded-2xl p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-heading font-bold text-[var(--text-primary)] mb-2">
                        💰 Fee Management
                    </h1>
                    <p className="text-[var(--text-muted)]">
                        Manage fee plans and generate monthly fee records for all players
                    </p>
                </div>

                {/* Active Fee Plans */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-heading font-semibold text-[var(--text-primary)]">
                            Active Fee Plans
                        </h2>
                        <Link
                            href="/admin/fees/plans"
                            className="px-4 py-2 bg-fcGreen hover:bg-fcGreen/80 text-white rounded-lg transition-colors font-semibold text-sm flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create New Plan
                        </Link>
                    </div>
                    {activeFeePlans.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activeFeePlans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className="p-4 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-color)]"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-[var(--text-primary)]">{plan.name}</h3>
                                        {role === "admin" && (
                                            <DeleteFeePlanButton planId={plan.id} planName={plan.name} />
                                        )}
                                    </div>
                                    <p className="text-sm text-[var(--text-muted)] mt-1">{plan.description}</p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-lg font-bold text-fcGreen">
                                            PKR {plan.amount.toLocaleString()}
                                        </span>
                                        <span className="text-xs px-2 py-1 rounded bg-fcBlue/20 text-fcBlue">
                                            {plan.frequency}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-color)] text-center">
                            <p className="text-[var(--text-muted)] mb-4">No active fee plans found</p>
                            <Link
                                href="/admin/fees/plans"
                                className="inline-block px-4 py-2 bg-fcBlue hover:bg-fcBlue/80 text-white rounded-lg transition-colors"
                            >
                                Create Fee Plan
                            </Link>
                        </div>
                    )}
                </div>

                {/* Generate Fee Records */}
                <div className="p-6 bg-gradient-to-br from-fcGarnet/10 to-fcBlue/10 rounded-xl border border-[var(--border-color)]">
                    <h2 className="text-xl font-heading font-semibold text-[var(--text-primary)] mb-4">
                        Generate Monthly Fee Records
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mb-6">
                        This will create fee records for all active players for the selected month. Records that already exist will be skipped.
                    </p>

                    <form action={async (formData: FormData) => {
                        "use server";
                        const month = parseInt(formData.get("month") as string);
                        const year = parseInt(formData.get("year") as string);
                        await generateMonthlyFeeRecords(month, year);
                        redirect("/admin/fees?success=true");
                    }} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                    Month
                                </label>
                                <select
                                    name="month"
                                    defaultValue={currentMonth}
                                    className="w-full px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-fcBlue text-[var(--text-primary)]"
                                >
                                    {[
                                        "January", "February", "March", "April", "May", "June",
                                        "July", "August", "September", "October", "November", "December"
                                    ].map((month, index) => (
                                        <option key={index} value={index + 1}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                    Year
                                </label>
                                <select
                                    name="year"
                                    defaultValue={currentYear}
                                    className="w-full px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-fcBlue text-[var(--text-primary)]"
                                >
                                    {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-fcGreen hover:bg-fcGreen/80 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Generate Fee Records
                        </button>
                    </form>
                </div>

                {/* Quick Links */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Link
                        href="/admin/fees/collect"
                        className="p-4 bg-gradient-to-br from-fcGreen/20 to-fcGreen/5 hover:from-fcGreen/30 hover:to-fcGreen/10 rounded-lg border-2 border-fcGreen/30 transition-all"
                    >
                        <div className="text-2xl mb-2">✓</div>
                        <h3 className="font-semibold text-[var(--text-primary)]">Quick Collection</h3>
                        <p className="text-xs text-[var(--text-muted)] mt-1">Mark fees as paid quickly</p>
                    </Link>

                    <Link
                        href="/list/students"
                        className="p-4 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] rounded-lg border border-[var(--border-color)] transition-colors"
                    >
                        <div className="text-2xl mb-2">👥</div>
                        <h3 className="font-semibold text-[var(--text-primary)]">View Players</h3>
                        <p className="text-xs text-[var(--text-muted)] mt-1">Check individual player fees</p>
                    </Link>

                    <Link
                        href="/admin/fees/reports"
                        className="p-4 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] rounded-lg border border-[var(--border-color)] transition-colors"
                    >
                        <div className="text-2xl mb-2">📊</div>
                        <h3 className="font-semibold text-[var(--text-primary)]">Reports</h3>
                        <p className="text-xs text-[var(--text-muted)] mt-1">View collection reports</p>
                    </Link>

                    <Link
                        href="/admin/fees/plans"
                        className="p-4 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] rounded-lg border border-[var(--border-color)] transition-colors"
                    >
                        <div className="text-2xl mb-2">⚙️</div>
                        <h3 className="font-semibold text-[var(--text-primary)]">Fee Plans</h3>
                        <p className="text-xs text-[var(--text-muted)] mt-1">Manage fee plans</p>
                    </Link>
                </div>
            </div>
        </div >
    );
}
