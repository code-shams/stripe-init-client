import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";

function App() {
    const [cart, setCart] = useState([]);

    const { isPending, isError, data, error } = useQuery({
        queryKey: ["phones"],
        queryFn: async () => {
            const res = await fetch("phone.json");
            return res.json();
        },
    });
    const addToCart = async (phone) => {
        const existingItem = cart.find((item) => item.id === phone.id);
        let updatedCart;

        if (existingItem) {
            updatedCart = cart.map((item) =>
                item.id === phone.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            updatedCart = [...cart, { ...phone, quantity: 1 }];
        }

        // Update local state first for immediate UI feedback
        setCart(updatedCart);

        // Send POST request to backend
        try {
            const res = await axios.post("http://localhost:5000/phone/cart", {
                id: phone.id,
                quantity: existingItem ? existingItem.quantity + 1 : 1,
                name: phone.name,
                price: phone.price,
            });
            console.log(res.data);
        } catch (error) {
            console.error("Failed to add to cart on server:", error);
        }
    };

    const getCartItemCount = (phoneId) => {
        const item = cart.find((item) => item.id === phoneId);
        return item ? item.quantity : 0;
    };

    if (isPending) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-gray-600">Loading phones...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-red-600">
                    Error: {error.message}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Phone Store
                    </h1>
                    <p className="text-gray-600">
                        Discover the latest smartphones
                    </p>
                    <button className="p-5">
                        <Link
                            className="px-3 py-2 rounded-lg bg-lime-200"
                            to="/cart"
                        >
                            Cart
                        </Link>
                    </button>
                    {cart.length > 0 && (
                        <div className="mt-4 inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                            Cart:{" "}
                            {cart.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                            items
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {data?.map((phone) => (
                        <div
                            key={phone.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="relative">
                                <img
                                    src={phone.image}
                                    alt={phone.name}
                                    className="w-full h-48 object-cover"
                                />
                                {!phone.in_stock && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                                        Out of Stock
                                    </div>
                                )}
                                <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                                    {phone.brand}
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                                    {phone.name}
                                </h3>

                                <div className="space-y-2 text-sm text-gray-600 mb-3">
                                    <div className="flex justify-between">
                                        <span>Storage:</span>
                                        <span>{phone.storage}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Display:</span>
                                        <span>{phone.display_size}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Camera:</span>
                                        <span>{phone.camera_mp}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Color:</span>
                                        <span>{phone.color}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center">
                                        <span className="text-yellow-500 text-sm">
                                            ★
                                        </span>
                                        <span className="text-sm text-gray-600 ml-1">
                                            {phone.rating}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {phone.operating_system}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold text-gray-800">
                                        ${phone.price}
                                    </div>
                                    <button
                                        onClick={() => addToCart(phone)}
                                        disabled={!phone.in_stock}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                            phone.in_stock
                                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                    >
                                        {phone.in_stock
                                            ? "Add to Cart"
                                            : "Out of Stock"}
                                    </button>
                                </div>

                                {getCartItemCount(phone.id) > 0 && (
                                    <div className="mt-2 text-center text-sm text-green-600">
                                        {getCartItemCount(phone.id)} in cart
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {data?.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                        No phones available
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
