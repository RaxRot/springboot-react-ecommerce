import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/ApiService";
import toast from "react-hot-toast";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
    CreditCard,
    Lock,
    Shield,
    Truck,
    CheckCircle,
    ArrowLeft,
    Loader2,
    Sparkles,
    Calendar,
    MapPin,
    User,
    Mail,
    Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ⚡ твой publishable key
const stripePromise = loadStripe(
    "pk_test_51RywRtRqKBE2u3brjyVpVSvj4G75pCAUNOX0HSssmT1skzQpEuNywRfufd9pHxE7bBvjOlDMbD02EHZTRpdEE28j00aXGOhsVU"
);

function CheckoutForm({ clientSecret, orderId, orderDetails }) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        email: "",
        phone: "",
        address: ""
    });

    useEffect(() => {
        // Загружаем данные пользователя
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const res = await api.get("/user/profile", { withCredentials: true });
            setUserData({
                email: res.data.email || "",
                phone: res.data.phone || "",
                address: res.data.address || ""
            });
        } catch (err) {
            console.log("User data not available");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        try {
            const cardElement = elements.getElement(CardElement);

            const { paymentIntent, error } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            email: userData.email,
                            phone: userData.phone,
                            address: {
                                line1: userData.address
                            }
                        }
                    }
                }
            );

            if (error) {
                toast.error(error.message);
                setLoading(false);
                return;
            }

            if (paymentIntent.status === "succeeded") {
                await api.post(`/user/orders/confirm/${orderId}`, {}, { withCredentials: true });
                toast.success("Payment successful! 🎉");
                navigate("/orders");
            }
        } catch {
            toast.error("Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                    <CheckCircle className="text-green-500" size={24} />
                    <span>Order Summary</span>
                </h2>

                <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-semibold">#{orderId}</span>
                    </div>

                    {orderDetails && (
                        <>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Items:</span>
                                <span className="font-semibold">{orderDetails.items?.length || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-semibold">€{orderDetails.totalPrice?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Tax:</span>
                                <span className="font-semibold">€{(orderDetails.totalPrice * 0.21).toFixed(2)}</span>
                            </div>
                        </>
                    )}
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-indigo-600">
                            €{orderDetails ? (orderDetails.totalPrice * 1.21).toFixed(2) : '0.00'}
                        </span>
                    </div>
                </div>

                {/* Benefits */}
                <div className="mt-6 space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                        <Sparkles size={14} />
                        <span>Secure payment processing</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-blue-600">
                        <Shield size={14} />
                        <span>256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-orange-600">
                        <Truck size={14} />
                        <span>Free delivery</span>
                    </div>
                </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                    <CreditCard className="text-indigo-500" size={24} />
                    <span>Payment Details</span>
                </h2>

                {/* User Info */}
                <div className="mb-6 space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail size={14} />
                        <span>{userData.email || "Email not provided"}</span>
                    </div>
                    {userData.phone && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone size={14} />
                            <span>{userData.phone}</span>
                        </div>
                    )}
                    {userData.address && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin size={14} />
                            <span>{userData.address}</span>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Card Details */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Information
                        </label>
                        <div className="p-4 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
                            <CardElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#374151',
                                            '::placeholder': {
                                                color: '#9CA3AF',
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                        <Lock size={14} />
                        <span>Secure payment processed by Stripe</span>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={!stripe || loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Processing Payment...</span>
                            </>
                        ) : (
                            <>
                                <CreditCard size={20} />
                                <span>Pay €{orderDetails ? (orderDetails.totalPrice * 1.21).toFixed(2) : '0.00'}</span>
                            </>
                        )}
                    </motion.button>
                </form>

                {/* Back to Cart */}
                <button
                    onClick={() => navigate("/cart")}
                    className="w-full mt-4 flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Cart</span>
                </button>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    const [clientSecret, setClientSecret] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        initCheckout();
    }, []);

    const initCheckout = async () => {
        try {
            setLoading(true);
            const res = await api.post("/user/orders/place", {}, { withCredentials: true });
            setClientSecret(res.data.clientSecret);
            setOrderId(res.data.orderId);

            // Получаем детали заказа
            const orderRes = await api.get(`/user/orders/${res.data.orderId}`, { withCredentials: true });
            setOrderDetails(orderRes.data);

            toast.success(`Order #${res.data.orderId} ready for payment`);
        } catch (err) {
            toast.error("Failed to initialize checkout");
            navigate("/cart");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center space-x-2 text-gray-600">
                    <Loader2 size={24} className="animate-spin" />
                    <span>Preparing your checkout...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl">
                    <CreditCard size={28} className="text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                    <p className="text-gray-600">Complete your purchase securely</p>
                </div>
            </div>

            {!clientSecret ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <CreditCard size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-600">Unable to initialize payment</p>
                </div>
            ) : (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm
                        clientSecret={clientSecret}
                        orderId={orderId}
                        orderDetails={orderDetails}
                    />
                </Elements>
            )}

            {/* Security Footer */}
            <div className="mt-12 text-center">
                <div className="flex items-center justify-center space-x-4 mb-4">
                    <Shield size={20} className="text-green-500" />
                    <span className="text-sm text-gray-600">256-bit SSL Secure Payment</span>
                    <Lock size={20} className="text-green-500" />
                </div>
                <p className="text-xs text-gray-500">
                    Your payment information is encrypted and secure. We do not store your card details.
                </p>
            </div>
        </div>
    );
}