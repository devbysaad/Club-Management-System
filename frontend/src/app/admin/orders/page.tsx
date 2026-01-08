import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAllOrders } from "@/lib/order-actions";
import Link from "next/link";

const OrdersPage = async () => {
    const user = await currentUser();
    const role = user?.publicMetadata?.role;

    if (role !== "admin") {
        redirect("/admin");
    }

    const orders = await getAllOrders();

    return (
        <div className="p-4">
            <div className="glass-card rounded-2xl p-6">
                <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)] mb-6">
                    🛍️ Jersey Orders
                </h1>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--border-color)]">
                                <th className="text-left p-3 text-sm font-semibold text-[var(--text-muted)]">Customer</th>
                                <th className="text-left p-3 text-sm font-semibold text-[var(--text-muted)]">Contact</th>
                                <th className="text-left p-3 text-sm font-semibold text-[var(--text-muted)]">Email</th>
                                <th className="text-left p-3 text-sm font-semibold text-[var(--text-muted)]">Status</th>
                                <th className="text-left p-3 text-sm font-semibold text-[var(--text-muted)]">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center p-8 text-[var(--text-muted)]">
                                        No orders yet
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="border-b border-[var(--border-color)] hover:bg-[var(--bg-surface)] cursor-pointer transition-colors"
                                        onClick={() => window.location.href = `/admin/orders/${order.id}`}
                                    >
                                        <td className="p-3 text-[var(--text-primary)]">{order.customerName}</td>
                                        <td className="p-3 text-[var(--text-muted)]">{order.contactNumber}</td>
                                        <td className="p-3 text-[var(--text-muted)]">{order.email}</td>
                                        <td className="p-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'PENDING' ? 'bg-fcGold/20 text-fcGold' :
                                                    order.status === 'PROCESSING' ? 'bg-fcBlue/20 text-fcBlue' :
                                                        order.status === 'COMPLETED' ? 'bg-fcGreen/20 text-fcGreen' :
                                                            'bg-fcGarnet/20 text-fcGarnet'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-[var(--text-muted)]">
                                            {new Date(order.createdAt).toLocaleDateString()}
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

export default OrdersPage;
