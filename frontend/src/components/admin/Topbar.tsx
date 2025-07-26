const Topbar = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      <div className="text-lg font-medium">Welcome back 👋</div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">{new Date().toLocaleTimeString()}</span>
        <div className="w-9 h-9 rounded-full bg-gray-200" />
      </div>
    </header>
  );
};

export default Topbar;
