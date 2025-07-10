import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router";

function Cart() {
    const navigate = useNavigate();
    const {
        data: cartItems,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            const res = await axios.get("http://localhost:5000/phone/cart");
            return res.data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-gray-600">Loading cart...</div>
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

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handlePay = (item) => {
        navigate(`/payment/${item._id}`);
        // Later: call your backend payment API here
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Your Cart
                </h2>
                {cartItems.length === 0 ? (
                    <div className="text-gray-600">Your cart is empty.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                                        Product
                                    </th>
                                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                                        Quantity
                                    </th>
                                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                                        Price
                                    </th>
                                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                                        Subtotal
                                    </th>
                                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item.id} className="border-b">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-gray-800">
                                                {item.name}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.quantity}
                                        </td>
                                        <td className="px-4 py-3">
                                            ${item.price}
                                        </td>
                                        <td className="px-4 py-3 font-semibold">
                                            ${item.price * item.quantity}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handlePay(item)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                            >
                                                Pay
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-6 text-xl font-semibold text-gray-800">
                            Total: ${totalPrice}
                        </div>
                        <div className="p-5">
                            <Link
                                className="px-3 py-2 bg-sky-300 rounded-lg mb-5 mt-2"
                                to="/"
                            >
                                Home
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;
