import React, { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import auth from "../../Firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import toast from "react-hot-toast";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();
  const axiosPublic = useAxiosPublic();

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const updateUserProfile = (name, photo) => {
    setLoading(true);
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo || "",
    });
  };
  const signinWithPop = () => {
    return signInWithPopup(auth, googleProvider);
  };
  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };
  const signOutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  console.log({ user }); // in this log I see user is null how to solve
  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("State Cuptured", currentUser);

      if (currentUser) {
        // console.log("idToken", currentUser.accessToken); //here i see user
        axiosPublic
          .post("/login", { idToken: currentUser.accessToken, role: "user" })
          .then((res) => {
            // console.log("Login successful", res); //this and down log nothing show why
            if (res.data.token) {
              toast.success('Login successful')
              localStorage.setItem(
                "user",
                JSON.stringify({ token: res.data?.token })
              );
              setUser({ ...currentUser, token: res.data?.token });
              setLoading(false);
            }
            // console.log("Login successful token", {
            //   ...currentUser,
            //   token: res.data?.token,
            // });
          }).catch(error=>{
            // console.log("Backend login error", error)
            toast.error("User login error" || error.message)
          })

        setLoading(false);
      } else {
        // do something
        localStorage.removeItem("user");

        toast.error("Sign out");
        setLoading(false);
      }
    });

    return () => {
      unsubcribe();
    };
  }, [axiosPublic]);

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    createUser,
    signInUser,
    updateUserProfile,
    signinWithPop,
    signOutUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
