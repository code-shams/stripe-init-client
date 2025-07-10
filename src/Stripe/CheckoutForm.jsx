import { useState } from "react";
import {
    CardElement,
    useStripe,
    useElements,
    PaymentElement,
} from "@stripe/react-stripe-js";

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const res = await fetch(
                "http://localhost:5000/create-payment-intent",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount: 1000 }), // 1000 cents = $10
                }
            );
            const data = await res.json();

            const cardElement = elements.getElement(CardElement);
            const confirm = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: { name: "Customer Name" },
                },
            });

            if (confirm.error) {
                setError(confirm.error.message);
            } else if (confirm.paymentIntent.status === "succeeded") {
                setSuccess(true);
            }
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <CardElement className="p-2 border rounded" />
            <button
                type="submit"
                disabled={!stripe || loading}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
                {loading ? "Processing..." : "Pay $10"}
            </button>
            {error && <div className="text-red-500">{error}</div>}
            {success && (
                <div className="text-green-500">Payment succeeded!</div>
            )}
        </form>
    );
};

export default CheckoutForm;
