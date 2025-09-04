import { useState } from "react";
import UsersPage from "./UsersPage";
import AdminProductsPage from "./AdminProductsPage";
import CategoriesPage from "./CategoriesPage";
import OrdersPage from "./OrdersPage";
import AdminCommentsPage from "./AdminCommentsPage";
import {
    Users,
    Package,
    FolderOpen,
    FileText,
    MessageSquare,
    Settings,
    BarChart3,
    Home
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("users");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const tabs = [
        {
            id: "users",
            label: "Users",
            icon: Users,
            color: "from-blue-500 to-cyan-500"
        },
        {
            id: "products",
            label: "Products",
            icon: Package,
            color: "from-green-500 to-emerald-500"
        },
        {
            id: "categories",
            label: "Categories",
            icon: FolderOpen,
            color: "from-purple-500 to-pink-500"
        },
        {
            id: "orders",
            label: "Orders",
            icon: FileText,
            color: "from-orange-500 to-red-500"
        },
        {
            id: "comments",
            label: "Comments",
            icon: MessageSquare,
            color: "from-indigo-500 to-blue-500"
        },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "users": return <UsersPage />;
            case "products": return <AdminProductsPage />;
            case "categories": return <CategoriesPage />;
            case "orders": return <OrdersPage />;
            case "comments": return <AdminCommentsPage />;
            default: return <UsersPage />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
                            >
                                <Settings size={20} className="text-gray-600" />
                            </button>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">⚙️</span>
                                </div>
                                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                                <Home size={18} />
                                <span className="hidden sm:block">Back to Site</span>
                            </button>
                            <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">A</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <motion.div
                    initial={false}
                    animate={{
                        width: isSidebarOpen ? 280 : 0,
                        opacity: isSidebarOpen ? 1 : 0
                    }}
                    className="bg-white shadow-sm border-r border-gray-200 h-[calc(100vh-4rem)] sticky top-16 overflow-hidden lg:overflow-visible"
                >
                    <nav className="p-4 space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? `bg-gradient-to-r ${tab.color} text-white shadow-md`
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                                >
                                    <Icon size={20} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Stats Card */}
                    <div className="p-4 mt-8">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                            <div className="flex items-center space-x-2 mb-3">
                                <BarChart3 size={16} className="text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Quick Stats</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Active Users</span>
                                    <span className="font-medium">1.2K</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Orders Today</span>
                                    <span className="font-medium">42</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Revenue</span>
                                    <span className="font-medium">$8.5K</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="min-h-[calc(100vh-8rem)]"
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}