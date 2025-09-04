import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../api/ApiService";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import {
    LogIn,
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    Sparkles,
    Shield,
    Smartphone,
    ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const schema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const res = await api.post("/auth/login", data, {
                withCredentials: true,
            });

            login(res.data);
            toast.success("🎉 Login successful! Welcome back!");
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Left Side - Illustration/Info */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-12 hidden lg:flex flex-col justify-between"
                >
                    <div>
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
                            <Sparkles size={32} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
                        <p className="text-indigo-100 text-lg">
                            Sign in to access your account and continue your shopping journey.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Shield size={20} className="text-green-300" />
                            <span className="text-indigo-100">Secure authentication</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Smartphone size={20} className="text-green-300" />
                            <span className="text-indigo-100">Mobile responsive</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Sparkles size={20} className="text-green-300" />
                            <span className="text-indigo-100">Instant access</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side - Login Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-8 lg:p-12 flex flex-col justify-center"
                >
                    <div className="text-center lg:text-left mb-8">
                        <Link to="/" className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 mb-6">
                            <ArrowRight size={16} className="rotate-180" />
                            <span>Back to Home</span>
                        </Link>

                        <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                                <LogIn size={24} className="text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
                        </div>
                        <p className="text-gray-600">Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                                <User size={16} className="text-gray-400" />
                                <span>Username</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    {...register("username")}
                                    placeholder="Enter your username"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                />
                                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                            <AnimatePresence>
                                {errors.username && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-500 text-sm mt-2 flex items-center space-x-1"
                                    >
                                        <span>⚠️</span>
                                        <span>{errors.username.message}</span>
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                                <Lock size={16} className="text-gray-400" />
                                <span>Password</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                />
                                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <AnimatePresence>
                                {errors.password && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-500 text-sm mt-2 flex items-center space-x-1"
                                    >
                                        <span>⚠️</span>
                                        <span>{errors.password.message}</span>
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Forgot Password */}
                        <div className="text-right">
                            <Link
                                to="/forgot-password"
                                className="text-indigo-600 hover:text-indigo-700 text-sm transition-colors"
                            >
                                Forgot your password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    <span>Sign In</span>
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="text-center mt-8">
                        <p className="text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                            >
                                Sign up now
                            </Link>
                        </p>
                    </div>

                    {/* Demo Credentials */}
                    <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                            <Sparkles size={16} className="text-yellow-500" />
                            <span>Demo Credentials</span>
                        </h4>
                        <p className="text-sm text-gray-600">
                            Username: <span className="font-mono">demo</span><br />
                            Password: <span className="font-mono">demo123</span>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}