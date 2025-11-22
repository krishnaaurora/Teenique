import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <img
          src={heroImage}
          alt="Teenique Fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6">
              Elegance Redefined for GenZ
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8">
              Discover fashion that speaks your language. Bold, unique, and unapologetically you.
            </p>
            <Link to="/gallery">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6">
                Explore Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Picks
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Handpicked styles that define the moment. Start your journey here.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/gallery">
            <Button variant="outline" size="lg" className="border-2">
              View All Styles
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
