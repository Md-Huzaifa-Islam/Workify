import PropTypes from "prop-types";
import { useAuth } from "../Hooks/CustomHooks";
import Loading from "../components/Loading";
import { Navigate } from "react-router-dom";

function DbCheckRoute({ children }) {
  const { loading, userDB, user } = useAuth();
  //   console.log(userDB);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <>{children}</>;
  }
  if (!userDB) {
    return <Loading />;
  }
  if (userDB) {
    if (!(userDB?.salary || userDB?.bank || userDB?.designation)) {
      console.log("not found data again");
      return <Navigate to="/notcompleted" replace />;
    }
  }
  return <>{children}</>;
}

DbCheckRoute.propTypes = {
  children: PropTypes.node,
};

export default DbCheckRoute;
