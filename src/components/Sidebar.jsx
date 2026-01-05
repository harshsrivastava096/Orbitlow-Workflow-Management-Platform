import { NavLink, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Files,
  CheckCircle,
  Calendar,
  AlertCircle,
  PlusCircle,
  Users,
  FileText,
  LogIn,
  HelpCircle,
  UsersRound,
  User,
  Headphones,
} from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  // ======Sections Opening==== 
  const [openSection, setOpenSection] = useState(
    () => localStorage.getItem("openSection") || null
  );

  const toggleSection = (key) => {
    setOpenSection((prev) => {
      const newValue = prev === key ? null : key;

      if (newValue) {
        localStorage.setItem("openSection", newValue);
      } else {
        localStorage.removeItem("openSection");
      }

      return newValue;
    });
  };

  // ===== Local Storage Data =====
  const uid = localStorage.getItem("uid");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username") || "";

  // ===== Profile Image =====
  const [profileImg, setProfileImg] = useState(
    localStorage.getItem("profileImg") || "/User.png"
  );

  useEffect(() => {
    const fetchGender = async () => {
      if (!uid || !role) return;

      try {
        const collectionName = role === "Member" ? "Members" : "Heads";
        const snap = await getDoc(doc(db, collectionName, uid));

        if (snap.exists()) {
          const gender = snap.data().gender;

          let img = "/User.png";
          if (gender === "Male") img = "/Male.png";
          else if (gender === "Female") img = "/Female.png";

          setProfileImg(img);
          localStorage.setItem("profileImg", img);
        }
      } catch (err) {
        console.error("Error fetching gender:", err);
      }
    };

    fetchGender();
  }, [uid, role]);

  const headMenu = [
    { to: "/Dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
    { to: "/RunningTasks", label: "Running Tasks", icon: <Files /> },
    { to: "/UpcomingTasks", label: "Upcoming Tasks", icon: <Calendar /> },
    { to: "/OverdueTasks", label: "Overdue Tasks", icon: <AlertCircle /> },
    { to: "/CompletedTasks", label: "Completed Tasks", icon: <CheckCircle /> },
    { to: "/SharedTasks", label: "Shared Tasks", icon: <FileText /> },
    { to: "/CreateTask", label: "Create Tasks", icon: <PlusCircle /> },
    { to: "/CreateTeamPage", label: "Create Team", icon: <UsersRound /> },
    { to: "/MyTeams", label: "My Teams", icon: <Users /> },
    { to: "/LoginRecord", label: "Login Record", icon: <LogIn /> },
    { to: "/ProfilePage", label: "Profile", icon: <User /> },
    { to: "/About", label: "About", icon: <HelpCircle /> },
    { to: "/Contact", label: "Contact", icon: <Headphones /> },
  ];

  const memberMenu = [
    { to: "/Dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
    { to: "/RunningTasks", label: "Running Tasks", icon: <Files /> },
    { to: "/UpcomingTasks", label: "Upcoming Tasks", icon: <Calendar /> },
    { to: "/OverdueTasks", label: "Overdue Tasks", icon: <AlertCircle /> },
    { to: "/CompletedTasks", label: "Completed Tasks", icon: <CheckCircle /> },
    { to: "/SharedTasks", label: "Shared Tasks", icon: <FileText /> },
    { to: "/CreateTask", label: "Create Tasks", icon: <PlusCircle /> },
    { to: "/MyTeams", label: "My Teams", icon: <Users /> },
    { to: "/ProfilePage", label: "Profile", icon: <User /> },
    { to: "/About", label: "About", icon: <HelpCircle /> },
    { to: "/Contact", label: "Contact", icon: <Headphones /> },
  ];

  const menuItems = role === "Member" ? memberMenu : headMenu;

  return (
    <aside className="w-54 bg-[#312834] text-white flex flex-col p-6 sticky top-0 left-0 min-h-screen border-r border-slate-800 shadow-[4px_0_20px_rgba(0,0,0,0.6)]">
      <NavLink
        to="/Dashboard"
        className="text-3xl font-extrabold text-black mb-1 text-center border border-gray-500 rounded p-2 bg-white"
      >
        ORBITLAW
      </NavLink>
      <div className="border-b w-full border-gray-300 shadow-md mb-3"> </div>
      {/* ===== USER PROFILE ===== */}
      {/* <div className="flex flex-col items-center mb-8 border-b border-gray-600 pb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-400">
            <img
              src={profileImg}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="mt-3 text-lg font-semibold">{username}</p>
        </div> */}

      {/* ===== MENU LIST ===== */}
      {/* <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.to + item.label}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                location.pathname === item.to
                  ? "bg-[#dbbce6] text-black font-semibold"
                  : "hover:bg-[#4a404d]"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav> */}

      <nav className="flex flex-col gap-6">
        {/* ===== OVERVIEW ===== */}
        <div>
          <div
            className="flex items-center justify-between px-4 mb-2 cursor-pointer"
            onClick={() => toggleSection("overview")}
          >
            <p className="text-sm font-bold tracking-wider text-gray-300">
              OVERVIEW
            </p>
            {openSection === "overview" ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </div>

          {openSection === "overview" &&
            menuItems
              .filter((i) => i.label === "Dashboard")
              .map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-6 py-2 text-sm rounded-lg transition ${
                    location.pathname === item.to
                      ? "bg-[#dbbce6] text-black font-semibold"
                      : "hover:bg-[#4a404d]"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
        </div>

        {/* ===== TASKS ===== */}
        <div>
          <div
            className="flex items-center justify-between px-4 mb-2 cursor-pointer"
            onClick={() => toggleSection("tasks")}
          >
            <p className="text-sm font-bold tracking-wider text-gray-300">
              TASKS
            </p>
            {openSection === "tasks" ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </div>

          {openSection === "tasks" &&
            menuItems
              .filter((i) =>
                [
                  "Running Tasks",
                  "Upcoming Tasks",
                  "Overdue Tasks",
                  "Completed Tasks",
                  "Shared Tasks",
                  "Create Tasks",
                ].includes(i.label)
              )
              .map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-6 py-2 text-sm rounded-lg transition ${
                    location.pathname === item.to
                      ? "bg-[#dbbce6] text-black font-semibold"
                      : "hover:bg-[#4a404d]"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
        </div>

        {/* ===== TEAMS ===== */}
        <div>
          <div
            className="flex items-center justify-between px-4 mb-2 cursor-pointer"
            onClick={() => toggleSection("teams")}
          >
            <p className="text-sm font-bold tracking-wider text-gray-300">
              TEAMS
            </p>
            {openSection === "teams" ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </div>

          {openSection === "teams" &&
            menuItems
              .filter((i) => ["Create Team", "My Teams"].includes(i.label))
              .map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-6 py-2 text-sm rounded-lg transition ${
                    location.pathname === item.to
                      ? "bg-[#dbbce6] text-black font-semibold"
                      : "hover:bg-[#4a404d]"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
        </div>

        {/* ===== ACCOUNT ===== */}
        <div>
          <div
            className="flex items-center justify-between px-4 mb-2 cursor-pointer"
            onClick={() => toggleSection("account")}
          >
            <p className="text-sm font-bold tracking-wider text-gray-300">
              ACCOUNT
            </p>
            {openSection === "account" ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </div>

          {openSection === "account" &&
            menuItems
              .filter((i) =>
                ["Login Record", "Profile", "About", "Contact"].includes(
                  i.label
                )
              )
              .map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-6 py-2 text-sm rounded-lg transition ${
                    location.pathname === item.to
                      ? "bg-[#dbbce6] text-black font-semibold"
                      : "hover:bg-[#4a404d]"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
        </div>
      </nav>
    </aside>
  );
}
