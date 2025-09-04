import { useEffect, useState } from "react";
import api from "../../api/ApiService";
import toast from "react-hot-toast";
import {
    Users,
    Mail,
    Shield,
    Search,
    Filter,
    Loader2,
    User,
    Crown,
    Settings,
    MoreVertical,
    Eye,
    Edit2,
    Trash2,
    Calendar,
    Badge
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [selectedUser, setSelectedUser] = useState(null);
    const [viewMode, setViewMode] = useState("grid"); // grid or list

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/admin/users", { withCredentials: true });
            setUsers(res.data.content);
        } catch (err) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const getRoleIcon = (roles) => {
        if (roles?.includes("ROLE_ADMIN")) {
            return <Crown size={16} className="text-purple-600" />;
        }
        return <User size={16} className="text-blue-600" />;
    };

    const getRoleColor = (roles) => {
        if (roles?.includes("ROLE_ADMIN")) {
            return "bg-purple-100 text-purple-800 border-purple-200";
        }
        return "bg-blue-100 text-blue-800 border-blue-200";
    };

    const getRoleText = (roles) => {
        if (roles?.includes("ROLE_ADMIN")) {
            return "Administrator";
        }
        return "User";
    };

    const formatRoles = (roles) => {
        if (!roles) return "No roles";
        return roles.map(role => role.replace("ROLE_", "")).join(", ");
    };

    const filteredUsers = users
        .filter(user =>
            user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.id?.toString().includes(searchTerm)
        )
        .filter(user =>
            filterRole === "all" ||
            (filterRole === "admin" && user.roles?.includes("ROLE_ADMIN")) ||
            (filterRole === "user" && !user.roles?.includes("ROLE_ADMIN"))
        );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center space-x-2 text-gray-600">
                    <Loader2 size={24} className="animate-spin" />
                    <span>Loading users...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl">
                        <Users size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
                        <p className="text-gray-600">View and manage user accounts</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by username, email, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Filter size={20} className="text-gray-400" />
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Administrators</option>
                        <option value="user">Users</option>
                    </select>
                </div>

                <select
                    onChange={(e) => setViewMode(e.target.value)}
                    value={viewMode}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                    <option value="grid">Grid View</option>
                    <option value="list">List View</option>
                </select>
            </div>

            {/* Users Grid View */}
            {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredUsers.map((user) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                                            {getRoleIcon(user.roles)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{user.userName || "No username"}</h3>
                                            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border ${getRoleColor(user.roles)}`}>
                                                {getRoleIcon(user.roles)}
                                                <span className="text-xs font-medium">{getRoleText(user.roles)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <MoreVertical size={18} className="text-gray-400" />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Mail size={16} className="text-gray-400" />
                                        <span className="truncate">{user.email || "No email"}</span>
                                    </div>

                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Badge size={16} className="text-gray-400" />
                                        <span>ID: #{user.id}</span>
                                    </div>

                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Shield size={16} className="text-gray-400" />
                                        <span>{formatRoles(user.roles)}</span>
                                    </div>
                                </div>

                                {/* Actions Dropdown */}
                                <AnimatePresence>
                                    {selectedUser === user.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-4 pt-4 border-t border-gray-100"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex-1 flex items-center justify-center space-x-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                                >
                                                    <Eye size={14} />
                                                    <span>View</span>
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex-1 flex items-center justify-center space-x-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                                                >
                                                    <Edit2 size={14} />
                                                    <span>Edit</span>
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex-1 flex items-center justify-center space-x-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                                                >
                                                    <Trash2 size={14} />
                                                    <span>Delete</span>
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Users List View */}
            {viewMode === "list" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-[80px_1fr_1fr_120px_100px] gap-4 p-6 bg-gray-50 border-b border-gray-200">
                        <div className="text-sm font-semibold text-gray-700">Avatar</div>
                        <div className="text-sm font-semibold text-gray-700">Username</div>
                        <div className="text-sm font-semibold text-gray-700">Email</div>
                        <div className="text-sm font-semibold text-gray-700">Role</div>
                        <div className="text-sm font-semibold text-gray-700 text-center">Actions</div>
                    </div>

                    <AnimatePresence>
                        {filteredUsers.map((user) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-[80px_1fr_1fr_120px_100px] gap-4 p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                            >
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                                        {getRoleIcon(user.roles)}
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-medium text-gray-900">{user.userName || "No username"}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-600 truncate">{user.email || "No email"}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.roles)}`}>
                                        {getRoleText(user.roles)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        <Eye size={14} />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                                    >
                                        <Edit2 size={14} />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Empty State */}
            {filteredUsers.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 bg-white rounded-2xl border border-gray-100"
                >
                    <Users size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                    <p className="text-gray-500">
                        {searchTerm || filterRole !== "all"
                            ? "Try adjusting your search or filter criteria"
                            : "No users registered yet"
                        }
                    </p>
                </motion.div>
            )}

            {/* Stats */}
            {filteredUsers.length > 0 && (
                <div className="mt-6 text-sm text-gray-500">
                    Showing {filteredUsers.length} of {users.length} users
                    <span className="ml-4">
                        {users.filter(u => u.roles?.includes("ROLE_ADMIN")).length} administrators,
                        {" "}{users.filter(u => !u.roles?.includes("ROLE_ADMIN")).length} users
                    </span>
                </div>
            )}
        </div>
    );
}