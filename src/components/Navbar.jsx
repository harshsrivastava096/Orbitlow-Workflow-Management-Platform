import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Bell, X } from "lucide-react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import NotificationPage from "../pages/NotificationPage";
import { listenNotifications } from "../services/notificationService";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [profileImg, setProfileImg] = useState(
    localStorage.getItem("profileImg") || "/User.png"
  );
  const [notifCount, setNotifCount] = useState(0);

  // ===== Timer formatting function =====
  const formatTimer = (diffMs) => {
    const diff = Math.floor(diffMs / 1000);
    const h = String(Math.floor(diff / 3600)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
    const s = String(diff % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // ===== Timer state =====
  const [timer, setTimer] = useState(() => {
    const startTime = localStorage.getItem("loginStartTime");
    if (startTime) return formatTimer(Date.now() - Number(startTime));
    return "00:00:00";
  });

  // ===== Timer logic =====
  useEffect(() => {
    let startTime = localStorage.getItem("loginStartTime");
    if (!startTime) {
      startTime = Date.now();
      localStorage.setItem("loginStartTime", startTime);
    }

    const interval = setInterval(() => {
      const diff = Date.now() - Number(startTime);
      setTimer(formatTimer(diff));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ===== Fetch username and profile image =====
  useEffect(() => {
    const fetchUserData = async () => {
      const uid = localStorage.getItem("uid");
      const role = localStorage.getItem("role");
      if (!uid || !role) return;

      try {
        const collectionName = role === "Member" ? "Members" : "Heads";
        const snap = await getDoc(doc(db, collectionName, uid));

        if (snap.exists()) {
          const data = snap.data();

          // Set username if not in localStorage
          if (!localStorage.getItem("username")) {
            setUsername(data.username || "");
            localStorage.setItem("username", data.username || "");
          }

          // Profile image based on gender
          let img = "/User.png";
          if (data.gender === "Male") img = "/Male.png";
          else if (data.gender === "Female") img = "/Female.png";

          setProfileImg(img);
          localStorage.setItem("profileImg", img);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  // ===== Notifications =====
  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (!uid) return;

    const unsubscribe = listenNotifications(uid, (notifs) => {
      setNotifCount(notifs.length);
    });
    return () => unsubscribe();
  }, []);

  // ===== Logout =====
  const handleLogout = async () => {
    const uid = localStorage.getItem("uid");
    const role = localStorage.getItem("role");

    try {
      if (uid && role) {
        const collectionName = role === "Member" ? "Members" : "Heads";
        const userDocRef = doc(db, collectionName, uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          await updateDoc(userDocRef, { state: "Inactive" });
        }
      }

      await auth.signOut();
      localStorage.removeItem("loginStartTime");
      localStorage.removeItem("uid");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      localStorage.removeItem("profileImg");

      navigate("/");
    } catch (err) {
      toast.error("Logout failed. Check console.");
      console.error(err);
    }
  };

  return (
    <nav className="px-4 sm:px-6 py-4 sticky top-0 z-[1000] w-full bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF] shadow-xl shadow-slate-400">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <NavLink
          to="/Dashboard"
          className="text-4xl font-extrabold text-red-950"
        >
          
        </NavLink>
        <div className="flex items-center gap-4 relative">
          <div
            className="relative cursor-pointer"
            onClick={() => setShowNotification(true)}
          >
            <Bell className="w-7 h-7 text-yellow-950 hover:scale-110 transition" />
            {notifCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {notifCount}
              </span>
            )}
          </div>
          <div className="px-3 py-1 bg-gray-700 rounded text-lg text-white font-mono tracking-wider">
            {timer}
          </div>
          <span className="text-red-950 font-semibold">{username}</span>
          <div className="relative">
            <div
              className="w-8 h-8 rounded-full bg-black overflow-hidden cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src={profileImg}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {showDropdown && (
              <div
                className="absolute right-0 mt-2 w-44 rounded-2xl bg-blue-200/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(30,64,175,0.35)] 
                    border border-blue-950/40 hover:shadow-[0_30px_70px_rgba(30,64,175,0.45)] transition-all duration-300 overflow-hidden text-red-950 font-bold"
              >
                <NavLink
                  to="/ProfilePage"
                  className="block px-4 py-2 hover:bg-cyan-500 hover:text-black transition"
                  onClick={() => setShowDropdown(false)}
                >
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showNotification && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-24 z-[2000]">
          <div className="bg-[#312834] w-full max-w-md rounded-xl shadow-lg p-4 relative">
            <X
              className="absolute top-3 right-3 text-red-500 cursor-pointer hover:scale-110"
              onClick={() => setShowNotification(false)}
            />
            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              Notifications
            </h2>
            <NotificationPage />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
