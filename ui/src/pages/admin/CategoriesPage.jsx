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
    Search,
    Loader2,
    Tag,
    Grid,
    List
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("grid"); // grid or list

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get("/public/categories?pageNumber=0&pageSize=50");
            setCategories(res.data.content);
        } catch (err) {
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const addCategory = async () => {
        if (!newCategory.trim()) return toast.error("Category name is required");
        try {
            const res = await api.post(
                "/admin/categories",
                { name: newCategory },
                { withCredentials: true }
            );
            setCategories([...categories, res.data]);
            setNewCategory("");
            toast.success("✅ Category added successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add category");
        }
    };

    const updateCategory = async (id) => {
        if (!editingName.trim()) return toast.error("Category name is required");
        try {
            const res = await api.put(
                `/admin/categories/${id}`,
                { name: editingName },
                { withCredentials: true }
            );
            setCategories(
                categories.map((c) => (c.id === id ? { ...c, name: res.data.name } : c))
            );
            setEditingId(null);
            setEditingName("");
            toast.success("✅ Category updated successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update category");
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
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.id.toString().includes(searchTerm)
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl">
                        <FolderOpen size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                        <p className="text-gray-600">Manage your product categories</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    {/* View Toggle */}
                    <div className="flex bg-gray-100 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg transition-colors ${
                                viewMode === "grid"
                                    ? "bg-white text-purple-600 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            <Grid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg transition-colors ${
                                viewMode === "list"
                                    ? "bg-white text-purple-600 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            <List size={20} />
                        </button>
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
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                    <motion.button
                        onClick={addCategory}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!newCategory.trim()}
                        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 transition-all duration-200 min-w-[120px]"
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
            </div>

            {/* Categories Grid View */}
            {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredCategories.map((category) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                                            <Tag size={20} className="text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{category.name}</h3>
                                            <p className="text-sm text-gray-500">ID: #{category.id}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    {editingId === category.id ? (
                                        <>
                                            <motion.button
                                                onClick={() => updateCategory(category.id)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                disabled={!editingName.trim()}
                                                className="flex-1 flex items-center justify-center space-x-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                                            >
                                                <Save size={14} />
                                                <span className="text-sm">Save</span>
                                            </motion.button>
                                            <motion.button
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setEditingName("");
                                                }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex-1 flex items-center justify-center space-x-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                            >
                                                <X size={14} />
                                                <span className="text-sm">Cancel</span>
                                            </motion.button>
                                        </>
                                    ) : (
                                        <>
                                            <motion.button
                                                onClick={() => {
                                                    setEditingId(category.id);
                                                    setEditingName(category.name);
                                                }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex-1 flex items-center justify-center space-x-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                            >
                                                <Edit2 size={14} />
                                                <span className="text-sm">Edit</span>
                                            </motion.button>
                                            <motion.button
                                                onClick={() => deleteCategory(category.id)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex-1 flex items-center justify-center space-x-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                                <span className="text-sm">Delete</span>
                                            </motion.button>
                                        </>
                                    )}
                                </div>

                                {editingId === category.id && (
                                    <div className="mt-4">
                                        <input
                                            type="text"
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && updateCategory(category.id)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Categories List View */}
            {viewMode === "list" && (
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
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-[100px_1fr_200px] gap-4 p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                            >
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-600 font-mono">#{category.id}</span>
                                </div>

                                <div className="flex items-center">
                                    {editingId === category.id ? (
                                        <input
                                            type="text"
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && updateCategory(category.id)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            autoFocus
                                        />
                                    ) : (
                                        <span className="text-gray-900 font-medium">{category.name}</span>
                                    )}
                                </div>

                                <div className="flex items-center justify-center space-x-2">
                                    {editingId === category.id ? (
                                        <>
                                            <motion.button
                                                onClick={() => updateCategory(category.id)}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                disabled={!editingName.trim()}
                                                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                                            >
                                                <Save size={14} />
                                            </motion.button>
                                            <motion.button
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setEditingName("");
                                                }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                            >
                                                <X size={14} />
                                            </motion.button>
                                        </>
                                    ) : (
                                        <>
                                            <motion.button
                                                onClick={() => {
                                                    setEditingId(category.id);
                                                    setEditingName(category.name);
                                                }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                            >
                                                <Edit2 size={14} />
                                            </motion.button>
                                            <motion.button
                                                onClick={() => deleteCategory(category.id)}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </motion.button>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Empty State */}
            {filteredCategories.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 bg-white rounded-2xl border border-gray-100"
                >
                    <FolderOpen size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories found</h3>
                    <p className="text-gray-500">
                        {searchTerm
                            ? "Try adjusting your search criteria"
                            : "Get started by adding your first category"
                        }
                    </p>
                </motion.div>
            )}

            {/* Stats */}
            {filteredCategories.length > 0 && (
                <div className="mt-6 text-sm text-gray-500">
                    Showing {filteredCategories.length} of {categories.length} categories
                </div>
            )}
        </div>
    );
}