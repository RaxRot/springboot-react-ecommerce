import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../api/ApiService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { motion } from "framer-motion";
import { User, Mail, Lock, KeyRound, ArrowRight, Loader2 } from "lucide-react";

const schema = z
    .object({
        username: z.string().min(4, "Username must be at least 4 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export default function Register() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            const res = await api.post("/auth/register", {
                username: data.username,
                email: data.email,
                password: data.password,
            });

            toast.success("✅ Account created successfully!");
            login(res.data);
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-md"
            >
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header with Gradient */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <User size={32} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-indigo-100">Join us and start shopping</p>
                    </div>

                    {/* Form */}
                    <div className="p-6 sm:p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Username Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        {...register("username")}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your username"
                                    />
                                </div>
                                {errors.username && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        {...register("email")}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        {...register("password")}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your password"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <KeyRound size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        {...register("confirmPassword")}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Confirm your password"
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Creating account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <button
                                    onClick={() => navigate("/login")}
                                    className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
                                >
                                    Sign in here
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        By creating an account, you agree to our Terms and Privacy Policy
                    </p>
                </div>
            </motion.div>
        </div>
    );
}