import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 border-none outline-none ring-0 bg-transparent hover:bg-transparent transition-all focus:ring-0 focus:outline-none focus-visible:ring-0 group"
    >
      <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
        <Sun 
          className={`absolute transition-all duration-500 ease-in-out ${
            isDark ? "-translate-y-10 opacity-0 rotate-45" : "translate-y-0 opacity-100 rotate-0"
          } text-primary stroke-[2.5px]`} 
          size={20}
        />
        
        <Moon 
          className={`absolute transition-all duration-500 ease-in-out ${
            isDark ? "translate-y-0 opacity-100 rotate-0" : "translate-y-10 opacity-0 -rotate-45"
          } text-primary stroke-[2.5px]`} 
          size={20}
        />
      </div>
    </button>
  );
};