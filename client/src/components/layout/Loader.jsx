function Loader({ fullScreen = true }) {
  const spinner = (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-zinc-200 dark:border-zinc-800 border-t-blue-500 animate-spin" />
    </div>
  );

  if (!fullScreen) {
    return <div className="flex justify-center items-center py-16">{spinner}</div>;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-white dark:bg-[#09090b]">
      {spinner}
    </div>
  );
}

export default Loader;
