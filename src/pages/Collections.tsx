import ProductCard from "@/components/ProductCard";
import FashionLayout from "@/components/FashionLayout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Heart } from "lucide-react";
import { products as allProducts } from "@/data/products";

const Collections = () => {
  const { cart, likes, addToCart } = useCart();
  
  // Gradient configuration provided by user
  const gradientConfig = {
    colors: [
      { color: '#cdb4db', enabled: true },
      { color: '#ffc8dd', enabled: true },
      { color: '#ffafcc', enabled: true },
      { color: '#bde0fe', enabled: true },
      { color: '#a2d2ff', enabled: false },
    ],
    speed: 4,
    horizontalPressure: 4,
    verticalPressure: 6,
    waveFrequencyX: 2,
    waveFrequencyY: 4,
    waveAmplitude: 6,
    shadows: 0,
    highlights: 4,
    colorBrightness: 1,
    colorSaturation: 3,
    wireframe: false,
    colorBlending: 5,
    backgroundColor: '#003FFF',
    backgroundAlpha: 1,
    grainScale: 0,
    grainSparsity: 0,
    grainIntensity: 0,
    grainSpeed: 0,
    resolution: 1,
    yOffset: 0,
  };

  const enabledColors = gradientConfig.colors.filter((c) => c.enabled).map((c) => c.color);
  const animDuration = Math.max(3, 20 / (gradientConfig.speed || 1));
  const bgSize = `${100 + (gradientConfig.waveAmplitude || 0) * 5}% ${100 + (gradientConfig.waveAmplitude || 0) * 3}%`;
  const gradientStyle: React.CSSProperties = {
    background: `linear-gradient(90deg, ${enabledColors.join(', ')})`,
    backgroundSize: bgSize,
    animation: `gradientShift ${animDuration}s ease infinite`,
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    opacity: 0.95,
    mixBlendMode: 'normal',
    backgroundColor: gradientConfig.backgroundColor,
  };
  
  
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
      <div className="min-h-screen pt-8 lg:pt-0 bg-[#F5F3EF] relative overflow-hidden">
        <div aria-hidden style={gradientStyle} className="gradient-shader-bg" />
        <main className="container px-4 py-16 md:py-24 lg:pl-8 relative">
          <div className="text-center mb-12">
            <p className="uppercase tracking-[0.3em] text-sm text-[#111] mb-4">Saved Looks</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#0F0F0F] mb-4 tracking-tight">
              Your Collections
            </h1>
            {/* Removed descriptive text as requested */}
            
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
                  <ProductCard key={product.id} product={product} showSizes addToCart={addToCart} />
                ))}
              </div>
              {(hasCartItems || hasLikedItems) && (
                <div className="flex justify-center mt-12">
                  <Link to="/checkout" onClick={handleProceedToCheckout}>
                    <Button
                      size="lg"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg px-12 py-6 rounded-full shadow-2xl shadow-blue-600/25 hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
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
              <div className="mx-auto mb-6 max-w-4xl">
                <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-inner" style={{ backgroundImage: "url('/image.png')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.9)' }} />
              </div>

              <p className="text-[#0F0F0F]/60 text-lg">No pieces have been saved yet.</p>
              <p className="text-[#0F0F0F]/40 text-sm">Like items or add them to your cart to see them here.</p>
              <Link to="/gallery">
                <Button 
                  size="lg" 
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-8 py-4 shadow-2xl shadow-orange-600/25 transition-all duration-300"
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
