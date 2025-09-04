import { useEffect, useState } from "react";
import api from "../../api/ApiService";
import toast from "react-hot-toast";
import {
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    FolderOpen,
    Loader2,
    Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const [editing, setEditing] = useState(null);
    const [editName, setEditName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get("/public/categories", { withCredentials: true });
            setCategories(res.data.content);
        } catch (err) {
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const addCategory = async () => {
        if (!newName.trim()) return toast.error("Name is required");
        try {
            const res = await api.post(
                "/admin/categories",
                { name: newName },
                { withCredentials: true }
            );
            setCategories([...categories, res.data]);
            setNewName("");
            toast.success("✅ Category created successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create category");
        }
    };

    const updateCategory = async (id) => {
        if (!editName.trim()) return toast.error("Name is required");
        try {
            const res = await api.put(
                `/admin/categories/${id}`,
                { name: editName },
                { withCredentials: true }
            );
            setCategories(categories.map((c) => (c.id === id ? res.data : c)));
            setEditing(null);
            setEditName("");
            toast.success("✅ Category updated successfully");
        } catch (err) {
            toast.error("Failed to update category");
        }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await api.delete(`/admin/categories/${id}`, { withCredentials: true });
            setCategories(categories.filter((c) => c.id !== id));
            toast.success("✅ Category deleted successfully");
        } catch (err) {
            toast.error("Failed to delete category");
        }
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center space-x-2 text-gray-600">
                    <Loader2 size={24} className="animate-spin" />
                    <span>Loading categories...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl">
                        <FolderOpen size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Categories</h1>
                        <p className="text-gray-600">Create and organize product categories</p>
                    </div>
                </div>
            </div>

            {/* Add Category Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
            >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Category</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Enter category name..."
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                    <motion.button
                        onClick={addCategory}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!newName.trim()}
                        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 transition-all duration-200 min-w-[120px]"
                    >
                        <Plus size={18} />
                        <span>Add</span>
                    </motion.button>
                </div>
            </motion.div>

            {/* Search */}
            <div className="relative mb-6 max-w-md">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
            </div>

            {/* Categories List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr_200px] gap-4 p-6 bg-gray-50 border-b border-gray-200">
                    <div className="text-sm font-semibold text-gray-700">ID</div>
                    <div className="text-sm font-semibold text-gray-700">Name</div>
                    <div className="text-sm font-semibold text-gray-700 text-center">Actions</div>
                </div>

                <AnimatePresence>
                    {filteredCategories.map((category) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="grid grid-cols-1 md:grid-cols-[100px_1fr_200px] gap-4 p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors duration-200"
                        >
                            {/* ID */}
                            <div className="flex items-center">
                                <span className="text-sm text-gray-600 font-mono">#{category.id}</span>
                            </div>

                            {/* Name */}
                            <div className="flex items-center">
                                {editing === category.id ? (
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && updateCategory(category.id)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        autoFocus
                                    />
                                ) : (
                                    <span className="text-gray-900 font-medium">{category.name}</span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-center space-x-2">
                                {editing === category.id ? (
                                    <>
                                        <motion.button
                                            onClick={() => updateCategory(category.id)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            disabled={!editName.trim()}
                                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                                        >
                                            <Save size={16} />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => setEditing(null)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                                        >
                                            <X size={16} />
                                        </motion.button>
                                    </>
                                ) : (
                                    <>
                                        <motion.button
                                            onClick={() => {
                                                setEditing(category.id);
                                                setEditName(category.name);
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => deleteCategory(category.id)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </motion.button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredCategories.length === 0 && (
                    <div className="text-center py-12">
                        <FolderOpen size={48} className="text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No categories found</p>
                        {searchTerm && (
                            <p className="text-gray-400 text-sm mt-2">
                                Try adjusting your search term
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="mt-6 text-sm text-gray-500">
                Showing {filteredCategories.length} of {categories.length} categories
            </div>
        </div>
    );
}