import { useContext } from "react";
import { AuthContext } from "../Contexts/Context";
const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export default useAuth;
