import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/ApiService";
import toast from "react-hot-toast";
import {
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    X,
    CreditCard,
    ShoppingBag,
    ArrowLeft,
    Loader2,
    Sparkles,
    Shield,
    Truck,
    RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingItems, setUpdatingItems] = useState(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await api.get("/user/cart", { withCredentials: true });
            setCart(res.data);
        } catch (err) {
            toast.error("Failed to load cart");
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        setUpdatingItems(prev => new Set(prev).add(itemId));
        try {
            const res = await api.put(
                `/user/cart/items/${itemId}?quantity=${newQuantity}`,
                {},
                { withCredentials: true }
            );
            setCart(res.data);
            if (newQuantity === 1) {
                toast.success("Quantity updated");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update quantity");
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
        }
    };

    const removeItem = async (itemId) => {
        setUpdatingItems(prev => new Set(prev).add(itemId));
        try {
            const res = await api.delete(`/user/cart/items/${itemId}`, {
                withCredentials: true,
            });
            setCart(res.data);
            toast.success("Item removed from cart");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to remove item");
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
        }
    };

    const clearCart = async () => {
        if (!window.confirm("Are you sure you want to clear your cart?")) return;

        try {
            await api.delete("/user/cart/clear", { withCredentials: true });
            setCart({ ...cart, items: [], totalPrice: 0 });
            toast.success("Cart cleared successfully");
        } catch (err) {
            toast.error("Failed to clear cart");
        }
    };

    const checkout = () => {
        navigate("/checkout");
    };

    const continueShopping = () => {
        navigate("/products");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center space-x-2 text-gray-600">
                    <Loader2 size={24} className="animate-spin" />
                    <span>Loading your cart...</span>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md"
                >
                    <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart size={48} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
                    <motion.button
                        onClick={continueShopping}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 mx-auto"
                    >
                        <ArrowLeft size={18} />
                        <span>Continue Shopping</span>
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl">
                        <ShoppingCart size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                        <p className="text-gray-600">{cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your cart</p>
                    </div>
                </div>

                <button
                    onClick={continueShopping}
                    className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>Continue Shopping</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                        </div>

                        <div className="divide-y divide-gray-100">
                            <AnimatePresence>
                                {cart.items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="p-6"
                                    >
                                        <div className="flex items-start space-x-4">
                                            <motion.img
                                                whileHover={{ scale: 1.05 }}
                                                src={item.productImage}
                                                alt={item.productName}
                                                className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                                            />

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                                                    {item.productName}
                                                </h3>
                                                <p className="text-green-600 font-semibold text-lg mb-3">
                                                    €{item.price}
                                                </p>

                                                <div className="flex items-center space-x-4">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center space-x-2">
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            disabled={updatingItems.has(item.id) || item.quantity <= 1}
                                                            className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 transition-colors"
                                                        >
                                                            <Minus size={14} />
                                                        </motion.button>

                                                        <div className="w-12 text-center">
                                                            {updatingItems.has(item.id) ? (
                                                                <Loader2 size={16} className="animate-spin mx-auto text-gray-400" />
                                                            ) : (
                                                                <span className="font-semibold">{item.quantity}</span>
                                                            )}
                                                        </div>

                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            disabled={updatingItems.has(item.id)}
                                                            className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 transition-colors"
                                                        >
                                                            <Plus size={14} />
                                                        </motion.button>
                                                    </div>

                                                    {/* Remove Button */}
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => removeItem(item.id)}
                                                        disabled={updatingItems.has(item.id)}
                                                        className="flex items-center space-x-1 text-red-600 hover:text-red-700 disabled:opacity-50 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                        <span className="text-sm">Remove</span>
                                                    </motion.button>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-900">
                                                    €{(item.price * item.quantity).toFixed(2)}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {item.quantity} × €{item.price}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Clear Cart Button */}
                    <div className="mt-4 flex justify-end">
                        <motion.button
                            onClick={clearCart}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                        >
                            <X size={16} />
                            <span>Clear Entire Cart</span>
                        </motion.button>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">€{cart.totalPrice?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax</span>
                                <span className="font-medium">€{(cart.totalPrice * 0.21).toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-indigo-600">
                                        €{(cart.totalPrice * 1.21).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center space-x-2 text-sm text-green-600">
                                <Sparkles size={14} />
                                <span>Free shipping on orders over €50</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-blue-600">
                                <Shield size={14} />
                                <span>Secure payment processing</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-orange-600">
                                <Truck size={14} />
                                <span>Delivery in 2-3 business days</span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <motion.button
                            onClick={checkout}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                            <CreditCard size={20} />
                            <span>Proceed to Checkout</span>
                        </motion.button>

                        <p className="text-xs text-gray-500 text-center mt-3">
                            You won't be charged until the next step
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}