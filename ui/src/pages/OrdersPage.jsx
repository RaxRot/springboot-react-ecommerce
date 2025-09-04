import { useEffect, useState } from "react";
import api from "../api/ApiService";
import toast from "react-hot-toast";
import {
    Package,
    Calendar,
    Euro,
    ChevronDown,
    ChevronUp,
    CreditCard,
    CheckCircle,
    Clock,
    XCircle,
    Truck,
    Eye,
    Download,
    Receipt,
    Loader2,
    Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [processingPayment, setProcessingPayment] = useState(new Set());

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get("/user/orders", { withCredentials: true });
            setOrders(res.data);
        } catch (err) {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const confirmPayment = async (orderId) => {
        setProcessingPayment(prev => new Set(prev).add(orderId));
        try {
            const res = await api.post(
                `/user/orders/confirm/${orderId}`,
                {},
                { withCredentials: true }
            );
            toast.success("Payment confirmed successfully! 🎉");
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...res.data } : o));
        } catch (err) {
            toast.error(err.response?.data?.message || "Payment confirmation failed");
        } finally {
            setProcessingPayment(prev => {
                const newSet = new Set(prev);
                newSet.delete(orderId);
                return newSet;
            });
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "PAID": return <CheckCircle size={20} className="text-green-500" />;
            case "PENDING": return <Clock size={20} className="text-yellow-500" />;
            case "CANCELLED": return <XCircle size={20} className="text-red-500" />;
            case "SHIPPED": return <Truck size={20} className="text-blue-500" />;
            default: return <Package size={20} className="text-gray-500" />;
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center space-x-2 text-gray-600">
                    <Loader2 size={24} className="animate-spin" />
                    <span>Loading your orders...</span>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md"
                >
                    <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Package size={48} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
                    <p className="text-gray-600 mb-6">Your order history will appear here once you make your first purchase.</p>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.location.href = '/products'}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                    >
                        Start Shopping
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl">
                    <Package size={28} className="text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                    <p className="text-gray-600">Your order history and tracking</p>
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {orders.map((order) => {
                        const isExpanded = expandedOrder === order.id;
                        const isProcessing = processingPayment.has(order.id);

                        return (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                                {/* Order Header */}
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                                                <Receipt size={24} className="text-orange-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    Order #{order.id}
                                                </h3>
                                                <div className="flex items-center space-x-2 mt-1">
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
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <Calendar size={14} />
                                                <span>{formatDate(order.createdAt)}</span>
                                            </div>
                                            <button
                                                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                {isExpanded ? (
                                                    <ChevronUp size={20} className="text-gray-400" />
                                                ) : (
                                                    <ChevronDown size={20} className="text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Details */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="p-6 bg-gray-50 border-t border-gray-100"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Order Items */}
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                                                    <div className="space-y-3">
                                                        {order.items.map((item) => (
                                                            <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-gray-900">{item.productName}</p>
                                                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-semibold text-gray-900">€{item.price}</p>
                                                                    <p className="text-sm text-gray-500">Total: €{(item.price * item.quantity).toFixed(2)}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Order Actions */}
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-4">Order Actions</h4>
                                                    <div className="space-y-3">
                                                        {order.status === "PENDING" && (
                                                            <motion.button
                                                                onClick={() => confirmPayment(order.id)}
                                                                disabled={isProcessing}
                                                                whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                                                                whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                                                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition-all duration-200 flex items-center justify-center space-x-2"
                                                            >
                                                                {isProcessing ? (
                                                                    <Loader2 size={16} className="animate-spin" />
                                                                ) : (
                                                                    <CreditCard size={16} />
                                                                )}
                                                                <span>{isProcessing ? "Processing..." : "Confirm Payment"}</span>
                                                            </motion.button>
                                                        )}

                                                        <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                                                            <Eye size={16} />
                                                            <span>View Invoice</span>
                                                        </button>

                                                        <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                                                            <Download size={16} />
                                                            <span>Download Receipt</span>
                                                        </button>
                                                    </div>

                                                    {/* Order Summary */}
                                                    <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                                                        <h5 className="font-semibold text-gray-900 mb-3">Order Summary</h5>
                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex justify-between">
                                                                <span>Subtotal:</span>
                                                                <span>€{Number(order.totalAmount).toFixed(2)}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>Tax (21%):</span>
                                                                <span>€{(order.totalAmount * 0.21).toFixed(2)}</span>
                                                            </div>
                                                            <div className="flex justify-between font-semibold border-t pt-2">
                                                                <span>Total:</span>
                                                                <span className="text-green-600">€{(order.totalAmount * 1.21).toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Stats */}
            <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-6 bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">{orders.length}</div>
                        <div className="text-sm text-gray-600">Total Orders</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {orders.filter(o => o.status === "PAID").length}
                        </div>
                        <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                            {orders.filter(o => o.status === "PENDING").length}
                        </div>
                        <div className="text-sm text-gray-600">Pending</div>
                    </div>
                </div>
            </div>
        </div>
    );
}