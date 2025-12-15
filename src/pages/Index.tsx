import { Link } from "react-router-dom";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import CircularProductSlider from "@/components/CircularProductSlider";
import LightRays from "@/components/LightRays";
import VariableProximity from "@/components/VariableProximity";

const Index = () => {
  const featuredProducts = products.slice(0, 3);
  const heroContainerRef = useRef<HTMLElement | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header forceWhiteText={true} hideNav={true} showLogoBackground={true} logoBackgroundIntense={true} cartIconBlue={true} />

      {/* Hero Section: Teenique Branding */}
      <section ref={heroContainerRef} className="relative h-[90vh] md:h-screen overflow-hidden -mt-16">
        {/* Rays background */}
        <LightRays
          raysOrigin="top-center"
          raysColor="#e9eeff"
          raysSpeed={0.85}
          lightSpread={0.6}
          rayLength={1.0}
          followMouse={false}
          mouseInfluence={0}
          bgTopColor="#19182c"
          bgBottomColor="#070612"
          vignetteStrength={0.7}
          vignetteRoundness={1.1}
        />
        {/* Centered branding text with fade-in slide-down animation */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-[#FFF8E7]">
          <div className="fade-in-slide-down">
            <VariableProximity
              label="Teenique"
              fromFontVariationSettings="'wght' 400, 'opsz' 48"
              toFontVariationSettings="'wght' 900, 'opsz' 144"
              containerRef={heroContainerRef as React.RefObject<HTMLElement>}
              radius={100}
              falloff="exponential"
              className="variable-proximity-title succession-title"
            />
          </div>
          <div className="fade-in-slide-down" style={{ animationDelay: '0.2s' }}>
            <VariableProximity
              label="Elegance Redesigned for Gen Z"
              fromFontVariationSettings="'wght' 300, 'opsz' 24"
              toFontVariationSettings="'wght' 700, 'opsz' 96"
              containerRef={heroContainerRef as React.RefObject<HTMLElement>}
              radius={80}
              falloff="linear"
              className="variable-proximity-subtitle mt-4 succession-subtitle"
            />
          </div>
        </div>
        {/* Explore button below */}
        <div className="absolute inset-x-0 bottom-12 z-10 flex justify-center succession-button fade-in-slide-down" style={{ animationDelay: '0.4s' }}>
          <Link to="/gallery">
            <Button size="lg" className="blink-slow bg-[#D9C6A4] hover:bg-[#C9B694] text-[#0F0F0F] text-xl px-10 py-6 font-semibold rounded-full shadow-lg">
              Explore Collection
            </Button>
          </Link>
        </div>
      </section>



      {/* 3D Product Carousel */}
      <section className="py-16 md:py-24 bg-[#F5F3EF]">
        <div className="container px-4 text-center text-[#0F0F0F]">
          <p className="uppercase tracking-[0.35em] text-sm text-[#D9C6A4]">Immersive gallery</p>
          <h2 className="text-4xl md:text-5xl font-semibold mt-4">Latest Collection in 360º Clothing Orbit</h2>
          <p className="max-w-2xl mx-auto mt-4 text-[#0F0F0F]/70">
            Rotate, drag, and explore our hero pieces suspended in a weightless carousel. Hover for a glow, tap to learn
            more, or add instantly to your cart.
          </p>
        </div>
        <div className="mt-12 px-4">
          <div className="mx-auto max-w-6xl">
            <CircularProductSlider />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F0F0F] mb-4">
            Featured Picks
          </h2>
          <p className="text-[#0F0F0F]/60 max-w-2xl mx-auto">
            Handpicked styles that define the moment. Start your journey here.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} showPrice={false} showCart={false} showName={false} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/gallery">
            <Button variant="outline" size="lg" className="border-2 border-[#D9C6A4] text-[#0F0F0F] hover:bg-[#D9C6A4] hover:text-[#0F0F0F]">
              View All Styles
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
