import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function LoginRecord() {
  const [activeTab, setActiveTab] = useState("Admins");
  const [search, setSearch] = useState("");
  const [admins, setAdmins] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const adminSnap = await getDocs(collection(db, "Heads"));
      const memberSnap = await getDocs(collection(db, "Members"));

      setAdmins(adminSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setMembers(memberSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchData();
  }, []);

  const getAvatar = (gender) => {
    if (gender === "Male") return "/Male.png";
    if (gender === "Female") return "/Female.png";
    return "/User.png";
  };

  const rawData = activeTab === "Admins" ? admins : members;

  // Search + Active on top
  const data = rawData
    .filter(u =>
      u.fullname?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      a.state === "Active" && b.state !== "Active" ? -1 : 1
    );

  const totalEmployee = rawData.length;
  const activeEmployee = rawData.filter(u => u.state === "Active").length;

  return (
    <>
      <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 min-h-screen p-10 bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF] text-red-950">
          {/* Heading */}
          {/* <h1 className="text-3xl font-bold mb-6">Login Records</h1> */}

          {/* Toggle + Search */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("Admins")}
                className={`px-6 py-2 rounded ${
                  activeTab === "Admins"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-400"
                }`}
              >
                Admins
              </button>
              <button
                onClick={() => setActiveTab("Members")}
                className={`px-6 py-2 rounded ${
                  activeTab === "Members"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-400"
                }`}
              >
                Members
              </button>
            </div>

            <input
              type="text"
              placeholder="Search by name"
              className="px-4 py-2 rounded border w-64"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Stats */}
          <div className="flex justify-end gap-6 mb-4">
            <div className="bg-[#312834] text-white px-6 py-2 rounded">
              Total Employee: {totalEmployee}
            </div>
            <div className="bg-[#312834] text-white px-6 py-2 rounded">
              LoggedIn Employee: {activeEmployee}
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#312834] p-6 rounded-xl shadow-lg text-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3">Photo</th>
                  <th className="text-left py-3">Name</th>
                  <th className="text-left py-3">Username</th>
                  <th className="text-left py-3">Mobile</th>
                  <th className="text-left py-3 pr-20">Email</th>
                  <th className="text-right py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {data.map(user => (
                  <tr
                    key={user.id}
                    className="border-b border-white/10"
                  >
                    <td className="py-3">
                      <img
                        src={getAvatar(user.gender)}
                        alt="avatar"
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td>{user.fullname || "-"}</td>
                    <td>{user.username || "-"}</td>
                    <td>{user.mobileNumber || "-"}</td>
                    <td className="pr-20">{user.email || "-"}</td>
                    <td className="text-right">
                      <span
                        className={`px-4 py-1 rounded-full text-sm ${
                          user.state === "Active"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {user.state || "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      </div>
    </>
  );
}
