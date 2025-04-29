import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Unauthorized = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen flex flex-col justify-center items-center bg-emerald-50"
  >
    <div className="bg-white bg-opacity-90 rounded-2xl shadow-lg border border-emerald-100 p-8 max-w-md w-full text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized</h1>
      <p className="text-gray-700 mb-4">
        You don't have permission to access this page or your session has expired.
      </p>
      <Link
        to="/login"
        className="inline-block bg-emerald-500 text-white px-6 py-2 rounded shadow hover:bg-emerald-600 transition"
      >
        Go to Login
      </Link>
    </div>
  </motion.div>
);

export default Unauthorized;
