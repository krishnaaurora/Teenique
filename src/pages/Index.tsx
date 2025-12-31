import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";


import CircularProductSlider from "@/components/CircularProductSlider";
import ExpandableCards from "@/components/ui/expandable-cards";
import CountingNumber from "@/components/CountingNumber";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { TypingAnimation } from "@/registry/magicui/typing-animation";
import TextPressure from "@/components/TextPressure";
import { DrawLineText } from "@/components/gsap/draw-line-text";
import { Analytics } from "@vercel/analytics/next";


const Index = () => {
  const featuredProducts = [products[0], products[2]];
  const productCards = products.slice(0, 5).map((product, index) => ({
    id: index + 1,
    content: (
      <Link to={`/gallery`}>
        <img
          src={product.image}
          className="w-full h-full object-cover scale-75 transition-transform duration-300"
          alt={product.name}
        />
      </Link>
    ),
  }));
  const [videoEnded, setVideoEnded] = useState(false);
  const [isBold, setIsBold] = useState(true);
  const [textAnimationComplete, setTextAnimationComplete] = useState(false);
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
      <section className="hero-video-section">
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover object-center z-0 ${videoEnded ? 'blur-sm' : ''}`}
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
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            width: '100%',
            height: '100%'
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 z-5"></div>
        {videoEnded && (
          <div className="relative z-10 w-full h-full animate-fadeIn">
            {/* Brand text positioned prominently at top */}
            <div className="absolute top-[36%] md:top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <DrawLineText
                text="Teenique"
                fontSize={120}
                strokeWidth={1.5}
                color="white"
                className="mb-0"
                onComplete={() => setTextAnimationComplete(true)}
              />
              <p className={`absolute top-[80%] left-1/1 mt-1 md:left-1/1 md:top-[100%] md:-mt-1 text-white text-xl md:text-3xl lg:text-4xl ${isBold ? 'font-bold' : 'font-normal'}`} style={{ fontFamily: "'Helvetica', sans-serif" }}>
                Elegance Redesigned For<br />
                <span className="text-orange-400 font-bold block text-center">Gen-Z</span>
              </p>
            </div>

            {/* Shop Now button positioned below social proof as primary CTA */}
            <div className="absolute top-[59%] md:top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <Link to="/gallery">
                <button className="button">
                  <span className="text">Shop Now</span>
                  <div className="svg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </button>
              </Link>
            </div>

            {/* Social proof positioned with small gap from brand text */}
            <div className="absolute top-[64%] md:top-[74%] left-1/2 transform -translate-x-1/2 flex gap-8 text-sm text-white/80 justify-center">
                {[{n:'1K+',t:'Happy Customers'},{n:'4.9',t:'Rating'}].map((s,idx)=> (
                  <div key={idx} className="flex flex-col items-center gap-1">
                   {s.n ? <CountingNumber target={s.n} start={textAnimationComplete} duration={1000} className="text-3xl md:text-4xl font-extrabold" style={{ fontFamily: "'Poppins', sans-serif" }} /> : null}
                     <span className="text-sm md:text-base font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>{s.t}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </section>



      {/* 3D Product Carousel */}
      <section className="py-12 md:py-20 bg-[#F5F3EF] relative overflow-hidden">
        <div className="container px-4 text-center text-[#0F0F0F] relative z-10">
          <p className="uppercase tracking-[0.35em] text-sm" style={{ color: '#000' }}>Immersive gallery</p>
        <div style={{position: 'relative', height: '100px'}}>
          <TextPressure
            text="Expandable cloth view"
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="#000000"
            strokeColor="#ff0000"
            minFontSize={24}
          />
        </div>
        </div>
        <div className="mt-4 px-4 relative z-10">
          <div className="mx-auto max-w-6xl">
            <div className="h-[250px] sm:h-[450px] w-full select-none">
              <ExpandableCards
                cards={productCards}
                defaultExpanded={3}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-heading-2 font-bold text-[#0F0F0F] mb-4">
            Featured Picks
          </h2>
          <p className="text-[#0F0F0F]/60 max-w-2xl mx-auto">
            Handpicked styles that define the moment. Start your journey here.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-12 max-w-4xl mx-auto">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} showPrice={false} showCart={false} showName={false} showLike={false} />
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
