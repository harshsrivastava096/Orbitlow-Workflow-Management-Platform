// ConnectPage.jsx
import React from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';

function ConnectPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF]">
      <Header />

      <div className="text-center mt-20 px-4">
        {/* Animated Heading */}
        <motion.h1
          className="text-5xl font-extrabold text-red-950 mb-12"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Welcome to <span className="text-yellow-600">ORBITLAW</span>
        </motion.h1>

        {/* Card */}
        <motion.div
          className="max-w-sm mx-auto bg-[#1f1b29] p-8 rounded-2xl shadow-2xl border border-cyan-500"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
        >
          {/* Icon */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
          >
            <User className="w-20 h-20 text-cyan-400" />
          </motion.div>

          {/* Buttons */}
          <div className="flex flex-col space-y-4">
            <motion.button
              onClick={() => navigate('/LoginPage')}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>

            <motion.button
              onClick={() => navigate('/SignUpPage')}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-green-500/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
            {/* Back to Connect */}
        <p
          className="mt-4 text-center text-cyan-300 cursor-pointer hover:underline"
          onClick={() => navigate("/")}
        >
          &larr; Back to Home
        </p>
          </div>
        </motion.div>

        {/* Footer Animation */}
        <motion.p
          className="text-gray-900 mt-12 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Your ultimate Workflow Management Platform
        </motion.p>
      </div>
    </div>
  );
}

export default ConnectPage;
