import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  ChartBarIcon, 
  BellIcon, 
  HeartIcon, 
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', icon: HomeIcon, path: '/dashboard' },
    { name: 'Wellness Tracking', icon: ChartBarIcon, path: '/dashboard/tracking' },
    { name: 'Reminders', icon: BellIcon, path: '/dashboard/reminders' },
    { name: 'Mental Health Support', icon: HeartIcon, path: '/dashboard/mental-health' },
    { name: 'Work-life Balance', icon: UserGroupIcon, path: '/dashboard/work-life' },
    { name: 'Settings', icon: Cog6ToothIcon, path: '/dashboard/settings' },
  ];

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/login', { replace: true });
  };

  return (
    <motion.aside 
      className="w-64 bg-white bg-opacity-70 backdrop-blur-md border-r border-emerald-100 h-full shadow-lg"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="p-4">
        <div className="flex items-center mb-8 mt-2">
          <img 
            src="/logo.png" 
            alt="Wellness Buddy" 
            className="h-10 w-10 mr-2" 
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-xl font-semibold text-emerald-800">Wellness</h1>
            <p className="text-xs text-emerald-600 font-medium tracking-widest">BUDDY</p>
          </motion.div>
        </div>
        
        <nav>
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <motion.li 
                key={item.name}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <NavLink 
                  to={item.path}
                  end={item.path === '/dashboard'} // Ensure exact match for /dashboard
                  className={({ isActive }) => 
                    `flex items-center p-3 text-gray-700 rounded-lg hover:bg-emerald-100 transition-all duration-200 ${
                      isActive ? 'bg-emerald-100 text-emerald-700 font-medium' : ''
                    }`
                  }
                >
                  <item.icon className="w-6 h-6 mr-3" />
                  <span>{item.name}</span>
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </nav>
      </div>
      
      <div className="absolute bottom-0 w-full p-4">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full p-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;