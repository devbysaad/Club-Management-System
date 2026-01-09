"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createOrder, OrderSchema } from "@/lib/order-actions";
import { toast } from "react-toastify";

const ShopPage = () => {
    const { isSignedIn, userId } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    if (!isSignedIn) {
        router.push("/sign-in");
        return null;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data: OrderSchema = {
            customerName: formData.get("customerName") as string,
            contactNumber: formData.get("contactNumber") as string,
            email: formData.get("email") as string,
            shirtSize: formData.get("shirtSize") as string,
            shortsSize: formData.get("shortsSize") as string,
            socksSize: formData.get("socksSize") as string,
            jerseyName: formData.get("jerseyName") as string,
            jerseyNumber: parseInt(formData.get("jerseyNumber") as string),
            customLength: formData.get("customLength") as string || undefined,
            customWidth: formData.get("customWidth") as string || undefined,
            customNotes: formData.get("customNotes") as string || undefined,
        };

        const result = await createOrder(data);

        if (result.success) {
            toast.success("Order placed successfully! We'll contact you soon.");
            e.currentTarget.reset();
        } else {
            toast.error("Failed to place order. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="glass-card rounded-2xl p-6 md:p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-heading font-bold text-[var(--text-primary)] mb-2">
                            🛍️ Custom Jersey Shop
                        </h1>
                        <p className="text-[var(--text-muted)]">
                            Order your personalized Pato Hornets jersey
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Info */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-heading font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                <span className="w-1 h-5 bg-gradient-to-b from-fcGarnet to-fcBlue rounded-full" />
                                Personal Information
                            </h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-[var(--text-muted)] mb-2 block">Full Name *</label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-[var(--text-muted)] mb-2 block">Contact Number *</label>
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-[var(--text-muted)] mb-2 block">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-heading font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                <span className="w-1 h-5 bg-gradient-to-b from-fcGarnet to-fcBlue rounded-full" />
                                Sizes
                            </h2>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm text-[var(--text-muted)] mb-2 block">Shirt Size *</label>
                                    <select
                                        name="shirtSize"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none"
                                    >
                                        <option value="">Select</option>
                                        <option value="XS">XS</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                        <option value="XXL">XXL</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-[var(--text-muted)] mb-2 block">Shorts Size *</label>
                                    <select
                                        name="shortsSize"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none"
                                    >
                                        <option value="">Select</option>
                                        <option value="XS">XS</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                        <option value="XXL">XXL</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-[var(--text-muted)] mb-2 block">Socks Size *</label>
                                    <select
                                        name="socksSize"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none"
                                    >
                                        <option value="">Select</option>
                                        <option value="S">Small (EU 36-40)</option>
                                        <option value="M">Medium (EU 41-44)</option>
                                        <option value="L">Large (EU 45-48)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Jersey Details */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-heading font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                <span className="w-1 h-5 bg-gradient-to-b from-fcGarnet to-fcBlue rounded-full" />
                                Jersey Customization
                            </h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-[var(--text-muted)] mb-2 block">Name on Jersey *</label>
                                    <input
                                        type="text"
                                        name="jerseyName"
                                        required
                                        maxLength={15}
                                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none"
                                        placeholder="e.g., SMITH"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-[var(--text-muted)] mb-2 block">Jersey Number *</label>
                                    <input
                                        type="number"
                                        name="jerseyNumber"
                                        required
                                        min="1"
                                        max="99"
                                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none"
                                        placeholder="e.g., 10"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Custom Measurements */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-heading font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                <span className="w-1 h-5 bg-gradient-to-b from-fcGarnet to-fcBlue rounded-full" />
                                Custom Measurements (Optional)
                            </h2>
                            <p className="text-sm text-[var(--text-muted)]">
                                Provide custom measurements for a more accurate fit
                            </p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-[var(--text-muted)] mb-2 block">Length (cm)</label>
                                    <input
                                        type="number"
                                        name="customLength"
                                        min="0"
                                        step="0.1"
                                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none"
                                        placeholder="e.g., 75"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-[var(--text-muted)] mb-2 block">Width/Chest (cm)</label>
                                    <input
                                        type="number"
                                        name="customWidth"
                                        min="0"
                                        step="0.1"
                                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none"
                                        placeholder="e.g., 50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-[var(--text-muted)] mb-2 block">Additional Notes</label>
                                <textarea
                                    name="customNotes"
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none resize-none"
                                    placeholder="Any additional measurements or fitting requirements..."
                                />
                            </div>
                        </div>

                        {/* Jersey Preview */}
                        <div className="glass-card rounded-xl p-6 bg-gradient-to-br from-fcGarnet/10 to-fcBlue/10">
                            <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-3">Jersey Preview</h3>
                            <div className="aspect-square max-w-xs mx-auto rounded-xl bg-gradient-to-br from-fcGarnet to-fcGarnetLight flex items-center justify-center">
                                <img src="patoshirt.jpeg" alt="" />
                            </div>
                            <p className="text-center text-xs text-[var(--text-muted)] mt-3">
                                Custom image preview coming soon
                            </p>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-fcGarnet to-fcGarnetLight text-white font-heading font-bold shadow-glow-garnet hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? "Placing Order..." : "Place Order"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
