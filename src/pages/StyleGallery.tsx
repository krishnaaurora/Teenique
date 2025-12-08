import ProductCard from "@/components/ProductCard";
import FashionLayout from "@/components/FashionLayout";
import { products } from "@/data/products";
import "@/styles/handwriting.css";

const StyleGallery = () => {
  return (
    <FashionLayout>
      <div className="min-h-screen pt-8 lg:pt-0 bg-[#F5F3EF]">
        <main className="container px-4 py-12 md:py-16 lg:pl-8">
          <div className="text-center mb-12">
            <p className="uppercase tracking-[0.3em] text-sm text-[#D9C6A4] mb-4">Curated Collection</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#0F0F0F] mb-4 tracking-tight">
              Style Gallery
            </h1>
            <p className="text-[#0F0F0F]/70 max-w-2xl mx-auto text-lg">
              Discover our curated collection of trendy pieces designed for Gen-Z. 
              Express yourself with elegance redefined.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} showSizes />
            ))}
          </div>
        </main>
      </div>
    </FashionLayout>
  );
};

export default StyleGallery;
