import { useEffect, useState } from "react";
import api from "../../api/ApiService";
import toast from "react-hot-toast";
import ProductForm from "../../components/admin/ProductForm";
import {
    Plus,
    Edit2,
    Trash2,
    Search,
    Filter,
    Package,
    Loader2,
    Eye,
    Sliders,
    TrendingUp,
    Euro,
    Hash,
    Tag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [categories, setCategories] = useState([]);
    const [viewMode, setViewMode] = useState("grid"); // grid or list

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get("/public/products", { withCredentials: true });
            setProducts(res.data.content);
        } catch (err) {
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get("/public/categories", { withCredentials: true });
            setCategories(res.data.content);
        } catch (err) {
            console.error("Failed to load categories");
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/admin/products/${id}`, { withCredentials: true });
            setProducts(products.filter((p) => p.id !== id));
            toast.success("✅ Product deleted successfully");
        } catch (err) {
            toast.error("Failed to delete product");
        }
    };

    const handleSuccess = (savedProduct) => {
        if (editingProduct) {
            setProducts(products.map((p) => (p.id === savedProduct.id ? savedProduct : p)));
        } else {
            setProducts([...products, savedProduct]);
        }
        setShowForm(false);
        setEditingProduct(null);
    };

    const filteredProducts = products
        .filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.id.toString().includes(searchTerm)
        )
        .filter(product =>
            filterCategory === "all" || product.categoryName === filterCategory
        );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center space-x-2 text-gray-600">
                    <Loader2 size={24} className="animate-spin" />
                    <span>Loading products...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl">
                        <Package size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
                        <p className="text-gray-600">Create and manage your product catalog</p>
                    </div>
                </div>

                <motion.button
                    onClick={() => {
                        setEditingProduct(null);
                        setShowForm(true);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
                >
                    <Plus size={20} />
                    <span>Add Product</span>
                </motion.button>
            </div>

            {showForm ? (
                <ProductForm
                    product={editingProduct}
                    onSuccess={handleSuccess}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingProduct(null);
                    }}
                />
            ) : (
                <>
                    {/* Filters and Search */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Filter size={20} className="text-gray-400" />
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="all">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                                className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <Sliders size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {viewMode === "grid" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {filteredProducts.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="relative">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="absolute top-3 right-3 flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                                                <TrendingUp size={12} className="text-green-600" />
                                                <span className="text-xs font-medium text-green-600">#{product.id}</span>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                                {product.name}
                                            </h3>

                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-1 text-sm text-gray-600">
                                                    <Tag size={14} />
                                                    <span>{product.categoryName}</span>
                                                </div>
                                                <div className="flex items-center space-x-1 text-green-600 font-semibold">
                                                    <Euro size={14} />
                                                    <span>{product.price}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-1 text-sm text-gray-600">
                                                    <Hash size={14} />
                                                    <span>{product.quantity} in stock</span>
                                                </div>
                                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    product.quantity > 0
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}>
                                                    {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <motion.button
                                                    onClick={() => {
                                                        setEditingProduct(product);
                                                        setShowForm(true);
                                                    }}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex-1 flex items-center justify-center space-x-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                                >
                                                    <Edit2 size={14} />
                                                    <span className="text-sm">Edit</span>
                                                </motion.button>
                                                <motion.button
                                                    onClick={() => deleteProduct(product.id)}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex-1 flex items-center justify-center space-x-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                    <span className="text-sm">Delete</span>
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        /* List View */
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-[80px_1fr_120px_100px_120px_150px] gap-4 p-6 bg-gray-50 border-b border-gray-200">
                                <div className="text-sm font-semibold text-gray-700">Image</div>
                                <div className="text-sm font-semibold text-gray-700">Product</div>
                                <div className="text-sm font-semibold text-gray-700">Category</div>
                                <div className="text-sm font-semibold text-gray-700">Price</div>
                                <div className="text-sm font-semibold text-gray-700">Stock</div>
                                <div className="text-sm font-semibold text-gray-700 text-center">Actions</div>
                            </div>

                            <AnimatePresence>
                                {filteredProducts.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="grid grid-cols-1 md:grid-cols-[80px_1fr_120px_100px_120px_150px] gap-4 p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                                    >
                                        <div>
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded-lg"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium text-gray-900">{product.name}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-sm text-gray-600">{product.categoryName}</span>
                                        </div>
                                        <div className="flex items-center text-green-600 font-semibold">
                                            <Euro size={14} />
                                            <span>{product.price}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                product.quantity > 0
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}>
                                                {product.quantity} units
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-2">
                                            <motion.button
                                                onClick={() => {
                                                    setEditingProduct(product);
                                                    setShowForm(true);
                                                }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                            >
                                                <Edit2 size={14} />
                                            </motion.button>
                                            <motion.button
                                                onClick={() => deleteProduct(product.id)}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Empty State */}
                    {filteredProducts.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16 bg-white rounded-2xl border border-gray-100"
                        >
                            <Package size={48} className="text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-500">
                                {searchTerm || filterCategory !== "all"
                                    ? "Try adjusting your search or filter criteria"
                                    : "Get started by adding your first product"
                                }
                            </p>
                        </motion.div>
                    )}

                    {/* Stats */}
                    {filteredProducts.length > 0 && (
                        <div className="mt-6 text-sm text-gray-500">
                            Showing {filteredProducts.length} of {products.length} products
                        </div>
                    )}
                </>
            )}
        </div>
    );
}