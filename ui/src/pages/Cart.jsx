import { useEffect, useState } from "react";
import api from "../api/ApiService";
import toast from "react-hot-toast";

export default function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await api.get("/user/cart", { withCredentials: true });
            setCart(res.data);
        } catch (err) {
            toast.error("Failed to load cart");
        } finally {
            setLoading(false);
        }
    };

    const updateItem = async (itemId, quantity) => {
        try {
            const res = await api.put(
                `/user/cart/items/${itemId}?quantity=${quantity}`,
                {},
                { withCredentials: true }
            );
            setCart(res.data);
            toast.success("Cart updated");
        } catch (err) {
            toast.error("Failed to update item");
        }
    };

    const removeItem = async (itemId) => {
        try {
            const res = await api.delete(`/user/cart/items/${itemId}`, {
                withCredentials: true,
            });
            setCart(res.data);
            toast.success("Item removed");
        } catch (err) {
            toast.error("Failed to remove item");
        }
    };

    const clearCart = async () => {
        if (!window.confirm("Clear entire cart?")) return;
        try {
            await api.delete("/user/cart/clear", { withCredentials: true });
            setCart({ items: [], totalPrice: 0 });
            toast.success("Cart cleared");
        } catch (err) {
            toast.error("Failed to clear cart");
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading cart...</p>;
    }

    if (!cart || cart.items.length === 0) {
        return <p className="text-center mt-10">Your cart is empty 🛒</p>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-700">
                <tr>
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-left">Total</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                </tr>
                </thead>
                <tbody>
                {cart.items.map((item) => (
                    <tr key={item.id} className="border-t">
                        <td className="px-4 py-2 flex items-center gap-2">
                            <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-12 h-12 object-cover rounded"
                            />
                            {item.productName}
                        </td>
                        <td className="px-4 py-2">€{Number(item.price).toFixed(2)}</td>
                        <td className="px-4 py-2">
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, e.target.value)}
                                className="w-16 border rounded px-2 py-1"
                            />
                        </td>
                        <td className="px-4 py-2">
                            €{Number(item.total).toFixed(2)}
                        </td>
                        <td className="px-4 py-2">
                            <button
                                onClick={() => removeItem(item.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Итог */}
            <div className="mt-6 flex justify-between items-center">
                <h2 className="text-xl font-bold">
                    Total: €{Number(cart.totalPrice).toFixed(2)}
                </h2>
                <div className="space-x-2">
                    <button
                        onClick={clearCart}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Clear Cart
                    </button>
                    <button
                        onClick={() => toast("Proceed to checkout coming soon!")}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}
