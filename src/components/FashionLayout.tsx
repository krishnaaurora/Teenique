import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import FashionSidebar from "@/components/FashionSidebar";

interface FashionLayoutProps {
  children?: React.ReactNode;
}

const FashionLayout = ({ children }: FashionLayoutProps) => {
  // Ensure light mode class on document
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  // Light theme colors
  const bgColor = "bg-gradient-to-br from-[#F5F3EF] via-[#FFFFFF] to-[#F5F3EF]";

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-500`}>
      {/* Sidebar Navigation */}
      <FashionSidebar />

      {/* Main Content Area */}
      <main
        className={`
          min-h-screen
          lg:ml-20
          transition-all duration-300 ease-out
        `}
      >
        {/* Page Content */}
        <div className="min-h-screen">
          {children || <Outlet />}
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Ambient glow effects */}
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#D9C6A4]/10 blur-3xl"
        />
        <div 
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#D9C6A4]/8 blur-3xl"
        />
      </div>
    </div>
  );
};

export default FashionLayout;
