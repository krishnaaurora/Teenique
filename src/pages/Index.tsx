import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";


import CircularProductSlider from "@/components/CircularProductSlider";
import CountingNumber from "@/components/CountingNumber";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { TypingAnimation } from "@/registry/magicui/typing-animation";
import { DrawLineText } from "@/components/gsap/draw-line-text";


const Index = () => {
  const featuredProducts = products.slice(0, 3);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isBold, setIsBold] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoEnded) {
      const timer = setTimeout(() => {
        setIsBold(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [videoEnded]);

  return (
    <div className="min-h-screen bg-background">
      <Header forceWhiteText={true} hideNav={true} showLogoBackground={true} logoBackgroundIntense={true} cartIconBlue={true} isHomePage={true} />

      {/* Hero Section: Premium Gen-Z Brand */}
      <section className="w-full h-screen flex items-center justify-center relative overflow-hidden">
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover z-0 ${videoEnded ? 'blur-sm' : ''}`}
          src="/Remove_Fade_In_Animation_From_Video.mp4"
          autoPlay
          muted
          playsInline
          onEnded={() => {
            if (videoRef.current) {
              videoRef.current.pause();
            }
            setVideoEnded(true);
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 z-5"></div>
        {videoEnded && (
          <div className="relative z-10 flex flex-col items-center justify-center w-full animate-fadeIn">
            <DrawLineText
              text="Teenique"
              fontSize={120}
              strokeWidth={1.5}
              color="white"
              className="mb-0 mt-12"
            />
            <p className={`text-center text-white -mt-2 ${isBold ? 'font-bold' : 'font-normal'}`} style={{ fontSize: '24px', fontFamily: "'Helvetica', sans-serif" }}>
              Elegance Redesigned For Gen-Z
            </p>
            <div className="mt-0">
              <div className="flex gap-4 mb-8 justify-center">
                <Link to="/gallery">
                  <Button size="lg" className="bg-[#E86C0A] text-white font-bold rounded-full px-10 py-5 text-2xl shadow-lg transition-all hover:brightness-95 hover:scale-105 hover:-translate-y-0.5" style={{ fontFamily: "'Poppins', sans-serif", boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                    Shop Now &rarr;
                  </Button>
                </Link>
              </div>
              {/* Social Proof */}
              <div className="flex gap-8 mt-2 text-sm text-white/80 justify-center">
                {[{n:'50K+',t:'Happy Customers'},{n:'200+',t:'Unique Styles'},{n:'4.9',t:'Rating'}].map((s,idx)=> (
                  <div key={s.n} className="flex flex-col items-center gap-1">
                   <CountingNumber target={s.n} start={videoEnded} className="text-3xl md:text-4xl font-extrabold" style={{ fontFamily: "'Poppins', sans-serif" }} />
                     <span className="text-sm md:text-base font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>{s.t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>



      {/* 3D Product Carousel */}
      <section className="py-12 md:py-20 bg-[#F5F3EF] relative overflow-hidden">
        <div className="container px-4 text-center text-[#0F0F0F] relative z-10">
          <p className="uppercase tracking-[0.35em] text-sm" style={{ color: '#000' }}>Immersive gallery</p>
          <h2 className="text-4xl md:text-5xl font-semibold mt-4" style={{ color: '#000' }}>Latest Collection in 360º Clothing Orbit</h2>
        </div>
        <div className="mt-12 px-4 relative z-10">
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
