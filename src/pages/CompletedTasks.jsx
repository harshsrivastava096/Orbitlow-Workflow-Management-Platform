import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { DoorOpen, ArrowLeft, ClipboardList } from "lucide-react";
import {toast} from "react-hot-toast"

export default function CompletedTasks() {
  const uid = localStorage.getItem("uid");
  const role = localStorage.getItem("role");

  const [completedTasks, setCompletedTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      if (!uid) return;

      try {
        const snap = await getDocs(collection(db, "completed"));
        const tasks = [];

        snap.forEach((d) => {
          const t = d.data();
          const uids = [
            t.userID,
            t.assignedToMemberID,
            ...(Array.isArray(t.assignedToTeamMemberID)
              ? t.assignedToTeamMemberID
              : []),
          ];

          if (uids.includes(uid)) {
            tasks.push({ id: d.id, ...t });
          }
        });

        setCompletedTasks(tasks);
      } catch (err) {
        toast.error("Error fetching completed tasks:", err);
      }
    };

    fetchCompletedTasks();
  }, [uid]);

  const priorityColor = (p) => {
    if (p === "High") return "bg-red-500";
    if (p === "Medium") return "bg-yellow-400";
    if (p === "Low") return "bg-green-400";
    return "bg-gray-400";
  };

  const handleRemove = async (task) => {
    try {
      await deleteDoc(doc(db, "completed", task.id));
      setCompletedTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const individualTasks = completedTasks.filter((t) => t.assignedToMemberName);
  const collaborativeTasks = completedTasks.filter((t) => t.assignedToTeamName);

  const formatDate = (val) => {
    if (!val) return "N/A";
    if (val?.seconds) return new Date(val.seconds * 1000).toLocaleDateString();
    return val;
  };

  const renderDescription = (text) => {
    if (!text) return "N/A";
    return text.split(/\s+/).map((word, i) =>
      /^(https?:\/\/|www\.)\S+$/.test(word) ? (
        <a
          key={i}
          href={word.startsWith("http") ? word : "https://" + word}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {word}{" "}
        </a>
      ) : (
        word + " "
      )
    );
  };

  return (
    <>
      <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Navbar />

        <main className="flex-1 min-h-screen p-6 bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF] text-red-950">
          <h1 className="text-3xl font-bold text-center mb-2">
            COMPLETED TASKS
          </h1>
          <p className="text-center text-gray-700 mb-1">
            Here you can access your all the Tasks which you have already Completed.
          </p>
          <div className="flex flex-col items-center mb-8 border-b w-full border-gray-300 pb-6 
            bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF] shadow-md"> </div>
          {/* Individual Tasks */}
          <h2 className="text-xl font-bold mb-4">Individual Tasks</h2>
          <div className="px-24">
            {individualTasks.length > 0 ? (
            individualTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  priorityColor={priorityColor}
                  onOpen={() => setSelectedTask(t)}
              />
            ))
          ) : (
            <p className="text-gray-500 mb-6">No individual tasks found.</p>
          )}
          </div>

          {/* Collaborative Tasks */}
          <h2 className="text-xl font-bold mt-10 mb-4">Collaborative Tasks</h2>
          <div className="px-24">
            {collaborativeTasks.length > 0 ? (
            collaborativeTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  priorityColor={priorityColor}
                  onOpen={() => setSelectedTask(t)}
              />
            ))
          ) : (
            <p className="text-gray-500 mb-6">No collaborative tasks found.</p>
          )}
          </div>

          {completedTasks.length === 0 && (
            <p className="text-center text-gray-500 mt-10">
              No completed tasks found.
            </p>
          )}
        </main>

        {/* Task Details Modal */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="w-[750px] p-6 mt-24 rounded-2xl bg-[#312834] backdrop-blur-xl shadow-[0_20px_50px_rgba(30,64,175,0.35)] 
                  border border-blue-950/40 hover:shadow-[0_30px_70px_rgba(30,64,175,0.45)] transition-all duration-300 text-red-950">
              <div className="flex items-center gap-4 mb-4">
                <ArrowLeft
                  className="cursor-pointer text-white"
                  onClick={() => setSelectedTask(null)}
                />
                <h2 className="text-xl font-bold text-white">Task Details</h2>
              </div>

              <DetailRow
                a="Task Number"
                av={<span className="text-white">{selectedTask.taskNumber}</span>}
                b="Task Title"
                bv={<span className="text-white">{selectedTask.title}</span>}
                c="Task Type"
                cv={<span className="text-white">{selectedTask.type}</span>}
              />
              <DetailRow
                a="Priority"
                av={<span className="text-white">{selectedTask.priority}</span>}
                b="Status"
                bv={<span className="text-white">{selectedTask.status}</span>}
              />
              <DetailRow
                a="Creator"
                av={<span className="text-white">{selectedTask.creator}</span>}
                b={selectedTask.assignedToMemberName ? "Assigned To" : "Assigned To Team"}
                bv={
                  <span className="text-white">
                    {selectedTask.assignedToMemberName || selectedTask.assignedToTeamName}
                  </span>
                }
              />
              <DetailRow
                a="Assigned Date"
                av={<span className="text-white">{formatDate(selectedTask.startDate)}</span>}
                b="Deadline"
                bv={<span className="text-white">{formatDate(selectedTask.dueDate)}</span>}
              />

              <div className="border p-3 mt-3 max-h-60 overflow-y-auto">
                <p className="font-semibold mb-1 text-yellow-300">Task Description</p>
                <p className="text-white">{renderDescription(selectedTask.description)}</p>
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => handleRemove(selectedTask)}
                  className="px-6 py-2 bg-red-500 rounded text-white"
                >
                  Move to Trash
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
}

/* ================= TASK CARD COMPONENT ================= */
const TaskCard = ({ task, priorityColor, onOpen }) => (
  <div className="flex items-center rounded-2xl bg-blue-200/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(30,64,175,0.35)] 
        border border-blue-950/40 hover:shadow-[0_30px_70px_rgba(30,64,175,0.45)] transition-all duration-300 p-4 mb-4">
    <ClipboardList size={28} />
    <div className="px-4"></div>
    <div className="flex-1">
      <p className="font-bold text-yellow-600">{task.taskNumber}</p>
      <p className="font-semibold text-red-500">{task.title}</p>
      <p className="text-red-950">{task.type}</p>
      <p className="text-red-950">Deadline: {task.dueDate?.toDate ? task.dueDate.toDate().toLocaleDateString() : task.dueDate}</p>
    </div>
    <span className={`px-3 py-1 rounded text-white ${priorityColor(task.priority)}`}>
      {task.priority}
    </span>
    <div className="px-4"></div>
    <DoorOpen className="cursor-pointer" onClick={onOpen} />
  </div>
);

/* ================= DETAIL ROW COMPONENT ================= */
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
