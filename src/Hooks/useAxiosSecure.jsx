import axios from "axios";

export default function useAxiosSecure() {
  const axiosSecure = axios.create({
    baseURL: "http://localhost:5000/",
    withCredentials: true,
  });
  axiosSecure.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        console.error("Unauthorized: Please log in again.");
      } else if (error.response.status === 403) {
        console.error("Forbidden: You do not have access to this resource.");
      }
      return Promise.reject(error);
    },
  );
  return axiosSecure;
}
