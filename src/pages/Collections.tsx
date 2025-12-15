import ProductCard from "@/components/ProductCard";
import FashionLayout from "@/components/FashionLayout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Heart } from "lucide-react";
import { products as allProducts } from "@/data/products";
import { useState } from "react";

const StorageDebugger: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<{ cart?: any; likes?: any; collections?: any }>({});

  const load = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('teenique_cart') || '[]');
      const likes = JSON.parse(localStorage.getItem('teenique_likes') || '[]');
      const collections = JSON.parse(localStorage.getItem('teenique_collections') || '[]');
      setData({ cart, likes, collections });
      setOpen(true);
    } catch (e) {
      setData({});
      setOpen(true);
    }
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={load}
        className="px-4 py-2 bg-[#F5F3EF] border border-[#E8E4DE] rounded-full text-sm hover:bg-white"
      >
        Show Stored Collections
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 overflow-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Local Storage: teenique_*</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => { navigator.clipboard?.writeText(JSON.stringify(data)); }} className="text-sm text-[#0F0F0F] px-3 py-1 rounded bg-[#F5F3EF]">Copy</button>
                <button onClick={() => setOpen(false)} className="text-sm text-red-500">Close</button>
              </div>
            </div>
            <pre className="whitespace-pre-wrap text-xs bg-[#F5F3EF] p-3 rounded">{JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

const Collections = () => {
  const { cart, likes, addToCart } = useCart();
  
  // Combine cart and likes, removing duplicates by id
  const cartProducts = cart.map(item => ({ id: item.id, name: item.name, price: item.price, image: item.image, category: item.category, color: item.color, size: item.size }));

  // Start with likes (ensure image fallback)
  const allItems: any[] = likes.map((l) => ({
    ...l,
    image: l.image || allProducts.find(p => p.id === l.id)?.image,
  }));

  // Add cart items that aren't already in likes (ensure fallback image)
  cartProducts.forEach(cartItem => {
    if (!allItems.some(item => item.id === cartItem.id && item.color === cartItem.color && item.size === cartItem.size)) {
      allItems.push({
        ...cartItem,
        image: cartItem.image || allProducts.find(p => p.id === cartItem.id)?.image,
      });
    }
  });
  
  const hasItems = allItems.length > 0;
  const hasCartItems = cart.length > 0;
  const hasLikedItems = likes.length > 0;

  const handleProceedToCheckout = () => {
    // Add all liked items to cart if they're not already there
    likes.forEach(likedItem => {
      const isInCart = cart.some(cartItem => cartItem.id === likedItem.id);
      if (!isInCart) {
        // Ensure we forward the liked item's variant metadata (color/size/image)
        addToCart(likedItem as any, (likedItem as any).color || undefined, (likedItem as any).size || undefined, (likedItem as any).image || undefined);
      }
    });
  };

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
            {/* Dev: show storage contents */}
            <div className="mt-4">
              <StorageDebugger />
            </div>
          </div>

          {hasItems ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
                {allItems.map((product) => (
                  <ProductCard key={product.id} product={product} showSizes addToCart={addToCart} />
                ))}
              </div>
              {(hasCartItems || hasLikedItems) && (
                <div className="flex justify-center mt-12">
                  <Link to="/checkout" onClick={handleProceedToCheckout}>
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
