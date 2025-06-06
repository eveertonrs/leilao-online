import React from 'react';

console.log("Deploy test")

const DashboardAdmin = () => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-semibold text-blue-300 mb-4">Dashboard Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-300">Total Events</h2>
          <p className="text-2xl text-white">10</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-300">Total Lotes</h2>
          <p className="text-2xl text-white">50</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-300">Total Users</h2>
          <p className="text-2xl text-white">100</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
