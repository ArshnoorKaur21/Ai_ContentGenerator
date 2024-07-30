import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { verifyPaymentAPI } from "../APIS/stripPayment/stripePayment";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const paymentIntentID = searchParams.get("payment_intent");

console.log("Payment intent",paymentIntentID)

  // Always call useQuery
  const { isLoading, isError, data, isSuccess } = useQuery({

    queryFn: () => verifyPaymentAPI(paymentIntentID),
  
  });

  // Handle missing paymentIntentID
  if (!paymentIntentID) {
    return (
      <div className="text-center text-red-500">
        <FaTimesCircle className="text-5xl mb-3" />
        <p className="text-xl">Payment Intent ID is missing</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mb-3" />
          <p className="text-lg text-gray-600">Verifying your payment, please wait...</p>
        </div>
      ) : isError ? (
        <div className="text-center text-red-500">
          <FaTimesCircle className="text-5xl mb-3" />
          <p className="text-xl">Payment verification failed</p>
          <p>{data?.message || 'An error occurred'}</p>
          {/* Optional: Log detailed error info */}
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : isSuccess && data?.success ? (
        <div className="text-center text-green-500">
          <FaCheckCircle className="text-5xl mb-3" />
          <h1 className="text-2xl font-bold mb-3">Payment Successful</h1>
          <p className="text-gray-600 mb-4">Thank you for your payment. Your transaction ID is {paymentIntentID}.</p>
          <Link
            to="/generate-content"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Using AI
          </Link>
        </div>
      ) : (
        <div className="text-center text-red-500">
          <FaTimesCircle className="text-5xl mb-3" />
          <p className="text-xl">Payment verification failed</p>
          <p>An unexpected error occurred</p>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
