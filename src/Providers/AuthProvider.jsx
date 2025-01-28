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

const provider = new GoogleAuthProvider();

export default function AuthProvider({ children }) {
  const axiosSecure = useAxiosSecure();

  const [role, setRole] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDB, setUserDb] = useState(false);

  // sign in with email and password
  const SignInEmail = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const SignUpEmail = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // with gmail
  const SingInGmail = () => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };

  // update name and image
  const update = (name, photo) => {
    setLoading(true);
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };
  const updateDb = () => {
    setLoading(true);
    return axiosSecure.get(`/user?email=${user?.email}`);
  };

  // sign out
  const signout = () => {
    setLoading(true);
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
                    if (res.data?.fired) {
                      signout().then(() => {
                        setLoading(false);
                      });
                    } else {
                      setUserDb(res.data);
                      setLoading(false);
                    }
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
        axiosSecure.post("logout", {}).then(() => setLoading(false));
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
    setLoading,
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
