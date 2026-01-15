"use client";

import { updateAdmissionStatus, approveAdmission, rejectAdmission, getAgeGroups } from "@/lib/admission-actions";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { log } from "console";

type AdmissionStatus = "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "CONVERTED";

interface AdmissionStatusSelectorProps {
    admissionId: string;
    currentStatus: AdmissionStatus;
}

interface AgeGroup {
    id: string;
    name: string;
    minAge: number;
    maxAge: number;
}

const AdmissionStatusSelector = ({ admissionId, currentStatus }: AdmissionStatusSelectorProps) => {
    const [status, setStatus] = useState<AdmissionStatus>(currentStatus);
    const [loading, setLoading] = useState(false);
    const [showAgeGroupModal, setShowAgeGroupModal] = useState(false);
    const [selectedAgeGroup, setSelectedAgeGroup] = useState("");
    const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
    const [loadingAgeGroups, setLoadingAgeGroups] = useState(false);

    // Parent selection
    const [selectedParent, setSelectedParent] = useState("");
    const [parents, setParents] = useState<any[]>([]);

    // New fields for credentials
    const [parentEmail, setParentEmail] = useState("");
    const [parentPassword, setParentPassword] = useState("");
    const [studentUsername, setStudentUsername] = useState("");
    const [studentPassword, setStudentPassword] = useState("");

    // Player details
    const [position, setPosition] = useState("");
    const [jerseyNumber, setJerseyNumber] = useState("");

    const router = useRouter();

    // Fetch age groups and parents from database
    useEffect(() => {
        const fetchData = async () => {
            setLoadingAgeGroups(true);
            console.log("[AdmissionStatusSelector] Fetching age groups and parents...");
            const groups = await getAgeGroups();
            console.log("[AdmissionStatusSelector] Loaded", groups.length, "age groups");
            setAgeGroups(groups as AgeGroup[]);

            // Fetch parents list
            try {
                const res = await fetch('/api/parents');
                if (res.ok) {
                    const parentsList = await res.json();
                    setParents(parentsList);
                }
            } catch (error) {
                console.error("Failed to fetch parents:", error);
            }

            setLoadingAgeGroups(false);
        };

        fetchData();
    }, []);

    const handleStatusChange = async (newStatus: AdmissionStatus) => {
        if (newStatus === status) return;

        // If trying to approve, show age group modal
        if (newStatus === "APPROVED") {
            setShowAgeGroupModal(true);
            return;
        }

        // If rejecting, call reject action
        if (newStatus === "REJECTED") {
            if (!confirm("Are you sure you want to reject this admission?")) {
                return;
            }

            setLoading(true);
            const result = await rejectAdmission(admissionId);

            if (result.success) {
                setStatus("REJECTED");
                toast.success(result.message || "Admission rejected");
                router.refresh();
            } else {
                toast.error(result.message || "Failed to reject admission");
            }
            setLoading(false);
            return;
        }

        // For other status changes (PENDING, UNDER_REVIEW only)
        // CONVERTED can only be set via approveAdmission workflow
        if (newStatus === "CONVERTED") return;

        setLoading(true);
        console.log("[AdmissionStatusSelector] Updating status to:", newStatus);
        const result = await updateAdmissionStatus(admissionId, newStatus);

        if (result.success) {
            setStatus(newStatus);
            toast.success("Status updated successfully!");
            router.refresh();
        } else {
            toast.error(result.message || "Failed to update status");
        }
        setLoading(false);
    };

    const handleApprove = async () => {
        // Validate required fields
        if (!selectedParent) {
            toast.error("Please select a parent or choose to create new");
            return;
        }

        // Only validate parent email/password if creating new parent
        if (selectedParent === "new") {
            if (!parentEmail) {
                toast.error("Please enter parent email");
                return;
            }
            if (!parentPassword) {
                toast.error("Please enter parent password");
                return;
            }
        }

        if (!selectedAgeGroup) {
            toast.error("Please select an age group");
            return;
        }

        if (!studentUsername) {
            toast.error("Please enter student username");
            return;
        }
        if (!studentPassword) {
            toast.error("Please enter student password");
            return;
        }

        console.log("[AdmissionStatusSelector] Approving with:");
        console.log("  Parent:", selectedParent === "new" ? "Create New" : "Existing ID:", selectedParent);
        console.log("  Age Group:", selectedAgeGroup);
        console.log("  Position:", position);
        console.log("  Jersey:", jerseyNumber);
        console.log("  Student Username:", studentUsername);

        setLoading(true);

        const credentials = selectedParent === "new" ? {
            parent Email,
            parentPassword,
            studentUsername,
            studentPassword,
        } : {
            parentEmail: "", // Not needed for existing parent
            parentPassword: "", // Not needed for existing parent
            studentUsername,
            studentPassword,
        };

        const result = await approveAdmission(admissionId, selectedAgeGroup, credentials);

        if (result.success) {
            setStatus("CONVERTED");
            toast.success(result.message || "Admission approved! Student and parent created.");
            setShowAgeGroupModal(false);
            router.refresh();
        } else {
            toast.error(result.message || "Failed to approve admission");
        }
        setLoading(false);
    };

    const statuses: { value: AdmissionStatus; label: string; color: string }[] = [
        { value: "PENDING", label: "Pending", color: "bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30" },
        { value: "UNDER_REVIEW", label: "Under Review", color: "bg-blue-500/20 text-blue-600 hover:bg-blue-500/30" },
        { value: "APPROVED", label: "✅ Approve & Create Student", color: "bg-green-500/20 text-green-600 hover:bg-green-500/30" },
        { value: "REJECTED", label: "❌ Reject", color: "bg-red-500/20 text-red-600 hover:bg-red-500/30" },
    ];

    // Filter out CONVERTED from display if already converted
    const displayStatuses = status === "CONVERTED"
        ? [{ value: "CONVERTED" as AdmissionStatus, label: "✅ Converted to Student", color: "bg-green-600 text-white" }]
        : statuses;

    return (
        <>
            <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--text-muted)]">Update Status</label>
                <div className="flex flex-wrap gap-2">
                    {displayStatuses.map((s) => (
                        <button
                            key={s.value}
                            onClick={() => handleStatusChange(s.value)}
                            disabled={loading || status === "CONVERTED"}
                            className={`
                                px-4 py-2 rounded-lg text-sm font-medium transition-all
                                ${s.color}
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >
                            {s.label}
                            {status === s.value && " ✓"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Simplified Approval Modal */}
            {showAgeGroupModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--bg-surface)] rounded-2xl p-6 max-w-2xl w-full mx-4 border border-[var(--border-color)] max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                            ✅ Approve & Create Player
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] mb-6">
                            Pre-filled from admission. Just select parent, age group, and set credentials.
                        </p>

                        <div className="space-y-6">
                            {/* SECTION 1: PARENT SELECTION */}
                            <div className="p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)]">
                                <h4 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                                    <span className="text-lg">👨‍👩‍👧</span> Parent/Guardian
                                </h4>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                                            Select Existing Parent or Create New <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={selectedParent}
                                            onChange={(e) => {
                                                setSelectedParent(e.target.value);
                                                if (e.target.value === "new") {
                                                    setParentEmail("");
                                                    setParentPassword("");
                                                }
                                            }}
                                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)]"
                                        >
                                            <option value="">-- Choose Option --</option>
                                            <option value="new">➕ Create New Parent Account</option>
                                            {parents.map((parent) => (
                                                <option key={parent.id} value={parent.id}>
                                                    {parent.firstName} {parent.lastName} ({parent.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Show email/password fields ONLY if creating new parent */}
                                    {selectedParent === "new" && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                                                    Parent Email <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    value={parentEmail}
                                                    onChange={(e) => setParentEmail(e.target.value)}
                                                    placeholder="parent@example.com"
                                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                                                    Parent Password <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="password"
                                                    value={parentPassword}
                                                    onChange={(e) => setParentPassword(e.target.value)}
                                                    placeholder="Minimum 8 characters"
                                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)]"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* SECTION 2: PLAYER DETAILS */}
                            <div className="p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)]">
                                <h4 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                                    <span className="text-lg">⚽</span> Player Details
                                </h4>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Age Group */}
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                                            Age Group <span className="text-red-500">*</span>
                                        </label>
                                        {loadingAgeGroups ? (
                                            <div className="text-center py-3 text-[var(--text-muted)] text-sm">
                                                Loading...
                                            </div>
                                        ) : ageGroups.length === 0 ? (
                                            <div className="text-center py-3 text-red-500 text-sm">
                                                No age groups found
                                            </div>
                                        ) : (
                                            <select
                                                value={selectedAgeGroup}
                                                onChange={(e) => setSelectedAgeGroup(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)]"
                                            >
                                                <option value="">-- Select Age Group --</option>
                                                {ageGroups.map((group) => (
                                                    <option key={group.id} value={group.id}>
                                                        {group.name} (Ages {group.minAge}-{group.maxAge})
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>

                                    {/* Position */}
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                                            Position
                                        </label>
                                        <input
                                            type="text"
                                            value={position}
                                            onChange={(e) => setPosition(e.target.value)}
                                            placeholder="e.g., FWD, MID, DEF, GK"
                                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)]"
                                        />
                                    </div>

                                    {/* Jersey Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                                            Jersey Number
                                        </label>
                                        <input
                                            type="number"
                                            value={jerseyNumber}
                                            onChange={(e) => setJerseyNumber(e.target.value)}
                                            placeholder="e.g., 10"
                                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3: STUDENT CREDENTIALS */}
                            <div className="p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)]">
                                <h4 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                                    <span className="text-lg">🔐</span> Student Login Credentials
                                </h4>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                                            Username <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={studentUsername}
                                            onChange={(e) => setStudentUsername(e.target.value)}
                                            placeholder="student.name"
                                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)]"
                                        />
                                        <p className="text-xs text-[var(--text-dim)] mt-1">
                                            Email will be: {studentUsername || "username"}@patohornets.local
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={studentPassword}
                                            onChange={(e) => setStudentPassword(e.target.value)}
                                            placeholder="Minimum 8 characters"
                                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 4: AUTO-FILLED DATA PREVIEW */}
                            <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                                <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                                    <span className="text-lg">✓</span> Auto-filled from Admission
                                </h4>
                                <div className="grid md:grid-cols-2 gap-2 text-sm text-[var(--text-muted)]">
                                    <div>📝 Name: From admission record</div>
                                    <div>📧 Email: From admission record</div>
                                    <div>📞 Phone: From admission record</div>
                                    <div>🎂 DOB: From admission record</div>
                                    <div>🏠 Address: From admission record</div>
                                    <div>⚧️ Gender: From admission record</div>
                                </div>
                            </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowAgeGroupModal(false)}
                                disabled={loading}
                                className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-light)] disabled:opacity-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={loading || !selectedAgeGroup || ageGroups.length === 0}
                                className="flex-1 px-4 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 font-semibold shadow-lg"
                            >
                                {loading ? "Creating Player..." : "✅ Approve & Create Player"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdmissionStatusSelector;
