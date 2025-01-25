import PropTypes from "prop-types";
import Loading from "../components/Loading";
import { Navigate } from "react-router-dom";
import useAuth from "../Hooks/CustomHooks";

function AdminRoute({ children }) {
  const { loading, role } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (role != "Admin") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

AdminRoute.propTypes = {
  children: PropTypes.node,
};

export default AdminRoute;
