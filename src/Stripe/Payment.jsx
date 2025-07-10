import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./stripe";
import CheckoutForm from "./CheckoutForm";
import { useParams } from "react-router";

const Payment = () => {
    const { id } = useParams();
    console.log(id);
    return (
        <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
            {/* <Elements stripe={stripePromise}>
                <CheckoutForm />
            </Elements> */}
            <h2>Payment</h2>
        </div>
    );
};

export default Payment;
