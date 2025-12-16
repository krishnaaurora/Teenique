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
  const [pulseDuration, setPulseDuration] = useState(2.8);
  const [iconFloatDuration, setIconFloatDuration] = useState(1.6);
  const [iconBlinkDuration, setIconBlinkDuration] = useState(2);
  const [iconFloatDist, setIconFloatDist] = useState(14);
  
  // Combine cart and likes, removing duplicates by id
  // Show only liked/saved items in Collections (do not auto-include cart items)
  const allItems: any[] = likes.map((l) => ({
    ...l,
    image: l.image || allProducts.find(p => p.id === l.id)?.image,
  }));

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
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg px-12 py-6 rounded-full shadow-lg shadow-orange-500/20 hover:shadow-xl transition-all duration-300 flex items-center gap-3"
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
            <div
              className="text-center py-20 space-y-6 collections-anim"
              style={{
                ['--pulse-duration' as any]: `${pulseDuration}s`,
                ['--icon-float-duration' as any]: `${iconFloatDuration}s`,
                ['--icon-blink-duration' as any]: `${iconBlinkDuration}s`,
                ['--icon-float-dist' as any]: `${iconFloatDist}px`
              } as React.CSSProperties}
            >
              <div className="relative w-72 h-72 mx-auto mb-6">
                <div
                  className="absolute inset-0 rounded-full overflow-hidden"
                  style={{
                    backgroundImage: "url('/image.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.95)'
                  }}
                />

                <div className="absolute inset-0 rounded-full bg-black/6" />

                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingBag
                      className="w-14 h-14 text-white"
                      style={{ animation: 'iconFloat var(--icon-float-duration) ease-in-out infinite, iconBlink var(--icon-blink-duration) linear infinite' }}
                    />
                  </div>
                </div>

                <div className="absolute inset-0 z-10 pointer-events-none">
                  <span style={{ position: 'absolute', left: '6%', top: '18%', width: 26, height: 26, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #ff7a7a, #ff3d00)', filter: 'blur(10px)', opacity: 0.8, animation: 'pulse var(--pulse-duration) var(--pulse-delay, 0s) infinite ease-in-out', ['--pulse-delay' as any]: '0s' }} />
                  <span style={{ position: 'absolute', left: '24%', top: '8%', width: 20, height: 20, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #ffd27a, #ffb300)', filter: 'blur(8px)', opacity: 0.75, animation: 'pulse var(--pulse-duration) var(--pulse-delay, 0.3s) infinite ease-in-out', ['--pulse-delay' as any]: '0.3s' }} />
                  <span style={{ position: 'absolute', left: '72%', top: '12%', width: 30, height: 30, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #8affc1, #00d27a)', filter: 'blur(12px)', opacity: 0.7, animation: 'pulse var(--pulse-duration) var(--pulse-delay, 0.6s) infinite ease-in-out', ['--pulse-delay' as any]: '0.6s' }} />
                  <span style={{ position: 'absolute', left: '82%', top: '52%', width: 18, height: 18, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #7aa9ff, #0066ff)', filter: 'blur(8px)', opacity: 0.75, animation: 'pulse var(--pulse-duration) var(--pulse-delay, 0.6s) infinite ease-in-out', ['--pulse-delay' as any]: '0.6s' }} />
                  <span style={{ position: 'absolute', left: '44%', top: '76%', width: 28, height: 28, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #ff7aea, #ff00c8)', filter: 'blur(10px)', opacity: 0.72, animation: 'pulse var(--pulse-duration) var(--pulse-delay, 0.2s) infinite ease-in-out', ['--pulse-delay' as any]: '0.2s' }} />
                </div>

                <style>{`
                  @keyframes pulse {
                    0% { opacity: 0.25; transform: scale(0.9); }
                    50% { opacity: 1; transform: scale(1.06); }
                    100% { opacity: 0.25; transform: scale(0.9); }
                  }
                  @keyframes iconFloat {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(-var(--icon-float-dist)); }
                    100% { transform: translateY(0); }
                  }
                  @keyframes iconBlink {
                    0% { opacity: 0.95; }
                    45% { opacity: 1; }
                    55% { opacity: 0.6; }
                    100% { opacity: 0.95; }
                  }
                `}</style>
              </div>

              <p className="text-[#0F0F0F]/60 text-lg">No pieces have been saved yet.</p>
              <p className="text-[#0F0F0F]/40 text-sm">Like items or add them to your cart to see them here.</p>
              <Link to="/gallery">
                <Button 
                  size="lg" 
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-8 py-4 shadow-lg shadow-orange-500/20 transition-all duration-300"
                >
                  Browse the Style Gallery
                </Button>
              </Link>
              {/* Live tweak controls */}
              <div className="mt-6 max-w-md mx-auto bg-white/60 backdrop-blur rounded-lg p-4 shadow-inner flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-[#0F0F0F]/70">Pulse duration (s)</label>
                  <input type="range" min="0.6" max="6" step="0.1" value={pulseDuration} onChange={(e) => setPulseDuration(Number(e.target.value))} className="w-48" />
                  <span className="ml-2 w-10 text-right">{pulseDuration.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-[#0F0F0F]/70">Icon float (s)</label>
                  <input type="range" min="0.4" max="3" step="0.1" value={iconFloatDuration} onChange={(e) => setIconFloatDuration(Number(e.target.value))} className="w-48" />
                  <span className="ml-2 w-10 text-right">{iconFloatDuration.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-[#0F0F0F]/70">Icon blink (s)</label>
                  <input type="range" min="0.6" max="4" step="0.1" value={iconBlinkDuration} onChange={(e) => setIconBlinkDuration(Number(e.target.value))} className="w-48" />
                  <span className="ml-2 w-10 text-right">{iconBlinkDuration.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-[#0F0F0F]/70">Float distance (px)</label>
                  <input type="range" min="4" max="36" step="1" value={iconFloatDist} onChange={(e) => setIconFloatDist(Number(e.target.value))} className="w-48" />
                  <span className="ml-2 w-10 text-right">{iconFloatDist}px</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </FashionLayout>
  );
};

export default Collections;
