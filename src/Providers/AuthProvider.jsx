import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../Firebase/Firebase";
import { AuthContext } from "../Contexts/Context";
import PropTypes from "prop-types";
import { GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // sign in with email and pass
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

  // sign out
  const signout = () => {
    return signOut(auth);
  };
  // observer
  useEffect(() => {
    const disconnect = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => disconnect();
  }, []);

  const values = {
    user,
    loading,
    SignInEmail,
    SingInGmail,
    SignUpEmail,
    signout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
