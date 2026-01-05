import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function About() {
  return (
    <>
      <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 min-h-screen p-10 bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF] text-red-950">

          {/* Main Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
            
            {/* 1. What is this Software / Description */}
            <section>
              <h2 className="text-2xl font-semibold mb-2">What is ORBITLAW?</h2>
              <p className="text-gray-700">
                <strong>ORBITLAW</strong> is a cloud-based workflow management SaaS platform designed 
                to help teams and individuals efficiently manage tasks, projects, and collaboration. 
                It provides a multi-user environment with secure authentication, real-time task updates, 
                and a comprehensive dashboard for tracking productivity.
              </p>
            </section>

            {/* 2. Where it is Used */}
            <section>
              <h2 className="text-2xl font-semibold mb-2">Where is it Used?</h2>
              <p className="text-gray-700">
                ORBITLAW can be used in multiple scenarios including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Corporate teams for project and task management</li>
                <li>Startups and SMEs to track workflows and team productivity</li>
                <li>Freelancers managing multiple clients and projects</li>
                <li>Educational institutions for student assignments and group projects</li>
                <li>Remote teams for cloud-based collaboration and real-time updates</li>
                <li>Individuals for personal productivity tracking</li>
              </ul>
            </section>

            {/* 3. Features */}
            <section>
              <h2 className="text-2xl font-semibold mb-2">Key Features</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Secure Authentication System with Firebase Auth</li>
                <li>Multi-user & Team Management</li>
                <li>Complete Task Lifecycle: Running, Upcoming, Completed, Overdue, Shared</li>
                <li>Personalized Dashboard & Profile Overview</li>
                <li>Real-time Updates using Firestore Listeners</li>
                <li>Task Sharing & Collaboration</li>
                <li>Scalable Cloud-based Architecture</li>
              </ul>
            </section>

          </div>
        </main>
      </div>
      </div>
    </>
  );
}
