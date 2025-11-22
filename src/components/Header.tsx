import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import logo from "@/assets/logo.png";
import cartIcon from "@/assets/cart-icon.png";

const Header = () => {
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Teenique" className="h-12 w-auto" />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className="text-sm font-medium text-foreground hover:text-accent transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/gallery" 
            className="text-sm font-medium text-foreground hover:text-accent transition-colors"
          >
            Style Gallery
          </Link>
          <Link 
            to="/gallery" 
            className="text-sm font-medium text-foreground hover:text-accent transition-colors"
          >
            Collections
          </Link>
        </nav>

        <Link to="/gallery" className="relative">
          <img src={cartIcon} alt="Cart" className="h-8 w-8 hover:opacity-80 transition-opacity" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Header;
