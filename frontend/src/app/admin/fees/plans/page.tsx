import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CreateFeePlanForm from "@/components/CreateFeePlanForm";
import Link from "next/link";

export default async function CreateFeePlanPage() {
    const user = await currentUser();
    const role = (user?.publicMetadata?.role as string)?.toLowerCase();

    if (role !== "admin") {
        redirect("/admin");
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="glass-card rounded-2xl p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Link
                            href="/admin/fees"
                            className="w-10 h-10 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] flex items-center justify-center transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-3xl font-heading font-bold text-[var(--text-primary)]">
                            Create Fee Plan
                        </h1>
                    </div>
                    <p className="text-[var(--text-muted)] ml-13">
                        Set up a new fee plan for your academy
                    </p>
                </div>

                {/* Info Box */}
                <div className="mb-6 p-4 bg-fcBlue/10 border border-fcBlue/30 rounded-lg">
                    <div className="flex gap-3">
                        <div className="text-fcBlue text-xl">ℹ️</div>
                        <div>
                            <h3 className="font-semibold text-fcBlue mb-1">About Fee Plans</h3>
                            <p className="text-sm text-[var(--text-muted)]">
                                Fee plans define the types of fees you collect from players.
                                The <strong>Monthly fee plan</strong> will be automatically used when generating fee records for all players.
                                Only one monthly plan should be active at a time.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <CreateFeePlanForm />
            </div>
        </div>
    );
}
