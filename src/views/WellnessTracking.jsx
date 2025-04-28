import { motion } from 'framer-motion';

const WellnessTracking = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Wellness Tracking</h1>
      
      <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            Detailed tracking features coming soon!
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            We're building comprehensive wellness tracking tools to help you monitor and 
            improve your physical and mental well-being.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default WellnessTracking;