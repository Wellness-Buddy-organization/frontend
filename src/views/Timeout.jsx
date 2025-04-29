import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Timeout = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen flex flex-col justify-center items-center bg-blue-50"
  >
    <div className="bg-white bg-opacity-90 rounded-2xl shadow-lg border border-blue-100 p-8 max-w-md w-full text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Session Timed Out</h1>
      <p className="text-gray-700 mb-4">
        Your session has expired due to inactivity.
      </p>
      <Link
        to="/login"
        className="inline-block bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600 transition"
      >
        Login Again
      </Link>
    </div>
  </motion.div>
);

export default Timeout;
