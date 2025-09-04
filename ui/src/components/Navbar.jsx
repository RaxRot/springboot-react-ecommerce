import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import api from "../api/ApiService";
import { useEffect, useState } from "react";
import {
    ShoppingCart,
    User,
    Settings,
    Package,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const [cartCount, setCartCount] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated]);

    const fetchCart = async () => {
        try {
            const res = await api.get("/user/cart", { withCredentials: true });
            setCartCount(res.data.items?.length || 0);
        } catch {
            setCartCount(0);
        }
    };

    const handleLogout = async () => {
        try {
            await api.post("/auth/signout", {}, { withCredentials: true });
            logout();
            setIsMobileMenuOpen(false);
            toast.success("Logged out successfully");
        } catch (err) {
            toast.error("Logout failed");
        }
    };

    const navItems = [
        { path: "/", label: "Home" },
        { path: "/cart", label: "Cart", icon: ShoppingCart, count: cartCount },
        ...(isAuthenticated ? [
            { path: "/orders", label: "Orders", icon: Package },
            { path: "/profile", label: user.username, icon: User },
            ...(user.roles?.includes("ROLE_ADMIN") ? [
                { path: "/admin", label: "Admin", icon: Settings }
            ] : [])
        ] : [
            { path: "/login", label: "Login" },
            { path: "/register", label: "Register" }
        ])
    ];

    return (
        <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Лого */}
                    <Link
                        to="/"
                        className="flex items-center space-x-2 group"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center"
                        >
                            <span className="text-white font-bold text-lg">🛍️</span>
                        </motion.div>
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            RaxRot Shop
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "relative flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                                    location.pathname === item.path
                                        ? "text-indigo-600 bg-indigo-50"
                                        : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                                )}
                            >
                                {item.icon && <item.icon size={18} />}
                                <span>{item.label}</span>

                                {item.count > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                    >
                                        {item.count}
                                    </motion.span>
                                )}
                            </Link>
                        ))}

                        {isAuthenticated && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleLogout}
                                className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all duration-200 ml-2"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </motion.button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                <motion.div
                    initial={false}
                    animate={{
                        height: isMobileMenuOpen ? 'auto' : 0,
                        opacity: isMobileMenuOpen ? 1 : 0
                    }}
                    className="md:hidden overflow-hidden"
                >
                    <div className="py-4 space-y-2 border-t border-gray-100">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={clsx(
                                    "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200",
                                    location.pathname === item.path
                                        ? "text-indigo-600 bg-indigo-50"
                                        : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                                )}
                            >
                                {item.icon && <item.icon size={20} />}
                                <span>{item.label}</span>

                                {item.count > 0 && (
                                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                        {item.count}
                                    </span>
                                )}
                            </Link>
                        ))}

                        {isAuthenticated && (
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all duration-200"
                            >
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </nav>
    );
}