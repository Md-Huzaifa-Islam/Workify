import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { AuthContext } from "../Contexts/Context";
import { auth } from "../Firebase/Firebase";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { toast } from "react-toastify";

const provider = new GoogleAuthProvider();

export default function AuthProvider({ children }) {
  const axiosSecure = useAxiosSecure();

  const [role, setRole] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDB, setUserDb] = useState(false);

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
  const updateDb = () => {
    return axiosSecure.get(`/user?email=${user?.email}`);
  };

  // sign out
  const signout = () => {
    toast(`Goodbye ${user?.displayName}`);
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

                axiosSecure
                  .get(`/user?email=${currentUser.email}`)
                  .then((res) => {
                    console.log(currentUser.email);
                    console.log(res.data);
                    setUserDb(res.data);
                    setLoading(false);
                  });
              })
              .catch((err) => {
                console.log(err);
                setLoading(false);
              });
          });
      } else {
        setRole(false);
        setUserDb(false);
        axiosSecure
          .post("logout", {})
          .then(() => setLoading(false))
          .then(() => setLoading(false));
      }
    });
    return () => disconnect();
  }, [user]);

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
    userDB,
    updateDb,
    setUserDb,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
