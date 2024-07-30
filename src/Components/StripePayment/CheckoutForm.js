import React, { useState } from "react";
import { PaymentElement,
  useStripe, useElements
 } from "@stripe/react-stripe-js";
import { useParams, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createStripePaymentIntentAPI } from "../APIS/stripPayment/stripePayment";
const CheckoutForm = () => {
  const params=useParams();
  const [searchParams]=useSearchParams();
  const plan=params.plan;
  const amount=searchParams.get('amount');

  const mutation=useMutation({
    mutationFn:createStripePaymentIntentAPI
  })
  const stripe=useStripe();
  const elements=useElements();
  const [errorMessage,setErrorMessage]=useState(null);

console.log(amount);
const handleSubmit=async (e)=>{
  e.preventDefault();
  if(elements===null){
    return ;
  }

  const {error:submitError}=
  await elements.submit();
  if(submitError){
    return ;
  }
  try{
    const data={
      amount,plan
    };
    mutation.mutateAsync(data);
    console.log("Muration ",mutation);

    if(mutation?.isSuccess){
      const {error}=await stripe.confirmPayment({
        elements,
        clientSecret:mutation?.data?.clientSecret,
        confirmParams:{
          return_url:'https://contentgentai.vercel.app/success'
        }
      });
      if(error){
        setErrorMessage(error?.message)
      }
    }
   
    
  }catch(error){
setErrorMessage(error?.message)
  }
}



  return <div className="bg-gray-900 h-screen -mt-4 flex justify-center items-center">
  <form onSubmit={handleSubmit} className="w-96 mx-auto my-4 p-6 bg-white rounded-lg shadow-md">
    <div className="mb-4">
      <PaymentElement/>
    </div>
    <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Pay
          </button>
          {
            errorMessage && <div className="bg-red-400 text-white">
              {errorMessage}
            </div>
          }
  </form>
  </div>;
};

export default CheckoutForm;
