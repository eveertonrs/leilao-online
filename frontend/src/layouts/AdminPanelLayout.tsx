import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon, CalendarIcon, ArchiveBoxIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Outlet } from 'react-router-dom';


interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface AdminPanelLayoutProps {
  children: React.ReactNode;
}

const AdminPanelLayout: React.FC<AdminPanelLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems: MenuItem[] = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <HomeIcon className="h-5 w-5" /> },
    //{ label: 'Eventos', path: '/admin/novo-evento', icon: <CalendarIcon className="h-5 w-5" /> },
    { label: 'Eventos', path: '/admin/eventos', icon: <CalendarIcon className="h-5 w-5" /> },
    { label: 'Lotes', path: '/admin/lotes', icon: <ArchiveBoxIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div
        className={`flex flex-col bg-gradient-to-b from-gray-800 to-gray-700 text-white shadow-md transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-300"></h3>
          <button onClick={toggleSidebar} className="focus:outline-none">
            {isSidebarOpen ? (
              <ChevronLeftIcon className="h-6 w-6 text-gray-300 hover:text-white transition duration-200" />
            ) : (
              <ChevronRightIcon className="h-6 w-6 text-gray-300 hover:text-white transition duration-200" />
            )}
          </button>
        </div>
        <nav className="flex-1 p-4">
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.label}
                className={`p-2 rounded-md hover:bg-gray-700 transition duration-200`}
                title={!isSidebarOpen ? item.label : ''}
              >
                <button onClick={() => navigate(item.path)} className="flex items-center text-gray-300 hover:text-blue-300">
                  <span className="mr-2">{item.icon}</span>
                  <span className={`${isSidebarOpen ? 'inline' : 'hidden'}`}>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-grow p-4 bg-gray-900 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPanelLayout;
