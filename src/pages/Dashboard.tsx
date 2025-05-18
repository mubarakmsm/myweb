import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Code, BarChart3, FileText, Settings, Home, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProjectsManager from '../components/dashboard/ProjectsManager';
import SkillsManager from '../components/dashboard/SkillsManager';
import ServicesManager from '../components/dashboard/ServicesManager';
import CVManager from '../components/dashboard/CVManager';
import SettingsManager from '../components/dashboard/SettingsManager';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const { user, signOut } = useAuth();

  const tabs = [
    { id: 'projects', label: 'المشاريع', icon: <Briefcase className="ml-2" size={20} /> },
    { id: 'services', label: 'الخدمات', icon: <Code className="ml-2" size={20} /> },
    { id: 'skills', label: 'المهارات', icon: <BarChart3 className="ml-2" size={20} /> },
    { id: 'cv', label: 'السيرة الذاتية', icon: <FileText className="ml-2" size={20} /> },
    { id: 'settings', label: 'الإعدادات', icon: <Settings className="ml-2" size={20} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'projects':
        return <ProjectsManager />;
      case 'services':
        return <ServicesManager />;
      case 'skills':
        return <SkillsManager />;
      case 'cv':
        return <CVManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <ProjectsManager />;
    }
  };

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gray-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="md:w-64 bg-gray-800 text-white p-6 md:h-[calc(100vh-5rem)] md:fixed">
              <div className="mb-6 pb-6 border-b border-gray-700">
                <h2 className="text-xl font-bold">لوحة التحكم</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {user?.email}
                </p>
              </div>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex items-center w-full px-4 py-3 rounded-md font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-700">
                  <a 
                    href="/"
                    className="flex items-center w-full px-4 py-3 rounded-md font-medium text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    <Home className="ml-2" size={20} />
                    العودة للموقع
                  </a>
                  <button
                    onClick={signOut}
                    className="flex items-center w-full px-4 py-3 rounded-md font-medium text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    <LogOut className="ml-2" size={20} />
                    تسجيل الخروج
                  </button>
                </div>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 md:mr-64 p-6">
              <div className="min-h-[calc(100vh-10rem)]">
                {renderContent()}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;