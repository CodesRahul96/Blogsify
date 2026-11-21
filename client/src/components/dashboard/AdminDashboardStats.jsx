// AdminDashboardStats.jsx
// AdminDashboardStats.jsx

const StatCard = ({ label, value }) => {
  return (
    <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col shadow-xs">
      <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{label}</span>
      <span className="text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-white mt-2">
        {value}
      </span>
    </div>
  );
};

const AdminDashboardStats = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
    <StatCard label="Total Users" value={stats.totalUsers} />
    <StatCard label="Total Posts" value={stats.totalPosts} />
    <StatCard label="Total Comments" value={stats.totalComments} />
    <StatCard label="Total Likes" value={stats.totalLikes} />
    <StatCard label="Admin Users" value={stats.totalAdmins} />
  </div>
);

export default AdminDashboardStats;
