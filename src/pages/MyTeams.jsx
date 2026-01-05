import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function MyTeams() {
  // STEP 1: Local Storage data
  const uid = localStorage.getItem("uid");
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // STEP 3: Fetch Teams where logged-in user is part of team
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        if (!uid) return;

        const querySnapshot = await getDocs(collection(db, "Teams"));
        const userTeams = [];

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();

          const {
            headuid,
            member1uid,
            member2uid,
            member3uid,
            member4uid,
            member5uid,
          } = data;

          // Match logged-in user uid with any team member field
          if (
            uid === headuid ||
            uid === member1uid ||
            uid === member2uid ||
            uid === member3uid ||
            uid === member4uid ||
            uid === member5uid
          ) {
            userTeams.push({
              id: docSnap.id,
              ...data,
            });
          }
        });

        setTeams(userTeams);
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [uid]);

  return (
    <>
      <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 min-h-screen p-10 bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF] text-red-950">
          <h1 className="text-3xl font-bold text-center mb-2">
            MY TEAMS
          </h1>
          <p className="text-center text-gray-700 mb-1">
            Here you can access your all the Teams in which you are working or
            playing a role
          </p>
          <div className="flex flex-col items-center mb-8 border-b w-full border-gray-300 pb-6 
            bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF] shadow-md"> </div>

          {loading && (
            <p className="text-center text-xl font-semibold">
              Loading teams...
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-12">
            {teams.length === 0 && !loading && (
              <p className="col-span-full text-center text-xl font-semibold">
                You are not part of any team yet.
              </p>
            )}

            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-blue-200/60 backdrop-blur-xl border border-blue-950/40 
                rounded-2xl shadow-[0_20px_50px_rgba(30,64,175,0.35)] 
                p-6 text-red-950"
              >
                {/* Team Avatar + Name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full border-2 border-cyan-400 bg-white overflow-hidden flex items-center justify-center">
                    <img
                      src="/Team Logo.jpg"
                      alt="Team Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-red-500">{team.teamname}</h2>
                </div>

                {/* Team Info */}
                <div className="space-y-1 text-lg">
                  <p>
                    <span className="font-semibold text-yellow-600">Team Type:</span>{" "}
                    {team.teamtype}
                  </p>
                  <p>
                    <span className="font-semibold text-yellow-600">Team Code:</span>{" "}
                    {team.teamcode}
                  </p>
                </div>

                <hr className="my-4 border-red-950/30" />

                {/* Leader & Members */}
                <div className="grid grid-cols-2 gap-4 text-lg">
                  <div>
                    <p className="font-semibold mb-2 text-yellow-600">Leader</p>
                    <p>{team.headusername || "-"}</p>
                  </div>

                  <div>
                    <p className="font-semibold mb-2 text-yellow-600">Members</p>
                    <p>{team.member1username || "-"}</p>
                    <p>{team.member2username || "-"}</p>
                    <p>{team.member3username || "-"}</p>
                    <p>{team.member4username || "-"}</p>
                    <p>{team.member5username || "-"}</p>
                  </div>
                </div>

                <hr className="my-4 border-red-950/30" />

                {/* Created Date */}
                <p className="text-sm font-medium text-green-600">
                  Created:{" "}
                  {team.createdAt?.toDate
                    ? team.createdAt.toDate().toLocaleDateString()
                    : team.createdAt || "-"}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
      </div>
    </>
  );
}
