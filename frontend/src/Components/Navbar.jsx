import { Sun, Moon, Receipt, LogOut, User } from "lucide-react";

const Navbar = ({ darkMode, setDarkMode, user, onLogout }) => {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${
      darkMode 
        ? "bg-black border-zinc-800 text-white" 
        : "bg-white border-zinc-200 text-black"
    }`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${darkMode ? "bg-white" : "bg-black"}`}>
            <Receipt className={`w-4 h-4 ${darkMode ? "text-black" : "text-white"}`} />
          </div>
          <span className="font-semibold text-lg tracking-tight">Splitly</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          
          {/* Theme toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? "hover:bg-zinc-800 text-zinc-400 hover:text-white" 
                : "hover:bg-zinc-100 text-zinc-500 hover:text-black"
            }`}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User */}
          {user && (
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                darkMode ? "bg-zinc-900 text-zinc-300" : "bg-zinc-100 text-zinc-700"
              }`}>
                <User className="w-3.5 h-3.5" />
                <span>{user.name}</span>
              </div>

              <button
                onClick={onLogout}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? "hover:bg-zinc-800 text-zinc-400 hover:text-white" 
                    : "hover:bg-zinc-100 text-zinc-500 hover:text-black"
                }`}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;