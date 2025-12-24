const StatBar = ({ label, value, maxVal }) => {
  const height = Math.round((value / maxVal) * 48) + 6;
  return (
    <div className="bg-white/5 p-3 md:p-4 rounded-xl border border-white/10 flex flex-col items-center justify-between h-full backdrop-blur-sm">
      <div className="text-xs md:text-sm text-white/60 mb-2 font-medium tracking-wide text-center">
        {label}
      </div>
      <div className="flex items-end h-12 gap-2 my-1">
        <div
          className="w-6 md:w-8 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-lg shadow-lg shadow-blue-500/20"
          style={{ height: `${height}px` }}
        />
      </div>
      <div className="text-lg md:text-xl font-bold text-white mt-1">
        {value}
      </div>
    </div>
  );
};

const UserDashboardStats = ({
  totalPosts,
  totalLikesReceived,
  totalCommentsReceived,
  maxVal,
}) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
    <StatBar label="Posts Created" value={totalPosts} maxVal={maxVal} />
    <StatBar
      label="Likes Received"
      value={totalLikesReceived}
      maxVal={maxVal}
    />
    <StatBar
      label="Comments Received"
      value={totalCommentsReceived}
      maxVal={maxVal}
    />
  </div>
);

export default UserDashboardStats;
