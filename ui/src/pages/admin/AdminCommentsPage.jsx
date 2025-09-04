import { useEffect, useState } from "react";
import api from "../../api/ApiService";
import toast from "react-hot-toast";
import {
    Trash2,
    MessageSquare,
    User,
    Package,
    Star,
    Calendar,
    Search,
    Filter,
    Loader2,
    AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminCommentsPage() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRating, setFilterRating] = useState("all");
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const res = await api.get("/admin/comments", { withCredentials: true });
            setComments(res.data.content);
        } catch (err) {
            toast.error("Failed to load comments");
        } finally {
            setLoading(false);
        }
    };

    const deleteComment = async (id) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;

        setDeletingId(id);
        try {
            await api.delete(`/admin/comments/${id}`, { withCredentials: true });
            setComments(comments.filter((c) => c.id !== id));
            toast.success("✅ Comment deleted successfully");
        } catch (err) {
            toast.error("Failed to delete comment");
        } finally {
            setDeletingId(null);
        }
    };

    const filteredComments = comments
        .filter(comment =>
            comment.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comment.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comment.productId.toString().includes(searchTerm)
        )
        .filter(comment =>
            filterRating === "all" || comment.rating === parseInt(filterRating)
        );

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={14}
                className={i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
            />
        ));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center space-x-2 text-gray-600">
                    <Loader2 size={24} className="animate-spin" />
                    <span>Loading comments...</span>
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
                        <MessageSquare size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Comments</h1>
                        <p className="text-gray-600">Review and moderate user feedback</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by user, product, or comment..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Filter size={20} className="text-gray-400" />
                    <select
                        value={filterRating}
                        onChange={(e) => setFilterRating(e.target.value)}
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>
            </div>

            {/* Comments Grid */}
            <div className="grid gap-4">
                <AnimatePresence>
                    {filteredComments.map((comment) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* User Info */}
                                <div className="flex items-start space-x-3 flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                                        <User size={24} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{comment.username}</h3>
                                        <div className="flex items-center space-x-1 mt-1">
                                            {renderStars(comment.rating)}
                                        </div>
                                    </div>
                                </div>

                                {/* Comment Content */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-700 leading-relaxed">{comment.text}</p>

                                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            <Package size={14} />
                                            <span>Product ID: {comment.productId}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Calendar size={14} />
                                            <span>{new Date(comment.createdAt).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <MessageSquare size={14} />
                                            <span>Comment ID: #{comment.id}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-start justify-end">
                                    <motion.button
                                        onClick={() => deleteComment(comment.id)}
                                        disabled={deletingId === comment.id}
                                        whileHover={{ scale: deletingId === comment.id ? 1 : 1.05 }}
                                        whileTap={{ scale: deletingId === comment.id ? 1 : 0.95 }}
                                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors duration-200"
                                    >
                                        {deletingId === comment.id ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={16} />
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredComments.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 bg-white rounded-2xl border border-gray-100"
                >
                    <AlertCircle size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No comments found</h3>
                    <p className="text-gray-500">
                        {searchTerm || filterRating !== "all"
                            ? "Try adjusting your search or filter criteria"
                            : "There are no comments to display"
                        }
                    </p>
                </motion.div>
            )}

            {/* Stats */}
            {filteredComments.length > 0 && (
                <div className="mt-6 text-sm text-gray-500">
                    Showing {filteredComments.length} of {comments.length} comments
                </div>
            )}
        </div>
    );
}