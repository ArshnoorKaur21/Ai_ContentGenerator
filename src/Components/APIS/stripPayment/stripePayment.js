import { BASE_URL } from "../../../utils/baseEndpoint";
import axios from "axios";
export const handleFreeSubscription = async () => {
    const response = await axios.post(
      `${BASE_URL}/free-plan`,
      {
      },
      {
        withCredentials: true,
      }
    );
  
    return response?.data;
  };


  export const createStripePaymentIntentAPI = async (payment) => {
    const response = await axios.post(
      `${BASE_URL}/pay`,
      {
        amount:Number(payment?.amount),
        subscriptionPlan:payment?.plan,
      },
      {
        withCredentials: true,
      }
    );
  
    return response?.data;
  };

  export const verifyPaymentAPI = async (paymentId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/verify/${paymentId}`,
        {},  
        {
          withCredentials: true  
        }
      );
      return response?.data;
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  }  