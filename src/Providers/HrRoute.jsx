import PropTypes from "prop-types";
import { useAuth } from "../Hooks/CustomHooks";
import Loading from "../components/Loading";
import { Navigate } from "react-router-dom";

function HrRoute({ children }) {
  const { loading, role } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (role != "HR") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

HrRoute.propTypes = {
  children: PropTypes.node,
};

export default HrRoute;
