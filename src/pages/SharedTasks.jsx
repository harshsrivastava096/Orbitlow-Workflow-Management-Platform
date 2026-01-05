import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { DoorOpen, ArrowLeft, ClipboardList } from "lucide-react";

const formatDate = (val) => {
  if (!val) return "N/A";
  if (val?.seconds) return new Date(val.seconds * 1000).toLocaleDateString();
  return val;
};

export default function SharedTasks() {
  const uid = localStorage.getItem("uid");

  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const [filters, setFilters] = useState({
    teamName: "",
    taskNumber: "",
    status: "",
  });

  /* ================= DEFAULT FETCH (STEP 3) ================= */
  useEffect(() => {
    fetchTasksFromCollections(["running", "upcoming", "completed", "overdue"]);
  }, []);

  const fetchTasksFromCollections = async (collections) => {
    let temp = [];

    for (let col of collections) {
      const snap = await getDocs(collection(db, col));
      snap.forEach((doc) => {
        const t = doc.data();
        const matched =
          t.userID === uid ||
          (Array.isArray(t.assignedToTeamMemberID) &&
            t.assignedToTeamMemberID.includes(uid));

        if (matched) temp.push({ id: doc.id, statusCollection: col, ...t });
      });
    }

    setTasks(temp);
    setFiltered(temp);
  };

  /* ================= FILTER LOGIC (FIXED) ================= */
  useEffect(() => {
    let temp = [...tasks];

    // Filter 1: Team Name
    if (filters.teamName) {
      temp = temp.filter(
        (t) =>
          t.assignedToTeamName &&
          t.assignedToTeamName
            .toLowerCase()
            .includes(filters.teamName.toLowerCase())
      );
    }

    // Filter 2: Task Number
    if (filters.taskNumber) {
      temp = temp.filter(
        (t) =>
          t.taskNumber &&
          t.taskNumber
            .toLowerCase()
            .includes(filters.taskNumber.toLowerCase())
      );
    }

    // Filter 3: Status
    if (filters.status) {
      temp = temp.filter((t) => t.statusCollection === filters.status);
    }

    setFiltered(temp);
  }, [filters, tasks]);

  const priorityColor = (p) => {
    if (p === "High") return "bg-red-500";
    if (p === "Medium") return "bg-yellow-400";
    if (p === "Low") return "bg-green-400";
    return "bg-gray-400";
  };

  return (
    <>
      <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="lex-1 min-h-screen p-6 bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF] text-red-950">
          {/* ================= HEADING ================= */}
          <h1 className="text-3xl font-bold text-center mb-2">
            SHARED TASKS
          </h1>
          <p className="text-center text-gray-700 mb-1">
            Here you can access your all the tasks in which you are working under a Team
          </p>
          <div className="flex flex-col items-center mb-8 border-b w-full border-gray-300 pb-6 
            bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF] shadow-md"> 
          </div>
          {/* ================= FILTER FORMAT ================= */}
          <div className="space-y-4 px-">
            <div className="flex items-center gap-3 mb-6 rounded-2xl bg-[#312834] backdrop-blur-xl shadow-[0_20px_50px_rgba(30,64,175,0.35)] 
                    border border-blue-950/40 hover:shadow-[0_30px_70px_rgba(30,64,175,0.45)] transition-all duration-300 p-4">
            <input
              placeholder="Team Name"
              value={filters.teamName}
              onChange={(e) =>
                setFilters({ ...filters, teamName: e.target.value })
              }
              className="p-2 border-l-gold-500 rounded w-1/3"
            />
            <span className="font-bold">||</span>
            <input
              placeholder="Task Number"
              value={filters.taskNumber}
              onChange={(e) =>
                setFilters({ ...filters, taskNumber: e.target.value })
              }
              className="p-2 border rounded w-1/3"
            />
            <span className="font-bold">||</span>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="p-2 border rounded w-1/3"
            >
              <option value="">Select Status</option>
              <option value="running">Running</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          </div>

          {/* ================= TASK CARDS ================= */}
          <div className="space-y-4 px-24">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="flex items-center rounded-2xl bg-blue-200/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(30,64,175,0.35)] 
                    border border-blue-950/40 hover:shadow-[0_30px_70px_rgba(30,64,175,0.45)] transition-all duration-300 p-4 mb-4"
              >
                {/* Box 1 */}
                <ClipboardList size={28} />

                {/* Box 2 */}
                <div className="flex-1 px-6">
                  <p className="font-bold text-yellow-600">{t.taskNumber}</p>
                  <p className="font-bold text-red-500">{t.title}</p>
                  <p>{t.type}</p>
                  <p>Deadline: {formatDate(t.dueDate)}</p>
                </div>

                {/* Box 3 */}
                <span
                  className={`px-3 py-1 rounded text-white ${priorityColor(
                    t.priority
                  )}`}
                >
                  {t.priority}
                </span>

                {/* Box 4 */}
                <DoorOpen
                  className="ml-6 cursor-pointer"
                  onClick={() => setSelectedTask(t)}
                />
              </div>
            ))}
          </div>

          {/* ================= TASK DETAILS CARD ================= */}
          {selectedTask && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="w-[750px] bg-[#312834] p-6 rounded-2xl text-white">
                <div className="flex items-center gap-3 mb-4">
                  <ArrowLeft
                    className="cursor-pointer"
                    onClick={() => setSelectedTask(null)}
                  />
                  <h2 className="text-xl font-bold">Task Details</h2>
                </div>

                <DetailRow
                  a="Task Number"
                  av={selectedTask.taskNumber}
                  b="Task Title"
                  bv={selectedTask.title}
                  c="Task Type"
                  cv={selectedTask.type}
                />

                <DetailRow
                  a="Priority"
                  av={selectedTask.priority}
                  b="Status"
                  bv={selectedTask.statusCollection}
                />

                <DetailRow
                  a="Creator"
                  av={selectedTask.creator}
                  b="Assigned to Team"
                  bv={selectedTask.assignedToTeamName}
                />

                <DetailRow
                  a="Assigned Date"
                  av={formatDate(selectedTask.startDate)}
                  b="Deadline"
                  bv={formatDate(selectedTask.dueDate)}
                />

                <div className="mt-4 border p-3">
                  <p className="font-semibold mb-1 text-yellow-300">Task Description</p>
                  <p>{selectedTask.description}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      </div>
    </>
  );
}

/* ================= DETAIL ROW ================= */
const DetailRow = ({ a, av, b, bv, c, cv }) => (
  <div className="grid grid-cols-3 gap-4 border-b py-2">
    <div>
      <p className="font-semibold text-yellow-300">{a}</p>
      <p>{av}</p>
    </div>
    <div>
      <p className="font-semibold text-yellow-300">{b}</p>
      <p>{bv}</p>
    </div>
    {c && (
      <div>
        <p className="font-semibold text-yellow-300">{c}</p>
        <p>{cv}</p>
      </div>
    )}
  </div>
);
