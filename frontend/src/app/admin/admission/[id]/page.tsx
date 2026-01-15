import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAdmissionById } from "@/lib/admission-actions";
import Link from "next/link";
import AdmissionStatusSelector from "@/components/AdmissionStatusSelector";

const AdmissionDetailPage = async ({ params }: { params: { id: string } }) => {
    const user = await currentUser();
    const role = user?.publicMetadata?.role;

    if (role !== "admin" && role !== "staff") {
        redirect("/admin");
    }

    const admission = await getAdmissionById(params.id);

    if (!admission) {
        return (
            <div className="p-4">
                <div className="glass-card rounded-2xl p-8 text-center">
                    <p className="text-[var(--text-muted)]">Admission application not found</p>
                    <Link href="/admin/admission" className="text-rmBlue hover:underline mt-4 inline-block">
                        Back to Admissions
                    </Link>
                </div>
            </div>
        );
    }

    // Format phone number for WhatsApp (remove + and spaces if any)
    const whatsappPhone = admission.phone.replace(/[^0-9]/g, "");

    return (
        <div className="p-4 space-y-4">
            <Link href="/admin/admission" className="text-fcGold hover:underline inline-flex items-center gap-2">
                ← Back to Admissions
            </Link>

            <div className="glass-card rounded-2xl p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)]">
                            Admission Details
                        </h1>
                        <p className="text-sm text-[var(--text-muted)] mt-1">
                            Application ID: {admission.id}
                        </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium self-start ${admission.status === 'PENDING' ? 'bg-fcGold/20 text-fcGold' :
                        admission.status === 'UNDER_REVIEW' ? 'bg-fcBlue/20 text-fcBlue' :
                            admission.status === 'APPROVED' ? 'bg-fcGreen/20 text-fcGreen' :
                                'bg-fcGarnet/20 text-fcGarnet'
                        }`}>
                        {admission.status}
                    </span>
                </div>

                {/* Status Update & Contact Section */}
                <div className="grid md:grid-cols-2 gap-6 mb-8 pb-6 border-b border-[var(--border-color)]">
                    <AdmissionStatusSelector admissionId={admission.id} currentStatus={admission.status as any} />

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[var(--text-muted)]">Quick Contact</label>
                        <div className="flex flex-wrap gap-2">
                            <a
                                href={`https://wa.me/${whatsappPhone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-all flex items-center gap-2"
                            >
                                💬 WhatsApp
                            </a>
                            <a
                                href={`mailto:${admission.email}`}
                                className="px-4 py-2 bg-rmBlue text-white rounded-lg text-sm font-medium hover:bg-rmBlueDark transition-all flex items-center gap-2"
                            >
                                ✉️ Email
                            </a>
                            <a
                                href={`tel:${admission.phone}`}
                                className="px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-hover)] transition-all flex items-center gap-2"
                            >
                                📞 Call
                            </a>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Player Info */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-heading font-semibold text-[var(--text-primary)] flex items-center gap-2">
                            <span className="w-1 h-5 bg-gradient-to-b from-fcGold to-fcGoldDark rounded-full" />
                            Player Information
                        </h2>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-[var(--text-muted)]">First Name</label>
                                    <p className="text-[var(--text-primary)] font-medium">{admission.firstName}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-[var(--text-muted)]">Last Name</label>
                                    <p className="text-[var(--text-primary)] font-medium">{admission.lastName}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-[var(--text-muted)]">Email</label>
                                <p className="text-[var(--text-primary)] font-medium">{admission.email}</p>
                            </div>
                            <div>
                                <label className="text-sm text-[var(--text-muted)]">Phone</label>
                                <p className="text-[var(--text-primary)] font-medium">{admission.phone}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-[var(--text-muted)]">Date of Birth</label>
                                    <p className="text-[var(--text-primary)] font-medium">
                                        {new Date(admission.dateOfBirth).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-[var(--text-muted)]">Gender</label>
                                    <p className="text-[var(--text-primary)] font-medium">{admission.sex}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-[var(--text-muted)]">Preferred Position</label>
                                <p className="text-[var(--text-primary)] font-medium">{admission.position || "Not specified"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-[var(--text-muted)]">Address</label>
                                <p className="text-[var(--text-primary)] font-medium whitespace-pre-wrap">{admission.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Parent & Additional Info */}
                    <div className="space-y-8">
                        {/* Parent Information */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-heading font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                <span className="w-1 h-5 bg-gradient-to-b from-fcBlue to-fcBlueDark rounded-full" />
                                Parent Information
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm text-[var(--text-muted)]">Parent/Guardian Name</label>
                                    <p className="text-[var(--text-primary)] font-medium">{admission.parentName}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-[var(--text-muted)]">Parent/Guardian Phone</label>
                                    <p className="text-[var(--text-primary)] font-medium">{admission.parentPhone}</p>
                                </div>
                                <div>
                                    <a
                                        href={`tel:${admission.parentPhone}`}
                                        className="text-xs text-rmBlue hover:underline flex items-center gap-1"
                                    >
                                        📞 Call Parent
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Submission Info */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-heading font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                <span className="w-1 h-5 bg-gray-300 rounded-full" />
                                Submission Details
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm text-[var(--text-muted)]">Applied On</label>
                                    <p className="text-[var(--text-primary)] font-medium">
                                        {new Date(admission.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-[var(--text-muted)]">Experience / Notes</label>
                                    <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                                        {admission.notes || "No additional notes provided."}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdmissionDetailPage;
