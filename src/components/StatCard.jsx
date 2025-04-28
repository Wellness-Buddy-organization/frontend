import React from 'react';
import { motion } from 'framer-motion';
import { UsersIcon, BookOpenIcon, CalendarIcon } from '@heroicons/react/24/outline';

const icons = {
  UsersIcon: UsersIcon,
  BookOpenIcon: BookOpenIcon,
  CalendarIcon: CalendarIcon,
};

const StatCard = ({ title, value, icon }) => {
  const IconComponent = icons[icon] || (() => <div className="h-12 w-12 bg-custom-green-600 rounded-full" />);
  
  return (
    <motion.div
      className="relative overflow-hidden p-6 bg-white rounded-2xl shadow-sm border border-gray-100 h-full"
      whileHover={{ 
        y: -4,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.2 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="bg-custom-green-50 p-3 rounded-xl">
          <IconComponent className="h-10 w-10 text-custom-green-600" />
        </div>
        <div>
          <h4 className="text-3xl font-bold text-gray-900 mb-1">{value}</h4>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
        </div>
      </div>
      
      {/* Subtle decorative element */}
      <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-custom-green-100 opacity-30" />
    </motion.div>
  );
};

export default StatCard;