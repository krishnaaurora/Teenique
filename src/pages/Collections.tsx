import ProductCard from "@/components/ProductCard";
import FashionLayout from "@/components/FashionLayout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Heart } from "lucide-react";

const Collections = () => {
  const { cart, likes } = useCart();
  
  // Combine cart and likes, removing duplicates by id
  const cartProducts = cart.map(item => ({ id: item.id, name: item.name, price: item.price, image: item.image, category: item.category }));
  const allItems = [...likes];
  
  // Add cart items that aren't already in likes
  cartProducts.forEach(cartItem => {
    if (!allItems.some(item => item.id === cartItem.id)) {
      allItems.push(cartItem);
    }
  });
  
  const hasItems = allItems.length > 0;
  const hasCartItems = cart.length > 0;
  const hasLikedItems = likes.length > 0;

  return (
    <FashionLayout>
      <div className="min-h-screen pt-8 lg:pt-0 bg-[#F5F3EF]">
        <main className="container px-4 py-16 md:py-24 lg:pl-8">
          <div className="text-center mb-12">
            <p className="uppercase tracking-[0.3em] text-sm text-[#D9C6A4] mb-4">Saved Looks</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#0F0F0F] mb-4 tracking-tight">
              Your Collections
            </h1>
            <p className="text-[#0F0F0F]/60 max-w-2xl mx-auto text-lg">
              Your favorites and cart items in one place. Revisit your liked pieces and items ready for checkout.
            </p>
            
            {/* Stats */}
            {hasItems && (
              <div className="flex justify-center gap-8 mt-6">
                <div className="flex items-center gap-2 text-[#0F0F0F]/70">
                  <Heart className={`w-5 h-5 ${hasLikedItems ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{likes.length} Liked</span>
                </div>
                <div className="flex items-center gap-2 text-[#0F0F0F]/70">
                  <ShoppingBag className="w-5 h-5" />
                  <span>{cart.length} In Cart</span>
                </div>
              </div>
            )}
          </div>

          {hasItems ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
                {allItems.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {hasCartItems && (
                <div className="flex justify-center mt-12">
                  <Link to="/checkout">
                    <Button 
                      size="lg" 
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold text-lg px-12 py-6 rounded-full shadow-lg shadow-green-500/20 hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 space-y-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-[#D9C6A4]/10 flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-[#D9C6A4]" />
              </div>
              <p className="text-[#0F0F0F]/60 text-lg">No pieces have been saved yet.</p>
              <p className="text-[#0F0F0F]/40 text-sm">Like items or add them to your cart to see them here.</p>
              <Link to="/gallery">
                <Button 
                  size="lg" 
                  className="bg-[#D9C6A4] hover:bg-[#C9B694] text-[#0F0F0F] font-semibold rounded-full px-8 py-4 shadow-lg shadow-[#D9C6A4]/20 transition-all duration-300"
                >
                  Browse the Style Gallery
                </Button>
              </Link>
            </div>
          )}
        </main>
      </div>
    </FashionLayout>
  );
};

export default Collections;
