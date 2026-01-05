import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc, addDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
/* ================= UTIL FUNCTIONS ================= */

const generateTeamCode = () => {
  const caps = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "0123456789";

  let code = "";
  for (let i = 0; i < 3; i++) code += caps[Math.floor(Math.random() * caps.length)];
  for (let i = 0; i < 3; i++) code += nums[Math.floor(Math.random() * nums.length)];
  return code;
};

const getTodayDate = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

/* ================= MAIN COMPONENT ================= */

export default function CreateTeam() {
  const uid = localStorage.getItem("uid");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username"); 

  const [teamCode, setTeamCode] = useState(generateTeamCode());
  const [teamName, setTeamName] = useState("");
  const [teamType, setTeamType] = useState("");
  const [creatorName, setCreatorName] = useState(username || "");

  const [membersList, setMembersList] = useState([]);

  const [member1, setMember1] = useState("");
  const [member2, setMember2] = useState("");
  const [member3, setMember3] = useState("");
  const [member4, setMember4] = useState("");
  const [member5, setMember5] = useState("");

  const [memberIDs, setMemberIDs] = useState(["", "", "", "", ""]);

  /* ================= FETCH MEMBERS ================= */
  useEffect(() => {
    const fetchMembers = async () => {
      const snap = await getDocs(collection(db, "Members"));
      const list = snap.docs.map((d) => ({
        userID: d.data().userID,
        username: d.data().username,
      }));
      setMembersList(list);
    };
    fetchMembers();
  }, []);

  /* ================= CLEAR FORM ================= */
  const clearForm = () => {
    setTeamName("");
    setTeamType("");
    setMember1("");
    setMember2("");
    setMember3("");
    setMember4("");
    setMember5("");
    setMemberIDs(["", "", "", "", ""]);
    setTeamCode(generateTeamCode());
  };

  /* ================= HANDLE SAVE ================= */
  const handleSave = async () => {
    if (!teamName || !teamType) {
      toast.error("Team Name & Team Type are required");
      return;
    }

    // Map selected members to their IDs
    const mapMemberID = (name) => {
      const m = membersList.find((mem) => mem.username === name);
      return m ? m.userID : "";
    };

    const mIDs = [
      mapMemberID(member1),
      mapMemberID(member2),
      mapMemberID(member3),
      mapMemberID(member4),
      mapMemberID(member5),
    ];
    setMemberIDs(mIDs);

    /* ================= TEAMS COLLECTION ================= */
    await addDoc(collection(db, "Teams"), {
      teamcode: teamCode,
      teamname: teamName,
      teamtype: teamType,

      headuid: uid,
      headusername: username,
      headrole: "Head",

      member1uid: mIDs[0],
      member1username: member1,
      member1role: member1 ? "Member" : "",

      member2uid: mIDs[1],
      member2username: member2,
      member2role: member2 ? "Member" : "",

      member3uid: mIDs[2],
      member3username: member3,
      member3role: member3 ? "Member" : "",

      member4uid: mIDs[3],
      member4username: member4,
      member4role: member4 ? "Member" : "",

      member5uid: mIDs[4],
      member5username: member5,
      member5role: member5 ? "Member" : "",

      createdAt: getTodayDate(),
    });

    /* ================= NOTIFICATIONS COLLECTION ================= */
    await addDoc(collection(db, "notifications"), {
      createdAt: new Date(),
      title: `Team ${teamName}`,
      fromUsername: username,
      fromUserId: uid,
      frommessage: `You have Created a New Team (${teamName}) with 5 Members.`,
      fromreadreceipt: false,

      toTeamName: teamName,
      toTeamMemberId: mIDs,
      toTeammessage: `You were Added in a New Team by ${username}`,
      toTeamreadreceipt: mIDs.map(() => false),
    });

    toast.success("✅ Team Created Successfully");
    clearForm();
  };

  /* ================= UI ================= */

  const MemberSelect = ({ value, setValue, label }) => (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>
      <select
        className="w-full p-2 rounded bg-[#312834] text-white"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        <option value="">Select Member</option>
        {membersList.map((m, i) => (
          <option key={i} value={m.username}>
            {m.username}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 min-h-screen p-6 sm:p-10 bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF] text-red-950">
          <h1 className="text-3xl font-bold text-center mb-2">
            CREATE TEAM
          </h1>
          
          <div className="flex flex-col items-center mb-8 border-b w-full border-gray-300 pb-6 
            bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF] shadow-md"> </div>
          
          <div className="px-64">
            <div className="rounded-2xl bg-blue-200/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(30,64,175,0.35)] 
            border border-blue-950/40 p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block mb-1 font-semibold">Team Code</label>
              <input
                value={teamCode}
                disabled
                className="w-full p-2 rounded bg-[#312834] text-white"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Team Name</label>
              <input
                className="w-full p-2 rounded bg-[#312834] text-white"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Team Type</label>
              <input
                className="w-full p-2 rounded bg-[#312834] text-white"
                value={teamType}
                onChange={(e) => setTeamType(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Creator Name</label>
              <input
                value={username}
                disabled
                className="w-full p-2 rounded bg-[#312834] text-white"
              />
            </div>

            <MemberSelect label="Member 1" value={member1} setValue={setMember1} />
            <MemberSelect label="Member 2" value={member2} setValue={setMember2} />
            <MemberSelect label="Member 3" value={member3} setValue={setMember3} />
            <MemberSelect label="Member 4" value={member4} setValue={setMember4} />
            <MemberSelect label="Member 5" value={member5} setValue={setMember5} />

            <div className="col-span-full flex justify-end gap-4 mt-4">
              <button
                onClick={clearForm}
                className="px-6 py-2 bg-gray-600 text-white rounded"
              >
                Clear
              </button>

              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 text-white rounded"
              >
                Save Team
              </button>
            </div>
          </div>
          </div>
        </main>
      </div>
      </div>
    </>
  );
}
