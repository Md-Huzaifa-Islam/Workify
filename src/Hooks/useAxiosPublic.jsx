import axios from "axios";

export default function useAxiosPublic() {
  const axiosPublic = axios.create({
    baseURL: "https://workify-server.vercel.app/",
  });
  return axiosPublic;
}
