import { useEffect, useState } from "react";
import api from "../api/ApiService";
import toast from "react-hot-toast";

export default function UserProfile() {
    const [address, setAddress] = useState(null);
    const [form, setForm] = useState({
        street: "",
        city: "",
        zipCode: "",
        country: "",
    });
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetchAddress();
    }, []);

    const fetchAddress = async () => {
        try {
            const res = await api.get("/user/address", { withCredentials: true });
            setAddress(res.data);
            setForm(res.data);
        } catch (err) {
            setAddress(null);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const saveAddress = async () => {
        try {
            if (address) {
                const res = await api.put("/user/address", form, { withCredentials: true });
                setAddress(res.data);
                toast.success("Address updated ✅");
            } else {
                const res = await api.post("/user/address", form, { withCredentials: true });
                setAddress(res.data);
                toast.success("Address saved ✅");
            }
            setEditing(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save address");
        }
    };

    if (loading) return <p className="text-center mt-10">Loading profile...</p>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">👤 My Profile</h1>

            {!editing ? (
                <div className="bg-white shadow rounded p-6">
                    <h2 className="text-xl font-semibold mb-4">📍 Address</h2>
                    {address ? (
                        <div className="space-y-1 text-gray-700">
                            <p>{address.street}</p>
                            <p>{address.city}, {address.zipCode}</p>
                            <p>{address.country}</p>
                        </div>
                    ) : (
                        <p className="text-gray-500">No address saved yet</p>
                    )}
                    <button
                        onClick={() => setEditing(true)}
                        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        {address ? "Edit Address" : "Add Address"}
                    </button>
                </div>
            ) : (
                <div className="bg-white shadow rounded p-6">
                    <h2 className="text-xl font-semibold mb-4">✏️ Edit Address</h2>
                    <div className="space-y-3">
                        <input
                            name="street"
                            placeholder="Street"
                            value={form.street}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                        <input
                            name="city"
                            placeholder="City"
                            value={form.city}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                        <input
                            name="zipCode"
                            placeholder="Zip Code"
                            value={form.zipCode}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                        <input
                            name="country"
                            placeholder="Country"
                            value={form.country}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={saveAddress}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setEditing(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
