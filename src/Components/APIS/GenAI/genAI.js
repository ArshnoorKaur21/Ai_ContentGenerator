import { BASE_URL } from "../../../utils/baseEndpoint";
import axios from "axios";
export const generateContentAPI = async ({prompt}) => {
    const response = await axios.post(
      `${BASE_URL}/generate-content`,
      {
      prompt,
      },
      {
        withCredentials: true,
      }
    );
  
    return response?.data;
  };