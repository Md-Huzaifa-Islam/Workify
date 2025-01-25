import axios from "axios";
import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import useAuth from "./CustomHooks";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/",
  withCredentials: true,
});

const useAxiosSecure = () => {
  // const navigate = useNavigate();
  // const { signout } = useAuth(); // Ensure it's correctly imported

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const status = error.response?.status;

        if (status === 401 || status === 403) {
          try {
            // Perform signout and navigation
            // await signout();
            toast.error("Your session has expired. Please log in again.");
            // navigate("/login", { replace: true });
          } catch (signoutError) {
            console.error("Error during signout:", signoutError);
            toast.error("Failed to sign out.");
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor); // Clean up interceptor
    };
  }, []);

  return axiosInstance;
};

export default useAxiosSecure;
