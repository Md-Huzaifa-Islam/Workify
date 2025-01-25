import PropTypes from "prop-types";
import Loading from "../components/Loading";
import { Navigate } from "react-router-dom";
import useAuth from "../Hooks/CustomHooks";

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
