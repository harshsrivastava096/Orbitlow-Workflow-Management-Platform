import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

export default function Dashboard() {
  const uid = localStorage.getItem("uid");

  const [counts, setCounts] = useState({
    running: 0,
    completed: 0,
    upcoming: 0,
    overdue: 0,
    shared: 0,
    totalTeams: 0,
  });

  /* ================= FETCH TASK COUNTS ================= */
  useEffect(() => {
    if (!uid) return;

    const fetchCounts = async () => {
      const taskCols = ["running", "upcoming", "completed", "overdue"];
      let tempCounts = {
        running: 0,
        upcoming: 0,
        completed: 0,
        overdue: 0,
        shared: 0,
        totalTeams: 0,
      };

      // STEP3: Count for 4 main cards
      for (let col of taskCols) {
        const snap = await getDocs(collection(db, col));
        snap.forEach((doc) => {
          const data = doc.data();
          const match =
            data.userID === uid ||
            data.assignedToMemberID === uid ||
            (Array.isArray(data.assignedToTeamMemberID) &&
              data.assignedToTeamMemberID.includes(uid));

          if (match) tempCounts[col]++;
        });
      }

      // STEP4: Shared Tasks
      for (let col of taskCols) {
        const snap = await getDocs(collection(db, col));
        snap.forEach((doc) => {
          const data = doc.data();
          const sharedMatch =
            data.userID === uid ||
            (Array.isArray(data.assignedToTeamMemberID) &&
              data.assignedToTeamMemberID.includes(uid));
          if (sharedMatch) tempCounts.shared++;
        });
      }

      // STEP6: Total Teams
      const teamSnap = await getDocs(collection(db, "Teams"));
      teamSnap.forEach((doc) => {
        const data = doc.data();
        const fields = [
          "headuid",
          "member1uid",
          "member2uid",
          "member3uid",
          "member4uid",
          "member5uid",
        ];
        if (fields.some((f) => data[f] === uid)) {
          tempCounts.totalTeams++;
        }
      });

      setCounts(tempCounts);
    };

    fetchCounts();
  }, [uid]);

  // Derived stats
  const totalTasks =
    counts.running + counts.completed + counts.upcoming + counts.overdue;

  const completionPercent =
    totalTasks === 0 ? 0 : Math.round((counts.completed / totalTasks) * 100);

  const pieData = [
    { name: "Running", value: counts.running },
    { name: "Completed", value: counts.completed },
    { name: "Upcoming", value: counts.upcoming },
    { name: "Overdue", value: counts.overdue },
  ].filter((d) => d.value > 0);

  const barData = [
    { name: "Running", tasks: counts.running },
    { name: "Completed", tasks: counts.completed },
    { name: "Upcoming", tasks: counts.upcoming },
    { name: "Overdue", tasks: counts.overdue },
  ];

  const COLORS = ["#22c55e", "#facc15", "#ef4444", "#22d3ee"];

  // Login Activity Simulation
  const activityData = Array.from({ length: 30 }, () =>
    Math.floor(Math.random() * 5)
  );

  return (
    <>
      <div className="flex">
        {/* Sidebar left */}
        <Sidebar />

        {/* Main content right */}
        <div className="flex-1 min-h-screen bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF] text-red-950">
          <Navbar />
          <main className="flex-1 p-6 md:p-10 text-red-950 space-y-10">
          {/* <h1 className="text-3xl font-bold">Task Management Dashboard</h1> */}

          {/* ================= TOP CARDS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Running Tasks"
              value={counts.running}
              color="cyan"
            />
            <StatCard
              title="Completed Tasks"
              value={counts.completed}
              color="green"
            />
            <StatCard
              title="Upcoming Tasks"
              value={counts.upcoming}
              color="yellow"
            />
            <StatCard
              title="Overdue Tasks"
              value={counts.overdue}
              color="red"
            />
          </div>

          {/* ================= SECOND SECTION ================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MiniStat title="Total Tasks" value={totalTasks} />
            <MiniStat title="Shared Tasks" value={counts.shared} />
            <MiniStat title="Total Teams" value={counts.totalTeams} />
          </div>

          {/* ================= CHARTS ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <div className="p-6 h-[350px] rounded-2xl bg-blue-200/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(30,64,175,0.35)] border border-blue-950/40 hover:shadow-[0_30px_70px_rgba(30,64,175,0.45)] transition-all duration-300">
              <h2 className="text-red-950 font-bold text-2xl mb-4">
                Task Distribution
              </h2>
              {pieData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-red-950 text-center mt-24">
                  No tasks available
                </p>
              )}
            </div>

            {/* Bar Chart */}
            <div className="p-6 h-[350px] overflow-hidden rounded-2xl bg-blue-200/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(30,64,175,0.35)] border border-blue-950/40 hover:shadow-[0_30px_70px_rgba(30,64,175,0.45)] transition-all duration-300">
              <h2 className="text-red-950 font-bold text-2xl mb-4">
                Task Overview
              </h2>
              <div className="w-full h-[260px] text-red-950">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" stroke="#000000" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="tasks"
                      fill="#FFEA00FF"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ================= COMPLETION RING ================= */}
          <div className="p-6 flex flex-col items-center rounded-2xl bg-blue-200/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(30,64,175,0.35)] border border-blue-950/40 hover:shadow-[0_30px_70px_rgba(30,64,175,0.45)] transition-all duration-300">
            <h2 className="text-red-950 font-bold text-xl mb-4">
              Completion Progress
            </h2>
            <div className="relative w-40 h-40">
              <svg className="w-full h-full rotate-[-90deg]">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#4a404d"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#22c55e"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray="440"
                  strokeDashoffset={440 - (440 * completionPercent) / 100}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-red-950 text-2xl font-bold">
                {completionPercent}%
              </div>
            </div>
          </div>

          {/* ================= LOGIN ACTIVITY ================= */}
          <div className="p-6 rounded-2xl bg-blue-200/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(30,64,175,0.35)] border border-blue-950/40 hover:shadow-[0_30px_70px_rgba(30,64,175,0.45)] transition-all duration-300">
            <h2 className="text-red-950 font-bold text-xl mb-4">
              Login Activity (Last 30 Days)
            </h2>
            <div className="grid grid-cols-10 gap-2">
              {activityData.map((v, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded ${
                    v === 0 ? "bg-red-400" : "bg-green-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </main>
        </div>
      </div>
    </>
  );
}

/* ================= COMPONENTS ================= */
function StatCard({ title, value, color }) {
  const map = {
    cyan: "text-cyan-400",
    green: "text-green-400",
    yellow: "text-yellow-400",
    red: "text-red-400",
  };
  return (
    <div className="p-6 text-center rounded-2xl bg-blue-200/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(30,64,175,0.35)] border border-blue-950/40 hover:shadow-[0_30px_70px_rgba(30,64,175,0.45)] transition-all duration-300">
      <p className="text-red-950 mb-2 font-bold text-xl">{title}</p>
      <p className={`text-4xl font-bold ${map[color]}`}>{value}</p>
    </div>
  );
}

function MiniStat({ title, value }) {
  return (
    <div className="p-5 text-center rounded-2xl bg-blue-200/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(30,64,175,0.35)] border border-blue-950/40 hover:shadow-[0_30px_70px_rgba(30,64,175,0.45)] transition-all duration-300">
      <p className="text-red-950 font-bold text-xl">{title}</p>
      <p className="text-green-950 text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}














































































































// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar"; import { useEffect, useState } from "react";
// import { db } from "../firebase";
// import { collection, getDocs } from "firebase/firestore";

// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
// } from "recharts";

// export default function Dashboard() {
//   const uid = localStorage.getItem("uid");

//   const [counts, setCounts] = useState({
//     running: 0,
//     completed: 0,
//     upcoming: 0,
//     overdue: 0,
//     shared: 0,
//     totalTeams: 0,
//   });

//   /* ================= FETCH TASK COUNTS ================= */
//   useEffect(() => {
//     if (!uid) return;

//     const fetchCounts = async () => {
//       const taskCols = ["running", "upcoming", "completed", "overdue"];
//       let tempCounts = {
//         running: 0,
//         upcoming: 0,
//         completed: 0,
//         overdue: 0,
//         shared: 0,
//         totalTeams: 0,
//       };

//       // STEP3: Count for 4 main cards
//       for (let col of taskCols) {
//         const snap = await getDocs(collection(db, col));
//         snap.forEach((doc) => {
//           const data = doc.data();
//           const match =
//             data.userID === uid ||
//             data.assignedToMemberID === uid ||
//             (Array.isArray(data.assignedToTeamMemberID) &&
//               data.assignedToTeamMemberID.includes(uid));

//           if (match) tempCounts[col]++;
//         });
//       }

//       // STEP4: Shared Tasks
//       for (let col of taskCols) {
//         const snap = await getDocs(collection(db, col));
//         snap.forEach((doc) => {
//           const data = doc.data();
//           const sharedMatch =
//             data.userID === uid ||
//             (Array.isArray(data.assignedToTeamMemberID) &&
//               data.assignedToTeamMemberID.includes(uid));
//           if (sharedMatch) tempCounts.shared++;
//         });
//       }

//       // STEP6: Total Teams
//       const teamSnap = await getDocs(collection(db, "Teams"));
//       teamSnap.forEach((doc) => {
//         const data = doc.data();
//         const fields = [
//           "headuid",
//           "member1uid",
//           "member2uid",
//           "member3uid",
//           "member4uid",
//           "member5uid",
//         ];
//         if (fields.some((f) => data[f] === uid)) {
//           tempCounts.totalTeams++;
//         }
//       });

//       setCounts(tempCounts);
//     };

//     fetchCounts();
//   }, [uid]);

//   // Derived stats
//   const totalTasks =
//     counts.running + counts.completed + counts.upcoming + counts.overdue;

//   const completionPercent =
//     totalTasks === 0
//       ? 0
//       : Math.round((counts.completed / totalTasks) * 100);

//   const pieData = [
//     { name: "Running", value: counts.running },
//     { name: "Completed", value: counts.completed },
//     { name: "Upcoming", value: counts.upcoming },
//     { name: "Overdue", value: counts.overdue },
//   ].filter((d) => d.value > 0);

//   const barData = [
//     { name: "Running", tasks: counts.running },
//     { name: "Completed", tasks: counts.completed },
//     { name: "Upcoming", tasks: counts.upcoming },
//     { name: "Overdue", tasks: counts.overdue },
//   ];

//   const COLORS = ["#22c55e", "#facc15", "#ef4444", "#22d3ee"];

//   // Login Activity Simulation
//   const activityData = Array.from({ length: 30 }, () =>
//     Math.floor(Math.random() * 5)
//   );

//   return (
//     <>
//       <Navbar />
//       <div className="flex min-h-screen bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF] text-red-950">
//         <Sidebar />
//         <main className="flex-1 p-6 md:p-10 text-red-950 space-y-10">
//           {/* <h1 className="text-3xl font-bold">Task Management Dashboard</h1> */}

//           {/* ================= TOP CARDS ================= */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//             <StatCard title="Running Tasks" value={counts.running} color="cyan" />
//             <StatCard title="Completed Tasks" value={counts.completed} color="green" />
//             <StatCard title="Upcoming Tasks" value={counts.upcoming} color="yellow" />
//             <StatCard title="Overdue Tasks" value={counts.overdue} color="red" />
//           </div>

//           {/* ================= SECOND SECTION ================= */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <MiniStat title="Total Tasks" value={totalTasks} />
//             <MiniStat title="Shared Tasks" value={counts.shared} />
//             <MiniStat title="Total Teams" value={counts.totalTeams} />
//           </div>

//           {/* ================= CHARTS ================= */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Pie Chart */}
//             <div className="p-6 h-[350px] rounded-2xl bg-blue-200/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(30,64,175,0.35)] border border-blue-950/40 hover:shadow-[0_30px_70px_rgba(30,64,175,0.45)] transition-all duration-300">
//               <h2 className="text-red-950 font-bold text-2xl mb-4">Task Distribution</h2>
//               {pieData.length ? (
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
//                       {pieData.map((_, i) => (
//                         <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <p className="text-red-950 text-center mt-24">No tasks available</p>
//               )}
//             </div>

//             {/* Bar Chart */}
//             <div className="p-6 h-[350px] overflow-hidden rounded-2xl bg-blue-200/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(30,64,175,0.35)] border border-blue-950/40 hover:shadow-[0_30px_70px_rgba(30,64,175,0.45)] transition-all duration-300">
//               <h2 className="text-red-950 font-bold text-2xl mb-4">Task Overview</h2>
//               <div className="w-full h-[260px] text-red-950">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={barData}>
//                     <XAxis dataKey="name" stroke="#000000" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="tasks" fill="#FFEA00FF" radius={[6, 6, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>

//           {/* ================= COMPLETION RING ================= */}
//           <div className="p-6 flex flex-col items-center rounded-2xl bg-blue-200/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(30,64,175,0.35)] border border-blue-950/40 hover:shadow-[0_30px_70px_rgba(30,64,175,0.45)] transition-all duration-300">
//             <h2 className="text-red-950 font-bold text-xl mb-4">Completion Progress</h2>
//             <div className="relative w-40 h-40">
//               <svg className="w-full h-full rotate-[-90deg]">
//                 <circle cx="80" cy="80" r="70" stroke="#4a404d" strokeWidth="12" fill="none" />
//                 <circle
//                   cx="80"
//                   cy="80"
//                   r="70"
//                   stroke="#22c55e"
//                   strokeWidth="12"
//                   fill="none"
//                   strokeDasharray="440"
//                   strokeDashoffset={440 - (440 * completionPercent) / 100}
//                 />
//               </svg>
//               <div className="absolute inset-0 flex items-center justify-center text-red-950 text-2xl font-bold">
//                 {completionPercent}%
//               </div>
//             </div>
//           </div>

//           {/* ================= LOGIN ACTIVITY ================= */}
//           <div className="p-6 rounded-2xl bg-blue-200/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(30,64,175,0.35)] border border-blue-950/40 hover:shadow-[0_30px_70px_rgba(30,64,175,0.45)] transition-all duration-300">
//             <h2 className="text-red-950 font-bold text-xl mb-4">Login Activity (Last 30 Days)</h2>
//             <div className="grid grid-cols-10 gap-2">
//               {activityData.map((v, i) => (
//                 <div
//                   key={i}
//                   className={`w-6 h-6 rounded ${
//                     v === 0 ? "bg-red-400" : "bg-green-400"
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>
//         </main>
//       </div>
//     </>
//   );
// }

// /* ================= COMPONENTS ================= */
// function StatCard({ title, value, color }) {
//   const map = {
//     cyan: "text-cyan-400",
//     green: "text-green-400",
//     yellow: "text-yellow-400",
//     red: "text-red-400",
//   };
//   return (
//     <div className="p-6 text-center rounded-2xl bg-blue-200/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(30,64,175,0.35)] border border-blue-950/40 hover:shadow-[0_30px_70px_rgba(30,64,175,0.45)] transition-all duration-300">
//       <p className="text-red-950 mb-2 font-bold text-xl">{title}</p>
//       <p className={`text-4xl font-bold ${map[color]}`}>{value}</p>
//     </div>
//   );
// }

// function MiniStat({ title, value }) {
//   return (
//     <div className="p-5 text-center rounded-2xl bg-blue-200/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(30,64,175,0.35)] border border-blue-950/40 hover:shadow-[0_30px_70px_rgba(30,64,175,0.45)] transition-all duration-300">
//       <p className="text-red-950 font-bold text-xl">{title}</p>
//       <p className="text-green-950 text-3xl font-bold mt-2">{value}</p>
//     </div>
//   );
// }
