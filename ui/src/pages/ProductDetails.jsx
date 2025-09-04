import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/ApiService";
import toast from "react-hot-toast";
import {
    Star,
    ShoppingCart,
    Heart,
    Share2,
    ArrowLeft,
    MessageCircle,
    User,
    Calendar,
    Plus,
    Minus,
    Check,
    Truck,
    Shield,
    RotateCcw,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState("");
    const [rating, setRating] = useState(5);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        fetchProduct();
        fetchComments();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await api.get(`/public/products/${id}`);
            setProduct(res.data);
        } catch (err) {
            toast.error("Failed to load product");
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await api.get(
                `/user/comments/product/${id}?pageNumber=0&pageSize=20`,
                { withCredentials: true }
            );
            setComments(res.data.content);
        } catch {
            setComments([]);
        }
    };

    const addToCart = async () => {
        setAddingToCart(true);
        try {
            await api.post(
                "/user/cart/items",
                { productId: Number(id), quantity },
                { withCredentials: true }
            );
            toast.success("🎉 Added to cart!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add to cart");
        } finally {
            setAddingToCart(false);
        }
    };

    const submitComment = async (e) => {
        e.preventDefault();
        if (!text.trim()) return toast.error("Comment cannot be empty");

        setSubmittingComment(true);
        try {
            const res = await api.post(
                "/user/comments",
                { text, rating, productId: Number(id) },
                { withCredentials: true }
            );
            setComments([res.data, ...comments]);
            setText("");
            setRating(5);
            toast.success("⭐ Review added successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add review");
        } finally {
            setSubmittingComment(false);
        }
    };

    const renderStars = (rating, size = 16) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={size}
                className={i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
            />
        ));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center space-x-2 text-gray-600">
                    <Loader2 size={24} className="animate-spin" />
                    <span>Loading product details...</span>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <User size={48} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
                    <Link to="/products" className="text-indigo-600 hover:text-indigo-700">
                        ← Back to products
                    </Link>
                </div>
            </div>
        );
    }

    // Mock additional images for gallery
    const productImages = [
        product.imageUrl,
        product.imageUrl, // Duplicate for demo
        product.imageUrl  // Duplicate for demo
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Navigation */}
            <div className="flex items-center space-x-2 mb-6">
                <Link
                    to="/products"
                    className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Products</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Images */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="aspect-square overflow-hidden rounded-3xl border border-gray-200"
                    >
                        <img
                            src={productImages[activeImage]}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                    </motion.div>

                    {/* Image Thumbnails */}
                    <div className="flex space-x-3">
                        {productImages.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveImage(index)}
                                className={`w-20 h-20 rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                                    activeImage === index
                                        ? "border-indigo-600 ring-2 ring-indigo-200"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <img
                                    src={img}
                                    alt={`${product.name} ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {product.name}
                                </h1>
                                <div className="flex items-center space-x-2 mb-3">
                                    <div className="flex items-center space-x-1">
                                        {renderStars(product.averageRating || 0)}
                                    </div>
                                    <span className="text-gray-600">
                                        ({product.reviewCount || 0} reviews)
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                    <Heart size={20} className="text-gray-600" />
                                </button>
                                <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                    <Share2 size={20} className="text-gray-600" />
                                </button>
                            </div>
                        </div>

                        <p className="text-3xl font-bold text-indigo-600 mb-6">
                            €{product.price}
                        </p>

                        <p className="text-gray-700 text-lg leading-relaxed mb-6">
                            {product.description}
                        </p>

                        <div className="flex items-center space-x-2 text-gray-600 mb-6">
                            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                                {product.categoryName}
                            </span>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                In Stock
                            </span>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center space-x-4 mb-6">
                            <span className="font-semibold text-gray-700">Quantity:</span>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="w-12 text-center font-semibold">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <motion.button
                            onClick={addToCart}
                            disabled={addingToCart}
                            whileHover={{ scale: addingToCart ? 1 : 1.02 }}
                            whileTap={{ scale: addingToCart ? 1 : 0.98 }}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50 transition-all duration-200 flex items-center justify-center space-x-2 mb-4"
                        >
                            {addingToCart ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <ShoppingCart size={20} />
                            )}
                            <span>
                                {addingToCart ? "Adding to Cart..." : `Add to Cart - €${(product.price * quantity).toFixed(2)}`}
                            </span>
                        </motion.button>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="text-center">
                                <Truck size={24} className="text-green-600 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">Free shipping</p>
                            </div>
                            <div className="text-center">
                                <RotateCcw size={24} className="text-blue-600 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">30-day returns</p>
                            </div>
                            <div className="text-center">
                                <Shield size={24} className="text-purple-600 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">2-year warranty</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                        <MessageCircle size={24} className="text-indigo-600" />
                        <span>Customer Reviews</span>
                    </h2>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-indigo-600">{product.averageRating || 0}</div>
                        <div className="flex items-center space-x-1">
                            {renderStars(product.averageRating || 0, 14)}
                        </div>
                        <p className="text-sm text-gray-600">{product.reviewCount || 0} reviews</p>
                    </div>
                </div>

                {/* Add Review Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
                    <form onSubmit={submitComment} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rating
                            </label>
                            <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRating(r)}
                                        className="p-2 hover:scale-110 transition-transform"
                                    >
                                        <Star
                                            size={24}
                                            className={r <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Review
                            </label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Share your experience with this product..."
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        <motion.button
                            type="submit"
                            disabled={submittingComment || !text.trim()}
                            whileHover={{ scale: submittingComment ? 1 : 1.02 }}
                            whileTap={{ scale: submittingComment ? 1 : 0.98 }}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 transition-all duration-200"
                        >
                            {submittingComment ? "Submitting..." : "Submit Review"}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Reviews List */}
                <AnimatePresence>
                    {comments.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 bg-white rounded-2xl border border-gray-100"
                        >
                            <MessageCircle size={48} className="text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                            <p className="text-gray-600">Be the first to share your thoughts!</p>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            {comments.map((comment, index) => (
                                <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                                                <User size={20} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{comment.username}</h4>
                                                <div className="flex items-center space-x-1">
                                                    {renderStars(comment.rating, 14)}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{comment.text}</p>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}