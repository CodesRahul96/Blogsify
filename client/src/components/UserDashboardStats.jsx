// UserDashboardStats.jsx
import React from "react";

const StatBar = ({ label, value, maxVal }) => {
  const height = Math.round((value / maxVal) * 48) + 6;
  return (
    <div className="flex-1 bg-white/5 p-4 rounded-lg border border-gray-700/40 flex flex-col items-center">
      <div className="text-sm text-gray-300 mb-2">{label}</div>
      <div className="flex items-end h-14 gap-2">
        <div className="w-8 bg-gradient-to-t from-purple-600 to-blue-500 rounded" style={{ height: `${height}px` }} />
      </div>
      <div className="text-xl font-bold text-white mt-2">{value}</div>
    </div>
  );
};

const UserDashboardStats = ({ totalPosts, totalLikesReceived, totalCommentsReceived, maxVal }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <StatBar label="Posts Created" value={totalPosts} maxVal={maxVal} />
    <StatBar label="Likes Received" value={totalLikesReceived} maxVal={maxVal} />
    <StatBar label="Comments Received" value={totalCommentsReceived} maxVal={maxVal} />
  </div>
);

export default UserDashboardStats;
