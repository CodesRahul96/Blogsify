// AdminDashboardStats.jsx
import React from "react";

const StatCard = ({ label, value, color = "purple" }) => {
  const colorClass = {
    purple: "from-purple-600 to-blue-500",
    green: "from-green-600 to-emerald-500",
    orange: "from-orange-600 to-red-500",
    pink: "from-pink-600 to-rose-500",
  }[color];
  return (
    <div className="p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-gray-700/40 flex flex-col">
      <span className="text-sm text-gray-300">{label}</span>
      <span className={`text-3xl font-bold bg-gradient-to-r ${colorClass} bg-clip-text text-transparent mt-2`}>{value}</span>
    </div>
  );
};

const AdminDashboardStats = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
    <StatCard label="Total Users" value={stats.totalUsers} color="green" />
    <StatCard label="Total Posts" value={stats.totalPosts} color="purple" />
    <StatCard label="Total Comments" value={stats.totalComments} color="orange" />
    <StatCard label="Total Likes" value={stats.totalLikes} color="pink" />
    <StatCard label="Admin Users" value={stats.totalAdmins} color="green" />
  </div>
);

export default AdminDashboardStats;
