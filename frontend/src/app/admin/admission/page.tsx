import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAllAdmissions } from "@/lib/admission-actions";
import Link from "next/link";
import DeleteAdmissionButton from "@/components/DeleteAdmissionButton";

const AdminAdmissionsPage = async () => {
    const user = await currentUser();
    const role = user?.publicMetadata?.role;

    if (role !== "admin") {
        redirect("/admin");
    }

    const admissions = await getAllAdmissions();

    return (
        <div className="p-4">
            <div className="glass-card rounded-2xl p-6">
                <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)] mb-6">
                    📝 Admissions
                </h1>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--border-color)]">
                                <th className="text-left p-3 text-sm font-semibold text-[var(--text-muted)]">Applicant</th>
                                <th className="text-left p-3 text-sm font-semibold text-[var(--text-muted)]">Parent/Guardian</th>
                                <th className="text-left p-3 text-sm font-semibold text-[var(--text-muted)]">Contact</th>
                                <th className="text-left p-3 text-sm font-semibold text-[var(--text-muted)]">Status</th>
                                <th className="text-left p-3 text-sm font-semibold text-[var(--text-muted)]">Date</th>
                                <th className="text-left p-3 text-sm font-semibold text-[var(--text-muted)]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admissions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-8 text-[var(--text-muted)]">
                                        No admissions yet
                                    </td>
                                </tr>
                            ) : (
                                admissions.map((admission: any) => (
                                    <tr
                                        key={admission.id}
                                        className="border-b border-[var(--border-color)] hover:bg-[var(--bg-surface)] transition-colors group"
                                    >
                                        <td className="p-3">
                                            <div className="flex flex-col">
                                                <span className="text-[var(--text-primary)] font-medium">{admission.firstName} {admission.lastName}</span>
                                                <span className="text-xs text-[var(--text-muted)]">{admission.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-[var(--text-primary)]">{admission.parentName}</td>
                                        <td className="p-3 text-[var(--text-muted)]">{admission.phone}</td>
                                        <td className="p-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${admission.status === 'PENDING' ? 'bg-fcGold/20 text-fcGold' :
                                                admission.status === 'REVIEWING' ? 'bg-fcBlue/20 text-fcBlue' :
                                                    admission.status === 'ACCEPTED' ? 'bg-fcGreen/20 text-fcGreen' :
                                                        'bg-fcGarnet/20 text-fcGarnet'
                                                }`}>
                                                {admission.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-[var(--text-muted)]">
                                            {new Date(admission.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/admission/${admission.id}`}
                                                    className="text-rmBlue hover:text-rmBlueDark font-semibold text-sm transition-colors"
                                                >
                                                    View Details →
                                                </Link>
                                                <DeleteAdmissionButton admissionId={admission.id} applicantName={`${admission.firstName} ${admission.lastName}`} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminAdmissionsPage;
