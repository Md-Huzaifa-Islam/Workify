import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../Firebase/Firebase";
import { AuthContext } from "../Contexts/Context";
import PropTypes from "prop-types";
import { GoogleAuthProvider } from "firebase/auth";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const provider = new GoogleAuthProvider();

export default function AuthProvider({ children }) {
  const axiosSecure = useAxiosSecure();
  const [role, setRole] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // sign in with email and password
  const SignInEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const SignUpEmail = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // with gmail
  const SingInGmail = () => {
    return signInWithPopup(auth, provider);
  };

  // update name and image
  const update = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  // sign out
  const signout = () => {
    return signOut(auth);
  };
  // observer
  useEffect(() => {
    const disconnect = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log(currentUser);
      if (currentUser) {
        axiosSecure
          .post("jwt", {
            name: currentUser?.displayName,
            email: currentUser?.email,
          })
          .then(() => {
            axiosSecure
              .get("getrole")
              .then((res) => {
                setRole(res.data);

                setLoading(false);
              })
              .catch((err) => console.log(err));
          });
      } else {
        axiosSecure.post("logout", {}).then(() => setLoading(false));
      }
    });
    return () => disconnect();
  }, [axiosSecure]);

  const values = {
    user,
    loading,
    SignInEmail,
    SingInGmail,
    SignUpEmail,
    signout,
    update,
    setUser,
    role,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
