import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {QueryClient,QueryClientProvider} from '@tanstack/react-query'
import { AuthProvider } from "./AuthContext/AuthContext";
const queryClient=new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root"));
const stripePromise=loadStripe(
  'pk_test_51PMCXfDPYGotuPyiemmch9SUHThxBZcnKe7OzhHBHPSBlV6QnB8FjcDVZFvX86KD2AmogUS0uOIp3bCKkdkoN6xC00v4JGXHAA'
)
const options={
  mode:'payment',
  currency:'usd',
  amount:1000,
}
root.render(
  <React.StrictMode>
  <QueryClientProvider client={queryClient}>
  <AuthProvider >
  <Elements stripe={stripePromise} options={options}>
        <App />
        </Elements>
  </AuthProvider>

    </QueryClientProvider>
  </React.StrictMode>
);
