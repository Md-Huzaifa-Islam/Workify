import { useContext } from "react";
import { AuthContext } from "../Contexts/Context";

export const useAuth = () => useContext(AuthContext);
