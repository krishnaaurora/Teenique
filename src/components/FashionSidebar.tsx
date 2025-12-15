import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import {
  Home,
  Palette,
  ShoppingBag,
  CreditCard,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import iconImage from "@/assets/icon.png";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  notification?: boolean;
}

const FashionSidebar = () => {
  const location = useLocation();
  const { cartCount } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Navigation items
  const navItems: NavItem[] = [
    { path: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
    { path: "/gallery", label: "Style Gallery", icon: <Palette className="w-5 h-5" /> },
    { path: "/collections", label: "Collections", icon: <ShoppingBag className="w-5 h-5" /> },
    { path: "/checkout", label: "Checkout", icon: <CreditCard className="w-5 h-5" />, notification: cartCount > 0 },
  ];

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Close mobile sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Light theme colors only
  const theme = {
    bg: "bg-[#F5F3EF]/95",
    text: "text-[#0F0F0F]",
    textMuted: "text-[#0F0F0F]/60",
    accent: "text-[#D9C6A4]",
    accentBg: "bg-[#D9C6A4]",
    hover: "hover:bg-[#0F0F0F]/5",
    border: "border-[#0F0F0F]/10",
    glass: "backdrop-blur-xl bg-[#F5F3EF]/80",
  };

  // Check if path is active
  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // Sparkle animation component
  const SparkleEffect = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <Sparkles className="absolute w-3 h-3 text-[#D9C6A4] animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300 top-1 right-1" />
      <Sparkles className="absolute w-2 h-2 text-[#D9C6A4] animate-ping opacity-0 group-hover:opacity-75 transition-opacity duration-500 bottom-1 left-1" style={{ animationDelay: "150ms" }} />
    </div>
  );

  // Sidebar content
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div
      className={`
        h-full flex flex-col group
        ${theme.glass} ${theme.border} border-r
        shadow-2xl shadow-black/20
        transition-all duration-300 ease-out
        ${isMobile ? "w-72" : isExpanded ? "w-64" : "w-20"}
      `}
      onMouseEnter={() => !isMobile && setIsExpanded(true)}
      onMouseLeave={() => !isMobile && setIsExpanded(false)}
    >
      {/* Logo Section */}
      <div className={`p-6 border-b ${theme.border}`}>
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl overflow-visible">
            <img 
              src={iconImage} 
              alt="Teenique" 
              className="w-14 h-14 object-contain scale-125" 
              style={{ 
                filter: 'contrast(1.2) brightness(1.05)',
                imageRendering: 'auto'
              }}
            />
          </div>
          <div
            className={`
              overflow-hidden transition-all duration-300 ease-out
              ${isExpanded || isMobile ? "w-auto opacity-100" : "w-0 opacity-0"}
            `}
          >
            <h1 className={`text-lg tracking-[0.3em] ${theme.text} whitespace-nowrap font-bold`} style={{ fontFamily: "'Bodoni Moda', serif" }}>
              TEENIQUE
            </h1>
            <p className={`text-[10px] tracking-[0.2em] ${theme.text} uppercase font-bold`} style={{ fontFamily: "'Inter', sans-serif" }}>
              Elegance Redesigned for Gen-Z
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-6 px-3 space-y-2" role="navigation" aria-label="Main navigation">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              group relative flex items-center gap-4 px-4 py-3.5 rounded-xl
              transition-all duration-300 ease-out
              ${theme.hover}
              ${isActive(item.path) ? `${theme.accentBg}/10 ${theme.accent}` : theme.text}
            `}
            onMouseEnter={() => setHoveredItem(item.path)}
            onMouseLeave={() => setHoveredItem(null)}
            aria-label={item.label}
            aria-current={isActive(item.path) ? "page" : undefined}
          >
            {/* Active indicator */}
            {isActive(item.path) && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#D9C6A4] rounded-r-full shadow-lg shadow-[#D9C6A4]/50" />
            )}

            {/* Icon container */}
            <div className="relative flex items-center justify-center w-6">
              <div className={`transition-transform duration-300 ${hoveredItem === item.path ? "scale-110" : ""}`}>
                {item.icon}
              </div>
              
              {/* Notification dot */}
              {item.notification && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D9C6A4] rounded-full animate-pulse shadow-lg shadow-[#D9C6A4]/50" />
              )}
              
              {/* Sparkle effect */}
              <SparkleEffect />
            </div>

            {/* Label */}
            <span
              className={`
                font-medium text-sm tracking-wide whitespace-nowrap
                transition-all duration-300 ease-out
                ${isExpanded || isMobile ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 absolute"}
              `}
            >
              {item.label}
            </span>

            {/* Tooltip (only when collapsed) */}
            {!isExpanded && !isMobile && hoveredItem === item.path && (
              <div
                className={`
                  absolute left-full ml-4 px-3 py-2 rounded-lg
                  bg-[#0F0F0F] text-[#F5F3EF]
                  text-sm font-medium whitespace-nowrap
                  shadow-xl z-50
                  animate-in fade-in slide-in-from-left-2 duration-200
                `}
                role="tooltip"
              >
                {item.label}
                {item.notification && (
                  <span className="ml-2 text-xs text-[#D9C6A4]">({cartCount})</span>
                )}
              </div>
            )}

            {/* Hover glow effect */}
            <div className={`absolute inset-0 rounded-xl bg-[#D9C6A4]/0 group-hover:bg-[#D9C6A4]/5 transition-colors duration-300`} />
          </Link>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className={`
          lg:hidden fixed top-4 left-4 z-50
          w-12 h-12 rounded-xl
          ${theme.glass} ${theme.text} ${theme.border} border
          shadow-lg flex items-center justify-center
          transition-all duration-300 hover:scale-105
        `}
        aria-label="Open navigation menu"
        aria-expanded={isMobileOpen}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Sidebar */}
          <aside className="absolute left-0 top-0 h-full animate-in slide-in-from-left duration-300">
            <SidebarContent isMobile />
            
            {/* Close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className={`
                absolute top-4 right-4
                w-10 h-10 rounded-full
                bg-[#0F0F0F]/10 text-[#0F0F0F]
                flex items-center justify-center
                transition-all duration-300 hover:scale-110
              `}
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </aside>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }
        
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default FashionSidebar;
