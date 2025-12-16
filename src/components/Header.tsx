import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import { ShoppingCart, X } from "lucide-react";
import logo from "@/assets/image-removebg-preview.png";
import LocationPicker from "@/components/LocationPicker";

interface HeaderProps {
  forceWhiteText?: boolean;
  hideNav?: boolean;
  showLogoBackground?: boolean;
  logoBackgroundIntense?: boolean;
  showCartBackground?: boolean;
  cartIconBlue?: boolean;
  centerLogo?: boolean;
}

const Header = ({ forceWhiteText = false, hideNav = false, showLogoBackground = false, logoBackgroundIntense = false, showCartBackground = false, cartIconBlue = false, centerLogo = false }: HeaderProps) => {
  const { cartCount, cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showCart, setShowCart] = useState(false);

  // Determine nav text color based on current page or cart dropdown state
  const getNavTextColor = () => {
    if (forceWhiteText) {
      return "text-white hover:text-white/80"; // White text when video ends on home page
    }
    if (showCart) {
      return "text-[#1E88E5] hover:text-[#42A5F5]"; // Override to exact blue when cart is open
    }
    const path = location.pathname;
    if (path === "/collections") {
      return "text-orange-500 hover:text-orange-300"; // Collections page - Orange
    } else if (path === "/checkout") {
      return "text-green-500 hover:text-green-400"; // Checkout page - Green
    } else if (path === "/gallery") {
      return "text-blue-500 hover:text-blue-400"; // Style Gallery - Blue
    } else if (path === "/") {
      return "text-neutral-800 hover:text-neutral-500"; // Home - Modern Minimal (Dark Charcoal)
    }
    return "text-neutral-800 hover:text-neutral-500"; // Default - Modern Minimal
  };

  const navTextColor = getNavTextColor();

  // Determine if text shadow should be applied (only on home page)
  const shouldShowShadow = location.pathname === "/" && forceWhiteText;
  const textShadowClass = shouldShowShadow ? "[text-shadow:_0_1px_3px_rgb(0_0_0_/_60%),_0_2px_8px_rgb(0_0_0_/_40%)]" : "";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleCheckout = () => {
    setShowCart(false);
    navigate("/checkout");
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <header className={`sticky top-0 z-50 w-full transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className={`container flex h-16 items-center px-4 md:px-6 ${centerLogo ? "justify-center" : "justify-between"}`}>
        {/* Left spacer for centered layout */}
        {centerLogo && <div className="flex-1" />}
        
        <Link to="/" className={`flex items-center ${centerLogo ? "absolute left-1/2 -translate-x-1/2" : ""}`}>
          <img 
            src={logo} 
            alt="Teenique" 
            className={`h-12 w-auto ${showLogoBackground ? (logoBackgroundIntense ? 'bg-[#FFF8E7]/80 rounded-lg p-1 shadow-[0_0_15px_rgba(255,248,231,0.6)]' : 'bg-[#FFF8E7]/20 rounded-lg p-1 shadow-[0_0_10px_rgba(255,248,231,0.3)]') : ''}`} 
          />
        </Link>
        
        {!hideNav && !centerLogo && (
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`text-lg font-bold drop-shadow-lg transition-colors ${navTextColor} ${textShadowClass}`}
            >
              Home
            </Link>
            <Link
              to="/gallery"
              className={`text-lg font-bold drop-shadow-lg transition-colors ${navTextColor} ${textShadowClass}`}
            >
              Style Gallery
            </Link>
            <Link 
              to="/collections" 
              className={`text-lg font-bold drop-shadow-lg transition-colors ${navTextColor} ${textShadowClass}`}
            >
              Collections
            </Link>
          </nav>
        )}

        {/* Right spacer or cart for centered layout */}
        {centerLogo && <div className="flex-1 flex justify-end" />}

        <div className={`hidden md:flex items-center mr-4`}>
          <LocationPicker apiKey={(import.meta.env as any).VITE_GOOGLE_API_KEY} />
        </div>

        <div className={`relative ${centerLogo ? "" : ""}`}>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#1E88E5] transition-all duration-300"
          >
            <ShoppingCart className={`w-7 h-7 stroke-[2.5] cart-icon-pulse ${cartIconBlue ? 'text-sky-400' : 'text-black'}`} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-xs font-bold text-white shadow-lg">
                {cartCount}
              </span>
            )}
          </button>

          {/* Cart Dropdown */}
          {showCart && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-pink-100 p-6 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Shopping Cart</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="hover:bg-gray-100 p-1 rounded transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 p-3 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg border border-pink-100 hover:border-pink-300 transition"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-200 to-emerald-300 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-emerald-900">IMG</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Category: {item.category}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-bold text-pink-600">₹{item.price}</span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">Subtotal:</span>
                      <span className="text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
