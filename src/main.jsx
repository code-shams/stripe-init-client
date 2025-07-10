import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";
import Cart from "./Cart.jsx";
import Payment from "./Stripe/Payment.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
    },
    {
        path: "/cart",
        Component: Cart,
    },
    {
        path: "/payment/:id",
        Component: Payment,
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}></RouterProvider>
        </QueryClientProvider>
    </StrictMode>
);
