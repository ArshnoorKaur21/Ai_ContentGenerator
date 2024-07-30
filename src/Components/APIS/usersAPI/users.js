import axios from "axios";
import { BASE_URL } from "../../../utils/baseEndpoint";
export const registerAPI = async (userData) => {
    const response = await axios.post(
      `${BASE_URL}/users/register`,
      {
        name: userData?.name,
        password: userData?.password,
        email: userData?.email,
      },
      {
        withCredentials: true,
      }
    );
  
    return response?.data;
  };
  export const loginAPI=async (userData)=>{
    const response =await axios.post(`${BASE_URL}/users/login`,{
email:userData?.email,
password:userData?.password,
    },{
        withCredentials: true,

    });
    return response?.data;
  };
  export const checkUserAuthStatusAPI = async () => {

      const response = await axios.get(`${BASE_URL}/users/checkAuth`, {
        withCredentials: true,
      });
      return response?.data;
    
  };
export const logoutAPI=async ()=>{
  const response=await axios.post(`${BASE_URL}/users/logout`,{},{
    withCredentials: true,
  });
  return response?.data;
};
export const getUserProfileAPI=async ()=>{
  const response=await axios.get(`${BASE_URL}/users/profile`,{
    withCredentials: true,
  });
  return response?.data;
};