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

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();
  const axiosPublic = useAxiosPublic()

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

  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("State Cuptured", currentUser);

      if(currentUser){
          console.log("idToken", currentUser.accessToken)
        const login = async () => {
            try {
                const {data} = await axiosPublic.post('/login',{ idToken: currentUser.accessToken, role:"user"})
                console.log("Login successful", data);

                localStorage.setItem("user", JSON.stringify({...currentUser, token: data?.token}));

                setUser({...currentUser, token: data?.token})
            } catch (error) {
                console.error("Login failed", error);
            }
        }
        login()
      } else {
        // do something
        localStorage.removeItem({...currentUser, token: data.token}) 
        setLoading(false)
    }
    });

    return () => {
      unsubcribe();
    };
  }, [auth, axiosPublic]);

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
