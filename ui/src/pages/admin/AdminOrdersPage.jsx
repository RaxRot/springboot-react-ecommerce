import { useEffect, useState } from "react";
import api from "../../api/ApiService";
import toast from "react-hot-toast";
import {
    Package,
    User,
    Calendar,
    Euro,
    ShoppingCart,
    Search,
    Filter,
    Loader2,
    Eye,
    MoreVertical,
    CheckCircle,
    Clock,
    XCircle,
    Truck,
    CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get("/admin/orders", { withCredentials: true });
            setOrders(res.data.content);
        } catch (err) {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "PAID": return <CheckCircle size={16} className="text-green-500" />;
            case "PENDING": return <Clock size={16} className="text-yellow-500" />;
            case "CANCELLED": return <XCircle size={16} className="text-red-500" />;
            case "SHIPPED": return <Truck size={16} className="text-blue-500" />;
            default: return <CreditCard size={16} className="text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "PAID": return "bg-green-100 text-green-800 border-green-200";
            case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "CANCELLED": return "bg-red-100 text-red-800 border-red-200";
            case "SHIPPED": return "bg-blue-100 text-blue-800 border-blue-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const filteredOrders = orders
        .filter(order =>
            order.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toString().includes(searchTerm) ||
            order.items.some(item =>
                item.productName.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        .filter(order =>
            filterStatus === "all" || order.status === filterStatus
        );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center space-x-2 text-gray-600">
                    <Loader2 size={24} className="animate-spin" />
                    <span>Loading orders...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl">
                        <Package size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
                        <p className="text-gray-600">Track and manage customer orders</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by order ID, user, or product..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Filter size={20} className="text-gray-400" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    >
                        <option value="all">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="PAID">Paid</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Grid */}
            <div className="grid gap-4">
                <AnimatePresence>
                    {filteredOrders.map((order) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            {/* Order Header */}
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                                            <ShoppingCart size={20} className="text-orange-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                Order #{order.id}
                                            </h3>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <User size={14} className="text-gray-400" />
                                                <span className="text-sm text-gray-600">{order.username}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            <span className="text-sm font-medium">{order.status}</span>
                                        </div>

                                        <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                            <Euro size={14} />
                                            <span className="text-sm font-semibold">
                                                {Number(order.totalAmount).toFixed(2)}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            {expandedOrder === order.id ? (
                                                <MoreVertical size={18} className="text-gray-400" />
                                            ) : (
                                                <Eye size={18} className="text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Order Details */}
                            <AnimatePresence>
                                {expandedOrder === order.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="p-6 bg-gray-50 border-t border-gray-100"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Order Items */}
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                                                <div className="space-y-2">
                                                    {order.items.map((item) => (
                                                        <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                                            <div>
                                                                <p className="font-medium text-gray-900">{item.productName}</p>
                                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-semibold text-gray-900">€{item.price}</p>
                                                                <p className="text-sm text-gray-500">Total: €{(item.price * item.quantity).toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Order Meta */}
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-3">Order Details</h4>
                                                <div className="space-y-3">
                                                    <div className="flex items-center space-x-2 text-sm">
                                                        <Calendar size={14} className="text-gray-400" />
                                                        <span className="text-gray-600">
                                                            {new Date(order.createdAt).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-sm">
                                                        <CreditCard size={14} className="text-gray-400" />
                                                        <span className="text-gray-600">Payment: {order.paymentMethod || "Credit Card"}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-sm">
                                                        <Truck size={14} className="text-gray-400" />
                                                        <span className="text-gray-600">Shipping: Standard</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 bg-white rounded-2xl border border-gray-100"
                >
                    <Package size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-500">
                        {searchTerm || filterStatus !== "all"
                            ? "Try adjusting your search or filter criteria"
                            : "There are no orders to display"
                        }
                    </p>
                </motion.div>
            )}

            {/* Stats */}
            {filteredOrders.length > 0 && (
                <div className="mt-6 text-sm text-gray-500">
                    Showing {filteredOrders.length} of {orders.length} orders
                </div>
            )}
        </div>
    );
}