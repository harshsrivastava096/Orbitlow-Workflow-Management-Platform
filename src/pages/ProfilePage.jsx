import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { db, storage } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Pencil, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const navigate = useNavigate();
  const uid = localStorage.getItem("uid");
  const role = localStorage.getItem("role");
  const collectionName = role === "Member" ? "Members" : "Heads";

  const [userData, setUserData] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const profileFields = [
    "fullname",
    "username",
    "email",
    "password",
    "address",
    "organisation",
    "position",
    "DOB",
    "mobileNumber",
    "gender",
    "website",
    "linkedin",
    "skills",
    "department",
    "country",
    "bio",
  ];

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!uid || !role) return;

        const docRef = doc(db, collectionName, uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setUserData(snap.data());
        } else {
          // Create doc if doesn't exist
          await setDoc(docRef, { userID: uid });
          setUserData({ userID: uid });
        }
      } catch (err) {
        console.error(err);
        alert("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [uid, role, collectionName]);

  // Handle field change
  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle Clear
  const handleClear = () => {
    const clearedData = {};
    profileFields.forEach((f) => (clearedData[f] = ""));
    setUserData(clearedData);
    setSelectedFile(null);
  };

  // Handle Save
  const handleSave = async () => {
    try {
      if (!uid || !role) return alert("User not logged in properly!");

      const docRef = doc(db, collectionName, uid);
      let updatedData = { ...userData };

      // Upload profile picture if selected
      if (selectedFile) {
        const storageRef = ref(storage, `profilePics/${uid}`);
        await uploadBytes(storageRef, selectedFile);
        const url = await getDownloadURL(storageRef);
        updatedData.profilePhoto = url;
      }

      // Ensure document exists
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, { userID: uid });
      }

      // Update Firestore
      await updateDoc(docRef, updatedData);
      toast.success("Profile updated successfully!");
      setEditing(false);
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile. Check console.");
    }
  };

  // if (loading)
  //   return <div className="text-white text-center mt-10">Loading...</div>;

  return (
    <>
      <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 min-h-screen p-6 sm:p-10 bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF] text-red-950">
          <h1 className="text-3xl font-bold mb-6 text-center">MY PROFILE</h1>
          <div className="flex flex-col items-center mb-8 border-b w-full border-gray-300 pb-6 
            bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF] shadow-md"> </div>
          <div className="px-60">
            <div className="rounded-2xl bg-blue-200/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(30,64,175,0.35)]
            border border-blue-950/40 p-6 space-y-6 max-w-4xl mx-auto"
          >
            {/* Profile Avatar */}
            <div className="flex justify-center mb-6 relative">
              <div className="w-32 h-32 rounded-full border-4 border-cyan-400 flex items-center justify-center overflow-hidden bg-gray-800">
                <img
                  src={
                    userData.gender === "Male"
                      ? "/Male.png"
                      : userData.gender === "Female"
                      ? "/Female.png"
                      : "/User.png"
                  }
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Optional: File upload */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="absolute bottom-0 right-0 w-10 h-10 opacity-0 cursor-pointer"
              />
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profileFields.map((field) => (
                <div key={field} className="relative">
                  <label className="block mb-1 text-red-950 font-medium">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field === "password" ? "password" : "text"}
                    value={userData[field] || ""}
                    readOnly={!editing}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className={`w-full px-4 py-2 rounded bg-[#312834] text-white ${
                      editing ? "border-2 border-yellow-400" : ""
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleClear}
                className="px-6 py-2 bg-gray-600 rounded text-white"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="px-6 py-2 bg-blue-500 rounded text-white"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 rounded text-white"
              >
                Save
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
