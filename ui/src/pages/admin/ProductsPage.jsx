import { useEffect, useState } from "react";
import api from "../../api/ApiService";
import toast from "react-hot-toast";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get("/public/products?pageNumber=0&pageSize=50", {
                withCredentials: true,
            });
            setProducts(res.data.content); // ProductPageResponse
        } catch (err) {
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/admin/products/${id}`, { withCredentials: true });
            setProducts(products.filter((p) => p.id !== id));
            toast.success("Product deleted");
        } catch (err) {
            toast.error("Failed to delete product");
        }
    };

    if (loading) {
        return <p className="text-center">Loading products...</p>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">📦 Products</h2>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-700">
                <tr>
                    <th className="px-4 py-2 text-left">Image</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map((p) => (
                    <tr key={p.id} className="border-t">
                        <td className="px-4 py-2">
                            <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-12 h-12 object-cover rounded"
                            />
                        </td>
                        <td className="px-4 py-2">{p.name}</td>
                        <td className="px-4 py-2">{p.categoryName}</td>
                        <td className="px-4 py-2">€{p.price}</td>
                        <td className="px-4 py-2">{p.quantity}</td>
                        <td className="px-4 py-2 space-x-2">
                            <button
                                onClick={() => toast("Edit coming soon!")}
                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteProduct(p.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
