import React, { useEffect, useState } from "react";
import axios from "axios";

const IndentedOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 🔹 Fetch indent orders
    const fetchIndentOrders = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.get("http://udaan.kritinutrients.com/dealer/getIndentOrders");
            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                setError("Failed to fetch orders");
            }
        } catch (err) {
            console.error("Error fetching indent orders:", err);
            setError("Server not reachable or internal error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIndentOrders();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Indented Orders</h1>

            {/* 🔹 Loading state */}
            {loading && <p className="text-blue-600">Loading orders...</p>}

            {/* 🔹 Error state */}
            {error && <p className="text-red-600">{error}</p>}

            {/* 🔹 Table */}
            {!loading && !error && orders.length > 0 && (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full border-collapse border border-gray-200 text-sm text-gray-700 bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-200 px-4 py-2 text-left">#</th>
                                <th className="border border-gray-200 px-4 py-2 text-left">Order No</th>
                                {/* <th className="border border-gray-200 px-4 py-2 text-left">Item No</th> */}
                                <th className="border border-gray-200 px-4 py-2 text-left">Material</th>
                                <th className="border border-gray-200 px-4 py-2 text-left">Quantity</th>
                                <th className="border border-gray-200 px-4 py-2 text-left">Unit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr
                                    key={`${order.Vbeln}-${order.Posnr}`}
                                    className="hover:bg-gray-50 transition"
                                >
                                    <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
                                    <td className="border border-gray-200 px-4 py-2">{order.Vbeln}</td>
                                    {/* <td className="border border-gray-200 px-4 py-2">{order.Posnr}</td> */}
                                    <td className="border border-gray-200 px-4 py-2">{order.Matnr}</td>
                                    <td className="border border-gray-200 px-4 py-2 text-right">{order.Kwmeng}</td>
                                    <td className="border border-gray-200 px-4 py-2">{order.Vrkme}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 🔹 No data message */}
            {!loading && !error && orders.length === 0 && (
                <p className="text-gray-500">No indent orders found.</p>
            )}
        </div>
    );
};

export default IndentedOrders;

