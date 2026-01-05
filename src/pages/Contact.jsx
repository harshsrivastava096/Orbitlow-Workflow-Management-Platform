import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FiPhone, FiMail } from "react-icons/fi";

export default function Contact() {
  const [feedback, setFeedback] = useState("");

  const whatsappNumber = "+919555347531"; // WhatsApp number
  const emailID = "harshsrivastava09682@gmail.com"; // Email ID

  const handleFeedbackSubmit = () => {
    if (!feedback) return alert("Please enter your message!");
    window.location.href = `mailto:${emailID}?subject=Prokit Feedback&body=${encodeURIComponent(
      feedback
    )}`;
  };

  // Animation variants
  const cardVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const buttonVariant = {
    hover: { scale: 1.05, boxShadow: "0px 8px 20px rgba(0,0,0,0.2)" },
    tap: { scale: 0.95 },
  };

  return (
    <>
      <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 min-h-screen p-10 bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF]">
          <motion.h1
            className="text-4xl font-bold text-center mb-1 text-red-950"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            CONTACT US
          </motion.h1>

          <motion.p
            className="text-center text-gray-600 mb-1 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Get in touch via WhatsApp, Email.
          </motion.p>

          <motion.p
            className="text-center text-gray-600 mb-1 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div
              className="flex flex-col items-center mb-8 border-b w-full border-gray-300 pb-6 
            bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF] shadow-md"
            >
              {" "}
            </div>
          </motion.p>

          {/* Main Card */}
          <motion.div
            className="max-h-[90vh] overflow-y-auto max-w-5xl mx-auto p-10 flex flex-col md:flex-row gap-10"
            variants={cardVariant}
            initial="hidden"
            animate="visible"
          >
            <div className="flex-1 flex flex-row gap-8 items-center justify-center">
              {/* WhatsApp */}
              <motion.div
                className="flex flex-col gap-3 items-center md:items-start"
                whileHover={{ y: -3 }}
              >

                <motion.button
                 onClick={() =>
                    window.open(
                      `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`,
                      "_blank"
                    )
                  }
                  className="flex items-center gap-4 bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-2xl shadow-lg font-semibold"
                  variants={buttonVariant}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <FiPhone size={26} />
                  <span>Chat with us</span>
                </motion.button>
              </motion.div>

              {/* Email */}
              <motion.div
                className="flex flex-col gap-3 items-center md:items-start"
                whileHover={{ y: -3 }}
              >

                <motion.button
                  onClick={() => (window.location.href = `mailto:${emailID}`)}
                  className="flex items-center gap-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-3 rounded-2xl shadow-lg font-semibold"
                  variants={buttonVariant}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <FiMail size={26} />
                  <span>Email Us</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
      </div>
    </>
  );
}
