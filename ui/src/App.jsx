import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// страницы
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CartPage from "./pages/CartPage"; // ✅ правильная корзина
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductDetails from "./pages/ProductDetails";
import OrdersPage from "./pages/OrdersPage";
import CheckoutPage from "./pages/CheckoutPage";
import UserProfilePage from "./pages/UserProfilePage";

export default function App() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Навбар всегда сверху */}
            <Navbar />

            <div className="pt-6">
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cart" element={<CartPage />} /> {/* ✅ заменили */}

                    {/* Product details */}
                    <Route path="/products/:id" element={<ProductDetails />} />

                    {/* User routes */}
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/profile" element={<UserProfilePage />} />

                    {/* Admin routes */}
                    <Route path="/admin" element={<AdminDashboard />} />

                    {/* Fallback */}
                    <Route
                        path="*"
                        element={<h1 className="text-center mt-10">404 Not Found</h1>}
                    />
                </Routes>
            </div>
        </div>
    );
}
