import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { motion } from "framer-motion";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // Head / Member
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password || !role) {
      toast.error("Fill all fields");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Enter a valid email");
      return;
    }

    if (!validatePassword(password)) {
      toast.error(
        "Password must be at least 7 characters long and contain letters and numbers"
      );
      return;
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Firebase collection
      const collectionName = role === "Head" ? "Heads" : "Members";
      const userDocRef = doc(db, collectionName, user.uid);
      const snap = await getDoc(userDocRef);

      if (!snap.exists()) {
        toast.error(`No Such User Exists`);
        return;
      }

      const username = snap.data().username;

      // Update State in Firebase
      await updateDoc(userDocRef, { state: "Active" });

      // Save to localStorage
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);
      // localStorage.setItem("loginStartTime", new Date().toISOString());

      navigate("/Dashboard");
    } catch (err) {
      toast.error("Login error:", err);
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF]">
      <motion.form
        onSubmit={handleLogin}
        className="bg-[#312834] p-10 rounded-2xl w-full max-w-md text-white shadow-2xl border-2 border-cyan-400"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold text-center text-cyan-400 mb-4 animate-pulse">
          Login
        </h2>

        {/* Role Selection */}
        <p className="text-center mb-4 text-white font-semibold">Enter As A</p>
        <div className="flex justify-center gap-6 mb-6">
          <button
            type="button"
            onClick={() => setRole("Head")}
            className={`px-6 py-2 rounded-lg font-semibold ${
              role === "Head" ? "bg-cyan-400 text-black" : "bg-gray-600"
            }`}
          >
            Head
          </button>
          <button
            type="button"
            onClick={() => setRole("Member")}
            className={`px-6 py-2 rounded-lg font-semibold ${
              role === "Member" ? "bg-cyan-400 text-black" : "bg-gray-600"
            }`}
          >
            Member
          </button>
        </div>

        {/* Email & Password */}
        <div className="flex flex-col gap-4 mb-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#dbbce6] text-red-950 placeholder-red-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#dbbce6] text-red-950 placeholder-red-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 bg-cyan-400 text-black font-bold rounded-lg shadow-lg hover:bg-cyan-300 transition-all"
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>

        <p
          className="mt-4 text-center text-cyan-300 cursor-pointer hover:underline"
          onClick={() => navigate("/ConnectPage")}
        >
          &larr; Back to Connect
        </p>
      </motion.form>
    </div>
  );
}
