import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product, useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import basketIcon from "@/assets/shopping-basket.png";

interface ProductCardProps {
  product: Product;
  showPrice?: boolean;
  showCart?: boolean;
  showName?: boolean;
  showSizes?: boolean;
}

const SIZE_OPTIONS = ["S", "M", "XL", "XXL"];

const ProductCard = ({
  product,
  showPrice = true,
  showCart = true,
  showName = true,
  showSizes = false,
}: ProductCardProps) => {
  const { addToCart, removeFromCart, cart, addToLikes, removeFromLikes, isLiked } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(SIZE_OPTIONS[0]);
  const [isHovering, setIsHovering] = useState(false);
  const liked = isLiked(product.id);
  
  // Check if product is in cart and get its quantity
  const cartItem = cart.find(item => item.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} (${selectedSize}) added to cart!`);
  };

  const handleRemoveFromCart = () => {
    if (quantityInCart > 0) {
      removeFromCart(product.id);
      toast.success(`${product.name} removed from cart!`);
    } else {
      toast.error(`${product.name} is not in your cart`);
    }
  };

  const handleLike = () => {
    if (liked) {
      removeFromLikes(product.id);
      toast.success(`${product.name} removed from favorites!`);
    } else {
      addToLikes(product);
      toast.success(`${product.name} added to favorites!`);
    }
  };

  return (
    <Card className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      <CardContent className="p-0">
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200 z-10"
          >
            <Heart
              className={`w-5 h-5 transition-colors duration-200 ${
                liked
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 hover:text-red-500"
              }`}
            />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <p className="text-xs text-[#D9C6A4] uppercase tracking-wide">
              {product.category}
            </p>
            {showName && (
              <h3 className="font-semibold text-[#0F0F0F] mt-1">
                {product.name}
              </h3>
            )}
          </div>
          {showSizes && (
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                    selectedSize === size
                      ? "border-[#D9C6A4] bg-[#D9C6A4] text-[#0F0F0F]"
                      : "border-[#E8E4DE] text-[#0F0F0F]/70 hover:border-[#D9C6A4]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

          {(showPrice || showCart) && (
            <div className="flex items-center justify-between">
              {showPrice && (
                <span className="text-lg font-bold text-[#0F0F0F]">₹{product.price}</span>
              )}
              {showCart && (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleRemoveFromCart}
                    className="rounded-full bg-[#E8E4DE] hover:bg-[#D9C6A4]/50 text-[#0F0F0F] px-3 py-2 font-semibold"
                    aria-label="Remove from cart"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </Button>
                  <Button
                    onClick={handleAddToCart}
                    className={`rounded-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 font-semibold flex items-center gap-2 transition-colors ${isHovering ? "add-to-cart-tremble" : ""}`}
                    aria-label="Add to cart"
                  >
                    <svg className="w-9 h-9" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 8m10 0l2 8m-12 0h12M9 21a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                    Add to cart
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
