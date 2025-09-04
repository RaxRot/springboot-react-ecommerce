import { useEffect, useState } from "react";
import api from "../api/ApiService";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { User, MapPin, Edit3, Save, X, Home, Mail, Map } from "lucide-react";

export default function UserProfilePage() {
    const user = useAuthStore((state) => state.user);
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingAddress, setEditingAddress] = useState(false);
    const [form, setForm] = useState({
        street: "",
        city: "",
        zipCode: "",
        country: "",
    });

    useEffect(() => {
        fetchAddress();
    }, []);

    const fetchAddress = async () => {
        try {
            const res = await api.get("/user/address", { withCredentials: true });
            setAddress(res.data);
            setForm(res.data);
        } catch {
            // адреса может не быть — ок
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const saveAddress = async () => {
        try {
            const res = address
                ? await api.put("/user/address", form, { withCredentials: true })
                : await api.post("/user/address", form, { withCredentials: true });

            setAddress(res.data);
            setEditingAddress(false);
            toast.success("✅ Address saved successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save address");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center space-x-2 text-gray-600">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    <span>Loading profile...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3 mb-8"
            >
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl">
                    <User size={28} className="text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600">Manage your account information and address</p>
                </div>
            </motion.div>

            {/* User Info Card */}
            {user && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
                >
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl">
                            <User size={20} className="text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl flex items-center justify-center">
                                <User size={16} className="text-gray-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Username</p>
                                <p className="font-medium text-gray-900">{user.username}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl flex items-center justify-center">
                                <Mail size={16} className="text-gray-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-medium text-gray-900">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Address Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                        <MapPin size={20} className="text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
                </div>

                <AnimatePresence mode="wait">
                    {editingAddress ? (
                        <motion.div
                            key="edit-form"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Street
                                    </label>
                                    <input
                                        name="street"
                                        placeholder="Enter your street address"
                                        value={form.street}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City
                                    </label>
                                    <input
                                        name="city"
                                        placeholder="Enter your city"
                                        value={form.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Zip Code
                                    </label>
                                    <input
                                        name="zipCode"
                                        placeholder="Enter zip code"
                                        value={form.zipCode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Country
                                    </label>
                                    <input
                                        name="country"
                                        placeholder="Enter your country"
                                        value={form.country}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 pt-4">
                                <motion.button
                                    onClick={saveAddress}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
                                >
                                    <Save size={18} />
                                    <span>Save Address</span>
                                </motion.button>
                                <motion.button
                                    onClick={() => setEditingAddress(false)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-600 transition-all duration-200"
                                >
                                    <X size={18} />
                                    <span>Cancel</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    ) : address ? (
                        <motion.div
                            key="address-view"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                                <Home size={20} className="text-gray-600" />
                                <div>
                                    <p className="font-medium text-gray-900">{address.street}</p>
                                    <p className="text-sm text-gray-600">
                                        {address.city}, {address.zipCode}, {address.country}
                                    </p>
                                </div>
                            </div>

                            <motion.button
                                onClick={() => setEditingAddress(true)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-md transition-all duration-200"
                            >
                                <Edit3 size={18} />
                                <span>Edit Address</span>
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="no-address"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-8"
                        >
                            <Map size={48} className="text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No address added yet
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Add your shipping address for faster checkout
                            </p>
                            <motion.button
                                onClick={() => setEditingAddress(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium mx-auto hover:shadow-md transition-all duration-200"
                            >
                                <MapPin size={18} />
                                <span>Add Address</span>
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}