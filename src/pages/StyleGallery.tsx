import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const StyleGallery = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Style Gallery
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collection of trendy pieces designed for Gen-Z. 
            Express yourself with elegance redefined.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default StyleGallery;
