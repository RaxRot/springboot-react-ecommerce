import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/ApiService";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import {
    Search,
    ShoppingCart,
    Star,
    Heart,
    Filter,
    ArrowRight,
    Sparkles,
    Truck,
    Shield,
    Award,
    Loader2,
    Eye,
    Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [addingToCart, setAddingToCart] = useState(new Set());

    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async (categoryId = "all", query = "") => {
        try {
            setLoading(true);
            let url = "/public/products?pageNumber=0&pageSize=50";

            if (categoryId && categoryId !== "all") {
                url = `/public/products/category/${categoryId}?pageNumber=0&pageSize=50`;
            }
            if (query) {
                url = `/public/products/search?name=${query}&pageNumber=0&pageSize=50`;
            }

            const res = await api.get(url);
            let filteredProducts = res.data.content;

            // Сортировка
            switch (sortBy) {
                case "price-low":
                    filteredProducts.sort((a, b) => a.price - b.price);
                    break;
                case "price-high":
                    filteredProducts.sort((a, b) => b.price - a.price);
                    break;
                case "name":
                    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                default:
                    // newest first
                    filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }

            setProducts(filteredProducts);
        } catch (err) {
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get("/public/categories?pageNumber=0&pageSize=50");
            setCategories(res.data.content);
        } catch (err) {
            toast.error("Failed to load categories");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts(selectedCategory, search);
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        fetchProducts(categoryId, search);
    };

    const handleSortChange = (sortType) => {
        setSortBy(sortType);
        const sortedProducts = [...products].sort((a, b) => {
            switch (sortType) {
                case "price-low": return a.price - b.price;
                case "price-high": return b.price - a.price;
                case "name": return a.name.localeCompare(b.name);
                default: return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });
        setProducts(sortedProducts);
    };

    const addToCart = async (productId) => {
        if (!isAuthenticated) {
            toast.error("Please login to add products to cart");
            return;
        }

        setAddingToCart(prev => new Set(prev).add(productId));
        try {
            await api.post(
                "/user/cart/items",
                { productId, quantity: 1 },
                { withCredentials: true }
            );
            toast.success("Added to cart 🛒");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add to cart");
        } finally {
            setAddingToCart(prev => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center space-x-2 text-gray-600">
                    <Loader2 size={24} className="animate-spin" />
                    <span>Loading amazing products...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl mb-12 text-white"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Welcome to <span className="text-yellow-300">RaxRot</span> Shop
                </h1>
                <p className="text-xl mb-8 text-indigo-100">
                    Discover amazing products at unbeatable prices
                </p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
                >
                    <span>Start Shopping</span>
                    <ArrowRight size={20} />
                </motion.button>
            </motion.section>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
                >
                    <Truck className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
                    <p className="text-gray-600">On orders over €50</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
                >
                    <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
                    <p className="text-gray-600">256-bit encryption</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
                >
                    <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Quality Guarantee</h3>
                    <p className="text-gray-600">30-day money back</p>
                </motion.div>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <form onSubmit={handleSearch} className="relative flex-1 max-w-2xl">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                </form>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center space-x-2">
                        <Filter size={20} className="text-gray-400" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    >
                        <option value="newest">Newest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name">Name A-Z</option>
                    </select>
                </div>
            </div>

            {/* Products Grid */}
            <AnimatePresence>
                {products.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <Search size={48} className="text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
                    >
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 group"
                            >
                                <Link to={`/products/${product.id}`}>
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-white text-indigo-600 px-2 py-1 rounded-full text-xs font-semibold">
                                                {product.categoryName}
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                <div className="p-4">
                                    <Link to={`/products/${product.id}`}>
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-2xl font-bold text-indigo-600">
                                            €{product.price}
                                        </span>
                                        <div className="flex items-center space-x-1">
                                            <Star size={14} className="text-yellow-400 fill-current" />
                                            <span className="text-sm text-gray-600">4.8</span>
                                        </div>
                                    </div>

                                    <motion.button
                                        onClick={() => addToCart(product.id)}
                                        disabled={addingToCart.has(product.id)}
                                        whileHover={{ scale: addingToCart.has(product.id) ? 1 : 1.02 }}
                                        whileTap={{ scale: addingToCart.has(product.id) ? 1 : 0.98 }}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition-all duration-200 flex items-center justify-center space-x-2"
                                    >
                                        {addingToCart.has(product.id) ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <ShoppingCart size={16} />
                                        )}
                                        <span>
                                            {addingToCart.has(product.id) ? "Adding..." : "Add to Cart"}
                                        </span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Newsletter */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 text-center mb-12"
            >
                <Sparkles className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h2>
                <p className="text-gray-600 mb-6">Get the latest products and exclusive offers</p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                        Subscribe
                    </button>
                </div>
            </motion.section>
        </div>
    );
}