import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";

/* ================== UTIL FUNCTIONS ================== */
const generateTaskNumber = () => {
  const caps = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "0123456789";
  let code = "";

  for (let i = 0; i < 2; i++) code += caps[Math.floor(Math.random() * caps.length)];
  for (let i = 0; i < 3; i++) code += nums[Math.floor(Math.random() * nums.length)];
  for (let i = 0; i < 2; i++) code += caps[Math.floor(Math.random() * caps.length)];

  return code; // AS101CV
};

export default function AddTask() {
  const uid = localStorage.getItem("uid");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([]);

  const [assignerID, setAssignerID] = useState(""); // For Assigned To Member
  const [memberIDs, setMemberIDs] = useState([]); // For Assigned To Team

  const [disableMember, setDisableMember] = useState(false);
  const [disableTeam, setDisableTeam] = useState(false);

  const [taskData, setTaskData] = useState({
    title: "",
    taskNumber: generateTaskNumber(),
    type: "",
    status: "",
    priority: "",
    startDate: null,
    dueDate: null,
    creator: username || "",
    assignedToMember: "",
    assignedToTeam: "",
    description: "",
  });

  /* ================== FETCH MEMBERS ================== */
  useEffect(() => {
    const fetchMembers = async () => {
      const snap = await getDocs(collection(db, "Members"));
      const list = snap.docs.map((d) => ({
        uid: d.data().userID || d.id,
        username: d.data().username,
      }));
      setMembers(list);
    };
    fetchMembers();
  }, []);

  /* ================== FETCH TEAMS (HEAD ONLY) ================== */
  useEffect(() => {
    if (role !== "Head") return;
    const fetchTeams = async () => {
      const snap = await getDocs(collection(db, "Teams"));
      const list = snap.docs.map((d) => d.data());
      setTeams(list);
    };
    fetchTeams();
  }, [role]);

  /* ================== HANDLERS ================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Alphabets only validation
    if ((name === "title" || name === "type") && !/^[a-zA-Z ]*$/.test(value)) return;

    // Mutual exclusion
    if (name === "assignedToMember") {
      setDisableTeam(!!value);
      setAssignerID(""); // Reset temporary ID on change
    }
    if (name === "assignedToTeam") {
      setDisableMember(!!value);
      setMemberIDs([]); // Reset temporary IDs on change
    }

    setTaskData({ ...taskData, [name]: value });
  };

  const handleMemberSelect = async (usernameSelected) => {
    setTaskData({ ...taskData, assignedToMember: usernameSelected });
    setDisableTeam(true);

    // Find AssignerID from Heads + Members
    const collectionsToCheck = ["Heads", "Members"];
    let foundID = "";
    for (let col of collectionsToCheck) {
      const snap = await getDocs(collection(db, col));
      snap.docs.forEach((d) => {
        if (d.data().username === usernameSelected) foundID = d.id;
      });
      if (foundID) break;
    }
    setAssignerID(foundID);
  };

  const handleTeamSelect = (teamName) => {
    setTaskData({ ...taskData, assignedToTeam: teamName });
    setDisableMember(true);

    const team = teams.find((t) => t.teamname === teamName);
    if (!team) {
      setMemberIDs([]);
      return;
    }

    setMemberIDs([
      team.member1uid || "",
      team.member2uid || "",
      team.member3uid || "",
      team.member4uid || "",
      team.member5uid || "",
    ]);
  };

  const clearForm = () => {
    setTaskData({
      title: "",
      taskNumber: generateTaskNumber(),
      type: "",
      status: "",
      priority: "",
      startDate: null,
      dueDate: null,
      creator: username || "",
      assignedToMember: "",
      assignedToTeam: "",
      description: "",
    });
    setMemberIDs([]);
    setAssignerID("");
    setDisableMember(false);
    setDisableTeam(false);
  };

  /* ================== SUBMIT ================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      title,
      type,
      taskNumber,
      status,
      priority,
      startDate,
      dueDate,
      assignedToMember,
      assignedToTeam,
      description,
    } = taskData;

    // Mandatory fields check
    if (!title || !type || !taskNumber || !status || !priority || !startDate || !dueDate) {
      toast.error("Please fill all required fields");
      return;
    }

    // Must have either Member or Team
    if (!assignedToMember && !assignedToTeam) {
      toast.error("Please assign task to a Member or a Team");
      return;
    }

    /* ---- Save Task ---- */
    await addDoc(collection(db, status), {
      title,
      type,
      taskNumber,
      status,
      priority,
      startDate,
      dueDate,
      creator: taskData.creator,
      assignedToMemberName: assignedToMember || "",
      assignedToMemberID: assignerID || "",
      assignedToTeamName: assignedToTeam || "",
      assignedToTeamMemberID: memberIDs,
      description,
      userID: uid,
      username: taskData.creator,
      createdAt: serverTimestamp(),
    });

    /* ---- Notification ---- */
    let frommessage = "";
    if (assignedToMember)
      frommessage = `You have Assigned a Task to ${assignedToMember}`;
    else if (assignedToTeam)
      frommessage = `You have Assigned a Task to Team ${assignedToTeam}`;

    await addDoc(collection(db, "notifications"), {
      createdAt: serverTimestamp(),
      title,
      fromUsername: taskData.creator,
      fromUserId: uid,
      frommessage,
      fromreadreceipt: false,
      toMemberName: assignedToMember || "",
      toMemberId: assignerID,
      toMemberreadreceipt: false,
      toMembermessage: assignedToMember
        ? `A Task is Assigned to You by ${taskData.creator}`
        : "",
      toTeamName: assignedToTeam || "",
      toTeamMemberId: assignedToTeam ? memberIDs : [],
      toTeamreadreceipt: assignedToTeam ? memberIDs.map(() => false) : [],
      toTeammessage: assignedToTeam
        ? `A Task is Assigned to Your Team (${assignedToTeam}) by ${taskData.creator}`
        : "",
    });

    toast.success("Task Created Successfully");
    clearForm();
  };

  /* ================== UI ================== */
  return (
    <>
      <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 min-h-screen p-6 sm:p-10 bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF] text-red-950">
          <h1 className="text-3xl font-bold mb-6 text-center">CREATE NEW TASK</h1>
          <div className="flex flex-col items-center mb-8 border-b w-full border-gray-300 pb-6 
            bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF] shadow-md"> </div>
          <div className="px-64">
            <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-blue-200/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(30,64,175,0.35)]
            border border-blue-950/40 p-6 space-y-6 max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-semibold">Task Title *</label>
                <input
                  name="title"
                  value={taskData.title}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-[#312834] text-white"
                />
              </div>

              <div>
                <label className="font-semibold">Task Number *</label>
                <input
                  value={taskData.taskNumber}
                  disabled
                  className="w-full p-3 rounded bg-[#312834] text-white"
                />
              </div>

              <div>
                <label className="font-semibold">Task Type *</label>
                <input
                  name="type"
                  value={taskData.type}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-[#312834] text-white"
                />
              </div>

              <div>
                <label className="font-semibold">Status *</label>
                <select
                  name="status"
                  value={taskData.status}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-[#312834] text-white"
                >
                  <option value="">Select</option>
                  <option value="running">Running</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>

              <div>
                <label className="font-semibold">Priority *</label>
                <select
                  name="priority"
                  value={taskData.priority}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-[#312834] text-white"
                >
                  <option value="">Select</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="font-semibold">Creator</label>
                <input
                  value={taskData.creator}
                  disabled
                  className="w-full p-3 rounded bg-[#312834] text-white"
                />
              </div>

              <div>
                <label className="font-semibold">Assigned To Member</label>
                <select
                  name="assignedToMember"
                  value={taskData.assignedToMember}
                  onChange={(e) => handleMemberSelect(e.target.value)}
                  disabled={disableMember}
                  className="w-full p-3 rounded bg-[#312834] text-white"
                >
                  <option value="">Select</option>
                  {members.map((m) => (
                    <option key={m.uid} value={m.username}>
                      {m.username}
                    </option>
                  ))}
                </select>
              </div>

              {role === "Head" && (
                <div>
                  <label className="font-semibold">Assigned To Team</label>
                  <select
                    value={taskData.assignedToTeam}
                    onChange={(e) => handleTeamSelect(e.target.value)}
                    disabled={disableTeam}
                    className="w-full p-3 rounded bg-[#312834] text-white"
                  >
                    <option value="">Select</option>
                    {teams.map((t, i) => (
                      <option key={i} value={t.teamname}>
                        {t.teamname}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="font-semibold">Start Date *</label>
                <DatePicker
                  selected={taskData.startDate}
                  onChange={(d) => setTaskData({ ...taskData, startDate: d })}
                  className="w-full p-3 bg-[#312834] text-white"
                />
              </div>

              <div>
                <label className="font-semibold">Due Date *</label>
                <DatePicker
                  selected={taskData.dueDate}
                  onChange={(d) => setTaskData({ ...taskData, dueDate: d })}
                  className="w-full p-3 rounded bg-[#312834] text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-semibold">Task Description</label>
                <textarea
                  rows="4"
                  name="description"
                  value={taskData.description}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-[#312834] text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={clearForm}
                className="px-6 py-2 bg-gray-600 rounded text-white"
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 rounded text-white"
              >
                Save Task
              </button>
            </div>
          </form>
          </div>
        </main>
      </div>
      </div>
    </>
  );
}


