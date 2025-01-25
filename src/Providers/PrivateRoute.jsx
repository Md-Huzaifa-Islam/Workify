import PropTypes from "prop-types";
import Loading from "../components/Loading";
import { Navigate } from "react-router-dom";
import useAuth from "../Hooks/CustomHooks";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

PrivateRoute.propTypes = {
  children: PropTypes.node,
};

export default PrivateRoute;
