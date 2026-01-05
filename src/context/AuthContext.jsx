import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        // 🔹 First check Members
        let snap = await getDoc(doc(db, "Members", user.uid));

        if (snap.exists()) {
          setUsername(snap.data().username);
          setRole("Member");
        } else {
          // 🔹 Then check Heads
          snap = await getDoc(doc(db, "Heads", user.uid));
          if (snap.exists()) {
            setUsername(snap.data().username);
            setRole("Head");
          } else {
            setUsername("");
            setRole("");
          }
        }
      } else {
        setCurrentUser(null);
        setUsername("");
        setRole("");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        username,
        role,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
