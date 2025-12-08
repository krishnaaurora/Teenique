import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import CircularProductSlider from "@/components/CircularProductSlider";
import promoVideo from "@/assets/WhatsApp Video 2025-12-03 at 11.06.22_c94e0ad5.mp4";
import LightRays from "@/components/LightRays";
import VariableProximity from "@/components/VariableProximity";

const Index = () => {
  const featuredProducts = products.slice(0, 3);
  const [stage, setStage] = useState<"video" | "image">("video");
  const [isMuted, setIsMuted] = useState(true);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const heroContainerRef = useRef<HTMLElement | null>(null);

  // Subtitles with timestamps (in seconds)
  const subtitles = [
    { start: 0, end: 2, text: "\"I just don't know how to impress her, man. My style is a mess.\"" },
    { start: 3, end: 4, text: "\"Dude, forget that. Check out Teenique.\"" },
    { start: 6, end: 7, text: "\"Wow, this stuff is actually cool....\"" },
  ];

  // Ensure playback starts as soon as the video is mounted (muted for autoplay policy)
  useEffect(() => {
    if (stage === "video" && videoRef.current) {
      const v = videoRef.current;
      v.muted = true; // Start muted to allow autoplay
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  }, [stage]);

  // Update subtitles based on video time
  useEffect(() => {
    if (stage !== "video" || !videoRef.current) return;

    const video = videoRef.current;
    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const subtitle = subtitles.find(
        (s) => currentTime >= s.start && currentTime < s.end
      );
      setCurrentSubtitle(subtitle ? subtitle.text : "");
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [stage]);

  // Handle unmute when user clicks the video
  const handleVideoClick = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  // No overlay image after video; button remains below the hero

  return (
    <div className="min-h-screen bg-background">
      <Header forceWhiteText={stage === "image"} hideNav={true} showLogoBackground={true} logoBackgroundIntense={stage === "image"} cartIconBlue={stage === "image"} />
      
      {/* Hero Section: Video -> Image */}
      <section ref={heroContainerRef} className="relative h-[90vh] md:h-screen overflow-hidden -mt-16">
        {stage === "video" && (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={promoVideo}
              autoPlay
              muted
              playsInline
              preload="auto"
              onClick={handleVideoClick}
              onLoadedData={(e) => {
                try { e.currentTarget.play(); } catch {}
              }}
              onEnded={() => setStage("image")}
              className="w-full h-full object-cover cursor-pointer"
            />
            {/* Mute/Unmute indicator */}
            <button
              onClick={handleVideoClick}
              className="absolute bottom-6 right-6 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
              )}
            </button>
            {/* Subtitles */}
            {currentSubtitle && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 px-6 py-3 bg-black/70 rounded-lg max-w-[90%] text-center">
                <p className="text-white text-lg md:text-xl font-medium tracking-wide">
                  {currentSubtitle}
                </p>
              </div>
            )}
          </div>
        )}

        {stage === "image" && (
          <>
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
            {/* Centered branding text */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-[#FFF8E7]">
              <VariableProximity
                label="Teenique"
                fromFontVariationSettings="'wght' 400, 'opsz' 48"
                toFontVariationSettings="'wght' 900, 'opsz' 144"
                containerRef={heroContainerRef as React.RefObject<HTMLElement>}
                radius={100}
                falloff="exponential"
                className="variable-proximity-title succession-title"
              />
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
            {/* Explore button below */}
            <div className="absolute inset-x-0 bottom-12 z-10 flex justify-center succession-button">
              <Link to="/gallery">
                <Button size="lg" className="blink-slow bg-[#D9C6A4] hover:bg-[#C9B694] text-[#0F0F0F] text-xl px-10 py-6 font-semibold rounded-full shadow-lg">
                  Explore Collection
                </Button>
              </Link>
            </div>
          </>
        )}
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
