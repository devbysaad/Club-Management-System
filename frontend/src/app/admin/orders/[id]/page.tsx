import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrderById } from "@/lib/order-actions";
import Link from "next/link";
import StatusSelector from "@/components/StatusSelector";
import DeleteOrderButton from "@/components/DeleteOrderButton";

const OrderDetailPage = async ({ params }: { params: { id: string } }) => {
    const user = await currentUser();
    const role = user?.publicMetadata?.role;

    if (role !== "admin" && role !== "staff") {
        redirect("/admin");
    }

    const order = await getOrderById(params.id);

    if (!order) {
        return (
            <div className="p-4">
                <div className="glass-card rounded-2xl p-8 text-center">
                    <p className="text-[var(--text-muted)]">Order not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            <Link href="/admin/orders" className="text-fcGold hover:underline inline-flex items-center gap-2">
                ← Back to Orders
            </Link>

            <div className="glass-card rounded-2xl p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)]">
                            Order Details
                        </h1>
                        <p className="text-sm text-[var(--text-muted)] mt-1">
                            Order ID: {order.id}
                        </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium self-start ${order.status === 'PENDING' ? 'bg-fcGold/20 text-fcGold' :
                        order.status === 'PROCESSING' ? 'bg-fcBlue/20 text-fcBlue' :
                            order.status === 'COMPLETED' ? 'bg-fcGreen/20 text-fcGreen' :
                                'bg-fcGarnet/20 text-fcGarnet'
                        }`}>
                        {order.status}
                    </span>
                </div>

                {/* Status Update Section */}
                <div className="mb-8 pb-6 border-b border-[var(--border-color)]">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <StatusSelector orderId={order.id} currentStatus={order.status} />
                        </div>
                        <DeleteOrderButton orderId={order.id} customerName={order.customerName} />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Customer Info */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-heading font-semibold text-[var(--text-primary)] flex items-center gap-2">
                            <span className="w-1 h-5 bg-gradient-to-b from-fcGarnet to-fcBlue rounded-full" />
                            Customer Information
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm text-[var(--text-muted)]">Name</label>
                                <p className="text-[var(--text-primary)] font-medium">{order.customerName}</p>
                            </div>
                            <div>
                                <label className="text-sm text-[var(--text-muted)]">Contact</label>
                                <p className="text-[var(--text-primary)] font-medium">{order.contactNumber}</p>
                            </div>
                            <div>
                                <label className="text-sm text-[var(--text-muted)]">Email</label>
                                <p className="text-[var(--text-primary)] font-medium">{order.email}</p>
                            </div>
                            <div>
                                <label className="text-sm text-[var(--text-muted)]">User ID</label>
                                <p className="text-[var(--text-primary)] font-mono text-xs">{order.userId}</p>
                            </div>
                            <div>
                                <label className="text-sm text-[var(--text-muted)]">Order Date</label>
                                <p className="text-[var(--text-primary)] font-medium">
                                    {new Date(order.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm text-[var(--text-muted)]">Last Updated</label>
                                <p className="text-[var(--text-primary)] font-medium">
                                    {new Date(order.updatedAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-heading font-semibold text-[var(--text-primary)] flex items-center gap-2">
                            <span className="w-1 h-5 bg-gradient-to-b from-fcGarnet to-fcBlue rounded-full" />
                            Order Details
                        </h2>
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="text-sm text-[var(--text-muted)]">Shirt</label>
                                    <p className="text-[var(--text-primary)] font-medium">{order.shirtSize}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-[var(--text-muted)]">Shorts</label>
                                    <p className="text-[var(--text-primary)] font-medium">{order.shortsSize}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-[var(--text-muted)]">Socks</label>
                                    <p className="text-[var(--text-primary)] font-medium">{order.socksSize}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-[var(--text-muted)]">Jersey Name</label>
                                <p className="text-[var(--text-primary)] font-medium">{order.jerseyName}</p>
                            </div>
                            <div>
                                <label className="text-sm text-[var(--text-muted)]">Jersey Number</label>
                                <p className="text-[var(--text-primary)] font-medium">{order.jerseyNumber}</p>
                            </div>
                        </div>
                    </div>

                    {/* Custom Measurements */}
                    {(order.customLength || order.customWidth || order.customNotes) && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-heading font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                <span className="w-1 h-5 bg-gradient-to-b from-fcGarnet to-fcBlue rounded-full" />
                                Custom Measurements
                            </h2>
                            <div className="space-y-3">
                                {order.customLength && (
                                    <div>
                                        <label className="text-sm text-[var(--text-muted)]">Length</label>
                                        <p className="text-[var(--text-primary)] font-medium">{order.customLength} cm</p>
                                    </div>
                                )}
                                {order.customWidth && (
                                    <div>
                                        <label className="text-sm text-[var(--text-muted)]">Width/Chest</label>
                                        <p className="text-[var(--text-primary)] font-medium">{order.customWidth} cm</p>
                                    </div>
                                )}
                                {order.customNotes && (
                                    <div>
                                        <label className="text-sm text-[var(--text-muted)]">Additional Notes</label>
                                        <p className="text-[var(--text-primary)] font-medium whitespace-pre-wrap">{order.customNotes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Jersey Preview */}
                <div className="mt-8">
                    <h2 className="text-lg font-heading font-semibold text-[var(--text-primary)] mb-4">Jersey Preview</h2>
                    <div className="glass-card rounded-xl p-6 bg-gradient-to-br from-fcGarnet/ 10 to-fcBlue/10">
                        <div className="aspect-square max-w-sm mx-auto rounded-xl bg-gradient-to-br from-fcGarnet to-fcGarnetLight flex items-center justify-center">
                            <div className="text-center text-white">
                                <span className="text-8xl">👕</span>
                                <p className="text-2xl font-bold mt-4">{order.jerseyName}</p>
                                <p className="text-6xl font-bold">{order.jerseyNumber}</p>
                            </div>
                        </div>
                        <p className="text-center text-xs text-[var(--text-muted)] mt-4">
                            Custom design preview - actual jersey may vary
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
