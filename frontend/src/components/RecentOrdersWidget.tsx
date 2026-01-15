import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function RecentOrdersWidget() {
    const orders = await prisma.order.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
        take: 5,
    });

    const statusColors: Record<string, string> = {
        PENDING: "bg-fcGold/20 text-fcGold",
        PROCESSING: "bg-fcBlue/20 text-fcBlue",
        COMPLETED: "bg-fcGreen/20 text-fcGreen",
        CANCELLED: "bg-fcGarnet/20 text-fcGarnet",
    };

    return (
        <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-heading font-bold text-[var(--text-primary)]">
                    Recent Orders
                </h2>
                <Link
                    href="/admin/orders"
                    className="text-sm text-fcGold hover:text-fcGoldDark transition-colors"
                >
                    View All →
                </Link>
            </div>

            <div className="space-y-3">
                {orders.length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)] text-center py-4">
                        No orders yet
                    </p>
                ) : (
                    orders.map((order) => (
                        <Link
                            key={order.id}
                            href={`/admin/orders/${order.id}`}
                            className="block p-3 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-light)] border border-[var(--border-color)] transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-[var(--text-primary)]">
                                        {order.customerName}
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)]">
                                        {order.itemName} • PKR {order.totalPrice}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                    {order.status}
                                </span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
