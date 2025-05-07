import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, ClockIcon, ChatBubbleOvalLeftIcon, ScaleIcon } from '@heroicons/react/24/outline';

const icons = {
  HeartIcon: HeartIcon,
  ClockIcon: ClockIcon,
  ChatBubbleOvalLeftIcon: ChatBubbleOvalLeftIcon,
  ScaleIcon: ScaleIcon,
};

const FeatureCard = ({ title, description, icon }) => {
  const IconComponent = icons[icon] || (() => <div className="h-12 w-12 bg-custom-green-600 rounded-full" />);
  
  return (
    <motion.div
      className="group relative overflow-hidden p-8 bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col"
      whileHover={{ 
        y: -4,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)",
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Animated highlight accent */}
      <motion.div 
        className="absolute -top-20 -right-20 w-40 h-40 bg-custom-green-100 rounded-full opacity-0 group-hover:opacity-30"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Icon with animated background */}
      <div className="relative z-10 mb-6">
        <motion.div 
          className="w-16 h-16 rounded-xl bg-custom-green-50 flex items-center justify-center"
          whileHover={{ rotate: 5 }}
        >
          <IconComponent className="h-8 w-8 text-custom-green-600" />
        </motion.div>
      </div>
      
      {/* Content */}
      <h4 className="text-xl font-bold text-gray-900 mb-3 relative z-10">{title}</h4>
      <p className="text-gray-600 leading-relaxed text-left relative z-10 mt-auto">{description}</p>
      
      {/* Animated indicator on hover */}
      <motion.div 
        className="mt-6 overflow-hidden h-0.5 w-0 bg-custom-green-500 group-hover:w-16"
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default FeatureCard;