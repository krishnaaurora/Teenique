import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";


import CircularProductSlider from "@/components/CircularProductSlider";
import MagnetLines from "@/components/MagnetLines";


const Index = () => {
  const featuredProducts = products.slice(0, 3);
  const heroContainerRef = useRef<HTMLElement | null>(null);



  // Letter-by-letter animation for 'Teenique'
  const [animate, setAnimate] = useState(false);
  const [scrollFade, setScrollFade] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  useEffect(() => {
    setAnimate(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener?.('change', onChange);
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onRM = () => setPrefersReducedMotion(rm.matches);
    onRM();
    rm.addEventListener?.('change', onRM);
    return () => { mq.removeEventListener?.('change', onChange); rm.removeEventListener?.('change', onRM); };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setAnimateStats(true);
      return;
    }
    if (!animate) return;
    const delay = isMobile ? 700 : 1100;
    const t = setTimeout(() => setAnimateStats(true), delay);
    return () => clearTimeout(t);
  }, [animate, isMobile, prefersReducedMotion]);

  // subtle scroll-based micro change: reduce heading opacity slightly on scroll
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      const factor = Math.min(1, y / 200); // 0..1 over first 200px
      setScrollFade(factor);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const brand = "Teenique";
  const brandLetters = brand.split("");

  return (
    <div className="min-h-screen bg-background">
      <Header forceWhiteText={true} hideNav={true} showLogoBackground={true} logoBackgroundIntense={true} cartIconBlue={true} />

      {/* Hero Section: Premium Gen-Z Brand */}
      <section className="w-full min-h-[75vh] md:min-h-[90vh] flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-auto">
          <MagnetLines
            rows={isMobile ? 9 : 12}
            columns={isMobile ? 6 : 9}
            containerSize="100%"
            lineColor="rgba(255, 111, 94, 0.3)"
            lineWidth="0.8vmin"
            lineHeight="4.4vmin" // reduced by ~12%
            baseAngle={0}
            style={{ width: '100%', height: '100%', margin: 0 }}
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full">
          <h1 className="text-6xl md:text-9xl font-extrabold leading-tight mb-2 mt-4 text-[#111111] flex flex-wrap items-end justify-center hover:-translate-y-0.5 transition-transform"
            style={{
              transform: animate ? 'translateY(0)' : 'translateY(12px)',
              opacity: (animate ? 1 : 0) * (1 - scrollFade * 0.08),
              transition: 'transform 600ms cubic-bezier(0.22,1,0.36,1), opacity 600ms cubic-bezier(0.22,1,0.36,1)'
            }}
          >
            {brandLetters.map((char, i) => {
              const baseDelay = isMobile ? 60 : 90;
              const delay = prefersReducedMotion ? 0 : i * baseDelay;
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'translateY(0)' : `translateY(${isMobile ? 6 : 12}px)`,
                    transition: prefersReducedMotion
                      ? `opacity ${isMobile ? 250 : 400}ms linear ${delay}ms`
                      : `opacity ${isMobile ? 450 : 600}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${isMobile ? 450 : 600}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`
                  }}
                >
                  {char}
                </span>
              );
            })}
          </h1>
          <h2 className="text-4xl md:text-7xl font-bold mb-4 mt-2 text-center"
            style={{
              color: '#FF6B5C', // Warm coral for Elegance Redesigned
              transform: animate ? 'translateY(0)' : `translateY(${isMobile ? 6 : 8}px)`,
              opacity: (animate ? 1 : 0) * (1 - scrollFade * 0.08),
              transition: `transform ${isMobile ? 500 : 650}ms cubic-bezier(0.22,1,0.36,1) 150ms, opacity ${isMobile ? 500 : 650}ms cubic-bezier(0.22,1,0.36,1) 150ms`,
              filter: 'saturate(0.93)'
            }}
          >Elegance Redesigned<br/><span style={{ color: '#666666', display: 'block', fontWeight: 'bold' }}>For Gen-Z</span></h2>
          <div className="flex gap-4 mb-8 justify-center">
            <Link to="/gallery">
              <Button size="lg" className="bg-[#d35400] text-white font-bold rounded-full px-8 py-4 text-xl shadow-lg transition-all hover:brightness-95 hover:scale-105 hover:-translate-y-0.5"
                style={{
                  transform: animate ? 'scale(1)' : 'scale(0.95)',
                  opacity: animate ? 1 : 0,
                  transition: 'transform 600ms cubic-bezier(0.22,1,0.36,1) 400ms, opacity 600ms cubic-bezier(0.22,1,0.36,1) 400ms'
                }}
              >
                Shop Now &rarr;
              </Button>
            </Link>
          </div>
          {/* Social Proof */}
          <div className="flex gap-8 mt-2 text-sm text-[#18181B]/80 justify-center">
            {[{n:'50K+',t:'Happy Customers'},{n:'200+',t:'Unique Styles'},{n:'4.9',t:'Rating'}].map((s,idx)=> (
              <div key={s.n} className="flex flex-col items-center gap-1" style={{
                transform: animateStats ? 'translateY(0)' : `translateY(${isMobile?6:12}px)`,
                opacity: animateStats ? 1 : 0,
                transition: `transform 500ms cubic-bezier(0.22,1,0.36,1) ${idx*120}ms, opacity 500ms cubic-bezier(0.22,1,0.36,1) ${idx*120}ms`
              }}>
                <span className="text-3xl md:text-4xl font-extrabold">{s.n}</span>
                <span className="text-lg md:text-xl font-semibold">{s.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* 3D Product Carousel */}
      <section className="py-16 md:py-24 bg-[#F5F3EF] relative overflow-hidden">
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
