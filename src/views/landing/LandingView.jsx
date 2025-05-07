import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import StatCard from '../components/StatCard';
import FeatureCard from '../components/FeatureCard';
import { fetchStats } from '../../services/statsService';

const LandingView = () => {
  const [stats, setStats] = useState({ users: 0, programs: 0, reminders: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Parallax effect for hero image
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);

    fetchStats()
      .then(data => setStats(data))
      .catch(error => console.error('Error fetching stats:', error));

    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className="min-h-screen font-poppins overflow-x-hidden relative bg-gradient-to-br from-custom-green-50 to-custom-green-100">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-[url('/subtle-pattern.svg')] bg-repeat opacity-5"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-custom-green-200 rounded-full blur-3xl opacity-20 transform -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-custom-green-300 rounded-full blur-3xl opacity-10 transform translate-y-1/3 -translate-x-1/4"></div>
      </div>

      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 w-full backdrop-blur-md bg-white/70 z-20 shadow-sm"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <motion.img
              src="/logo.png"
              alt="Wellness Buddy Logo"
              className="h-12 w-12 mr-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <h1 className="text-2xl font-semibold text-custom-green-800 font-amaranth">
              Wellness <span className="text-custom-green-600">Buddy</span>
            </h1>
          </div>
          <motion.nav 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="hidden md:flex items-center space-x-8"
          >
            <a href="#features" className="text-gray-700 hover:text-custom-green-600 transition-colors duration-200">Features</a>
            <a href="/login" className="px-4 py-2 border border-custom-green-600 text-custom-green-600 rounded-lg hover:bg-custom-green-50 transition-all duration-200">Sign In</a>
          </motion.nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 relative z-10">
        <AnimatePresence>
          {isVisible && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
              <motion.div 
                className="lg:w-1/2 mb-10 lg:mb-0"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 font-amaranth leading-tight mb-6 tracking-tight">
                  Empowering <span className="text-custom-green-600 font-bold">Your Wellness</span> <br /> Every Day!
                </h2>
                <p className="text-xl text-gray-700 font-poppins leading-relaxed mb-8 max-w-lg">
                  Wellness Buddy helps individuals prioritize well-being with daily tracking, smart reminders, and mental health support, fostering balance in life.
                </p>
                <motion.div 
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <motion.a
                    href="/signup"
                    className="bg-custom-green-600 text-white px-8 py-3 rounded-xl text-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Started
                  </motion.a>
                  <motion.a
                    href="#features"
                    className="border border-gray-300 bg-white text-gray-700 px-8 py-3 rounded-xl text-lg font-medium shadow-sm hover:border-custom-green-400 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Learn More
                  </motion.a>
                </motion.div>
              </motion.div>
              <motion.div
                className="lg:w-1/2 relative"
                style={{ y: heroImageY }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-custom-green-200 rounded-full blur-3xl opacity-30 transform scale-90"></div>
                  <img
                    src="/team-image.png"
                    alt="Team celebrating"
                    className="w-64 h-64 sm:w-80 sm:h-80 lg:w-[500px] lg:h-[500px] rounded-3xl object-cover mx-auto shadow-xl relative z-10"
                  />
                </motion.div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-white relative z-10">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <motion.div variants={itemVariants}>
              <StatCard title="Happy Users" value={`${stats.users}+`} icon="UsersIcon" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard title="Guided Programs" value={`${stats.programs}+`} icon="BookOpenIcon" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard title="Daily Reminders Sent" value={`${stats.reminders}+`} icon="CalendarIcon" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-custom-green-50 to-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h3 
            className="text-4xl font-bold text-custom-green-800 font-amaranth mb-4 tracking-tight text-center"
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Key Features
          </motion.h3>
          <motion.p 
            className="text-gray-600 text-center max-w-2xl mx-auto mb-16"
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Everything you need to maintain balance and wellness in your daily life
          </motion.p>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants}>
              <FeatureCard
                title="Wellness Tracking"
                description="Track and analyze mood, stress, sleep, and work hours with insights."
                icon="HeartIcon"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                title="Reminders"
                description="Manage self-care tasks with meal, water, and break alerts."
                icon="ClockIcon"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                title="Mental Health Support"
                description="Access meditation, breathing exercises, and help resources."
                icon="ChatBubbleOvalLeftIcon"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                title="Work-life Balance"
                description="Optimize work hours and celebrate achievements effortlessly."
                icon="ScaleIcon"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-custom-green-600 opacity-10 blur-3xl rounded-full transform scale-150 translate-x-1/3"></div>
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 backdrop-blur-sm bg-opacity-80">
            <h3 className="text-3xl font-bold text-gray-900 font-amaranth mb-6 tracking-tight text-center">Ready to Get Started?</h3>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
              Join thousands of users who have transformed their wellness journey with Wellness Buddy.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.a
                href="/signup"
                className="bg-custom-green-600 text-white px-8 py-4 rounded-xl text-lg font-medium text-center shadow-md"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
              >
                Create Account
              </motion.a>
              <motion.a
                href="/login"
                className="border border-gray-300 bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-medium text-center"
                whileHover={{ scale: 1.02, borderColor: "#4CAF50" }}
                whileTap={{ scale: 0.98 }}
              >
                Sign In
              </motion.a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gray-900 text-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center mb-6">
                <img src="/logo.png" alt="Wellness Buddy Logo" className="h-10 w-10 mr-3" />
                <h3 className="text-xl font-semibold text-white font-amaranth">Wellness Buddy</h3>
              </div>
              <p className="text-gray-400 mb-6">Empowering your wellness journey with smart technology and thoughtful reminders.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <span className="sr-only">Twitter</span>
                  {/* Twitter icon */}
                </a>
                {/* Other social icons */}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Features</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Wellness Tracking</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Reminders</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Mental Health Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Work-life Balance</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-500 text-sm">© 2025 Wellness Buddy | All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingView;
