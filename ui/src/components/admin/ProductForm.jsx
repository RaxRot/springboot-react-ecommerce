import { useEffect, useState } from "react";
import api from "../../api/ApiService";
import toast from "react-hot-toast";
import {
    Upload,
    Image as ImageIcon,
    Save,
    X,
    Loader2,
    Euro,
    Hash,
    Tag,
    FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductForm({ product, onSuccess, onCancel }) {
    const [form, setForm] = useState({
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price || "",
        quantity: product?.quantity || "",
        categoryId: product?.categoryId || "",
    });
    const [categories, setCategories] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(product?.imageUrl || null);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [file]);

    const fetchCategories = async () => {
        try {
            const res = await api.get("/public/categories", { withCredentials: true });
            setCategories(res.data.content);
        } catch (err) {
            toast.error("Failed to load categories");
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB");
                return;
            }
            if (!selectedFile.type.startsWith('image/')) {
                toast.error("Please select an image file");
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) return toast.error("Name is required");
        if (!form.description.trim()) return toast.error("Description is required");
        if (!form.price || Number(form.price) <= 0)
            return toast.error("Price must be greater than 0");
        if (!form.quantity || Number(form.quantity) < 0)
            return toast.error("Quantity must be 0 or more");
        if (!form.categoryId) return toast.error("Please select a category");

        const data = new FormData();
        data.append("data", new Blob([JSON.stringify(form)], { type: "application/json" }));
        if (file) data.append("file", file);

        try {
            setLoading(true);
            let res;
            if (product) {
                res = await api.put(`/admin/products/${product.id}`, data, {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                });
                toast.success("Product updated successfully! 🎉");
            } else {
                res = await api.post("/admin/products", data, {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                });
                toast.success("Product created successfully! 🎉");
            }
            onSuccess(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    const removeImage = () => {
        setFile(null);
        setPreview(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">
                    {product ? "Edit Product" : "Create New Product"}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <Tag size={16} />
                        <span>Product Name</span>
                    </label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Enter product name..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                    />
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <FileText size={16} />
                        <span>Description</span>
                    </label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        disabled={loading}
                        rows={4}
                        placeholder="Describe your product..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50"
                    />
                </div>

                {/* Price & Quantity Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                            <Euro size={16} />
                            <span>Price (€)</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">€</span>
                            <input
                                type="number"
                                step="0.01"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                            <Hash size={16} />
                            <span>Quantity</span>
                        </label>
                        <input
                            type="number"
                            name="quantity"
                            value={form.quantity}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                            placeholder="Enter quantity..."
                        />
                    </div>
                </div>

                {/* Category Select */}
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <Tag size={16} />
                        <span>Category</span>
                    </label>
                    <select
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                    >
                        <option value="">Select category...</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <ImageIcon size={16} />
                        <span>Product Image</span>
                    </label>

                    <div className="flex flex-col sm:flex-row gap-6">
                        {/* File Input */}
                        <label className="flex-1 cursor-pointer">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                disabled={loading}
                                accept="image/*"
                                className="hidden"
                            />
                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-indigo-400 transition-colors duration-200 group">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-indigo-600" />
                                <p className="text-sm text-gray-600">Click to upload image</p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                            </div>
                        </label>

                        {/* Preview */}
                        <AnimatePresence>
                            {preview && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="relative"
                                >
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-32 h-32 object-cover rounded-2xl border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 transition-all duration-200 flex-1"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                <span>{product ? "Update Product" : "Create Product"}</span>
                            </>
                        )}
                    </motion.button>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </motion.div>
    );
}