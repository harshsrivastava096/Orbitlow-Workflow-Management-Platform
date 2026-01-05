import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [fullname, setfullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [position, setPosition] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= VALIDATIONS ================= */

  const usernamePattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobilePattern = /^[6-9]\d{9}$/;

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !mobile || !position || !gender) {
      toast.error("Fill all fields");
      return;
    }

    if (!usernamePattern.test(username)) {
      toast.error(
        "Username should be combination of letters & numbers and not less than 7 characters"
      );
      return;
    }

    if (!emailPattern.test(email)) {
      toast.error("Enter email");
      return;
    }

    if (!mobilePattern.test(mobile)) {
      toast.error("Enter Valid Mobile number");
      return;
    }

    if (!passwordPattern.test(password)) {
      toast.error(
        "Password should be combination of letters & numbers and not less than 7 characters"
      );
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: user.uid });

      const collectionName = position === "Member" ? "Members" : "Heads";

      await setDoc(doc(db, collectionName, user.uid), {
        userID: user.uid,
        username,
        fullname,
        email,
        mobileNumber: mobile,
        password,
        position,
        gender,
        state: "Inactive",
      });

      localStorage.setItem("role", position);

      toast.success("Registration Successful!");
      navigate("/ConnectPage");
    } catch (err) {
      console.error("Signup Error:", err);
      toast.error("Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF]">
      <motion.form
        onSubmit={handleSignUp}
        className="bg-[#312834] p-10 rounded-2xl w-full max-w-md text-white shadow-2xl border-2 border-cyan-400"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold text-center text-cyan-400 mb-8 animate-pulse">
          Sign Up
        </h2> 

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onFocus={() =>
              toast(
                "Username should be combination of letters & numbers and not less than 7 characters"
              )
            }
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#dbbce6] text-red-950 placeholder-red-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />

          <input
            type="text"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setfullname(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#dbbce6] text-red-950 placeholder-red-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />

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
            onFocus={() =>
              toast(
                "Password should be combination of letters & numbers and not less than 7 characters"
              )
            }
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#dbbce6] text-red-950 placeholder-red-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />

          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#dbbce6] text-red-950 placeholder-red-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#dbbce6] text-red-950 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#dbbce6] text-red-950 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          >
            <option value="">Select Role</option>
            <option value="Member">Member</option>
            <option value="Head">Head</option>
          </select>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 bg-cyan-400 text-black font-bold rounded-lg shadow-lg hover:bg-cyan-300 transition-all"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </motion.button>

        <p
          className="mt-4 text-center text-cyan-300 cursor-pointer hover:underline"
          onClick={() => navigate("/ConnectPage")}
        >
          ← Back to Connect
        </p>
      </motion.form>
    </div>
  );
}
