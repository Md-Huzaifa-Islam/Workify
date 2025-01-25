import PropTypes from "prop-types";
import Loading from "../components/Loading";
import { Navigate } from "react-router-dom";
import useAuth from "../Hooks/CustomHooks";

function EmployeeRoute({ children }) {
  const { role, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (role != "Employee") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

EmployeeRoute.propTypes = {
  children: PropTypes.node,
};

export default EmployeeRoute;
