import PropTypes from "prop-types";
import { useAuth } from "../Hooks/CustomHooks";
import Loading from "../components/Loading";
import { Navigate } from "react-router-dom";

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
