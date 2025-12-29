import ProductCard from "@/components/ProductCard";
import FashionLayout from "@/components/FashionLayout";
import { products } from "@/data/products";
import "@/styles/handwriting.css";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

const StyleGallery = () => {
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const { addToCart, addToLikes, removeFromLikes, isLiked } = useCart();

  const addToLikesLocal = (product: any) => {
    setLikedProducts(prev => [...prev, Number(product.id)]);
    // Forward any existing variant metadata so likes/collections store correct color/image
    addToLikes(product, product.color || undefined, product.size || undefined, product.image || undefined);
  };

  const removeFromLikesLocal = (id: number) => {
    setLikedProducts(prev => prev.filter(pid => pid !== id));
    removeFromLikes(id);
  };

  const isLikedLocal = (id: number) => likedProducts.includes(id) || isLiked(id);
  return (
    <FashionLayout>
      <div className="min-h-screen pt-8 lg:pt-0 bg-[#F5F3EF]">
        <main className="container px-4 py-12 md:py-16 lg:pl-8">
          <div className="text-center mb-12">
            <p className="uppercase tracking-[0.3em] text-sm text-[#D9C6A4] mb-4">Curated Collection</p>
            <h1 className="text-heading-1 font-serif text-[#0F0F0F] mb-4 tracking-tight">
              Style Gallery
            </h1>
            <p className="text-[#0F0F0F]/70 max-w-2xl mx-auto text-lg">
              Discover our curated collection of trendy pieces designed for Gen-Z. 
              Express yourself with elegance redefined.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showSizes
                isLiked={isLikedLocal}
                addToLikes={addToLikesLocal}
                removeFromLikes={removeFromLikesLocal}
                addToCart={addToCart}
              />
            ))}
          </div>
        </main>
      </div>
    </FashionLayout>
  );
};

export default StyleGallery;
