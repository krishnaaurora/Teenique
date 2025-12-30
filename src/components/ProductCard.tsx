import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Product Images (update paths as needed)
import r2tBlackBack from "@/../products/RPODUCT CODE 00002T/black back.png";
import r2tBlackFront from "@/../products/RPODUCT CODE 00002T/black front.png";
import r2tWhiteBack from "@/../products/RPODUCT CODE 00002T/white back.png";
import r2tWhiteFront from "@/../products/RPODUCT CODE 00002T/white front.png";

// Hoodie Images
import backGreyBack from "@/../products/PRODUCT CODE 00001H/back grey.png";
import backGreyFront from "@/../products/PRODUCT CODE 00001H/front grey.png";
import backGreyCloseUp from "@/../products/PRODUCT CODE 00001H/close up grey.png";
import blueBack from "@/../products/PRODUCT CODE 00001H/blue back.png";
import blueFront from "@/../products/PRODUCT CODE 00001H/blue front.png";
import blueCloseUp from "@/../products/PRODUCT CODE 00001H/blue close up.png";
import greenBack from "@/../products/PRODUCT CODE 00001H/green back.png";
import greenFront from "@/../products/PRODUCT CODE 00001H/green front.png";
import greenCloseUp from "@/../products/PRODUCT CODE 00001H/green close up.png";
import maroonBack from "@/../products/PRODUCT CODE 00001H/maroon back.png";
import maroonFront from "@/../products/PRODUCT CODE 00001H/maroon front.png";
import maroonCloseUp from "@/../products/PRODUCT CODE 00001H/maroon close up.png";

// Joggers Images
import blackJoggers from "@/../products/PRODUCT CODE 00001J/black joggers.png";
import lavenderJoggers from "@/../products/PRODUCT CODE 00001J/lavender joggers.png";

// Other Product Images
import offWhiteSweatpants from "@/../products/PRODUCT CODE 00001SP/off white sweatpants.png";
import blackSweatpants from "@/../products/PRODUCT CODE 00001SP/black sweatpants.png";
import screenshotT from "@/../products/PRODUCT CODE 00001T/Screenshot 2025-12-07 204932.png";
import screenshotT_back from "@/../products/PRODUCT CODE 00001T/Screenshot 2025-12-07 204943.png";
import screenshotT_side1 from "@/../products/PRODUCT CODE 00001T/Screenshot 2025-12-07 205409.png";
import screenshotT_side2 from "@/../products/PRODUCT CODE 00001T/Screenshot 2025-12-07 205419.png";
import screenshotT_side5 from "@/../products/PRODUCT CODE 00001T/Screenshot 2025-12-07 205503.png";
import screenshotT_side6 from "@/../products/PRODUCT CODE 00001T/Screenshot 2025-12-07 205514.png";
import screenshotT_side7 from "@/../products/PRODUCT CODE 00001T/Screenshot 2025-12-07 204819.png";
import screenshotT_side8 from "@/../products/PRODUCT CODE 00001T/Screenshot 2025-12-07 204831.png";
import screenshotT_side17 from "@/../products/PRODUCT CODE 00001T/Screenshot 2025-12-07 205625.png";
import screenshotT_side18 from "@/../products/PRODUCT CODE 00001T/Screenshot 2025-12-07 205635.png";
import screenshotH from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-08 181544.png";

// Hoodie Screenshot additional images
import hoodieWhite1 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-08 180926.png";
import hoodieWhite2 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-08 180957.png";
import hoodieWhite3 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-08 181008.png";
import hoodieBlack1 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-08 181358.png";
import hoodieBlack2 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-08 181409.png";
import hoodieBlack3 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-08 181420.png";
import hoodieGrey1 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-08 181544.png";
import hoodieGrey2 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-08 181559.png";
import hoodieCream1 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-08 181643.png";
import hoodieCream2 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-08 181653.png";
import hoodieCream3 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-08 181701.png";
import hoodieCream4 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-08 181714.png";
import hoodieRed1 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-08 181731.png";
import hoodieRed2 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-08 181740.png";
import hoodieRed3 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-08 181754.png";
import hoodieRed4 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-08 181807.png";
import hoodieDustyPink1 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-09 104451.png";
import hoodieDustyPink2 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-09 104504.png";
import hoodieDustyPink3 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-09 104524.png";
import hoodieDustyPink4 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-09 104539.png";
import hoodieMaroon1 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-09 104748.png";
import hoodieMaroon2 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-09 104759.png";
import hoodieMaroon3 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-09 104815.png";
import hoodieMaroon4 from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-09 104827.png";

// PRODUCT CODE 00003 H images
import hoodie03HBlackBack from "@/../products/PRODUCT CODE 00003 H/black back.png";
import hoodie03HBlackFront from "@/../products/PRODUCT CODE 00003 H/black front.png";
import hoodie03HBlackCloseUp from "@/../products/PRODUCT CODE 00003 H/black close up.png";
import hoodie03HPinkBack from "@/../products/PRODUCT CODE 00003 H/pink back.png";
import hoodie03HPinkFront from "@/../products/PRODUCT CODE 00003 H/pink front.png";
import hoodie03HPinkCloseUp from "@/../products/PRODUCT CODE 00003 H/pink close up.png";

import screenshot3T_1 from "@/../products/PRODUCT CODE 00003T/Screenshot 2025-12-07 211113.png";
import screenshot3T_2 from "@/../products/PRODUCT CODE 00003T/Screenshot 2025-12-07 211125.png";
import screenshot3T_3 from "@/../products/PRODUCT CODE 00003T/Screenshot 2025-12-07 211210.png";
import screenshot3T_4 from "@/../products/PRODUCT CODE 00003T/Screenshot 2025-12-07 211223.png";
import screenshot3T_5 from "@/../products/PRODUCT CODE 00003T/Screenshot 2025-12-07 211244.png";
import screenshot3T_6 from "@/../products/PRODUCT CODE 00003T/Screenshot 2025-12-07 211257.png";
import screenshot3T_7 from "@/../products/PRODUCT CODE 00003T/Screenshot 2025-12-07 211309.png";
import screenshot3T_8 from "@/../products/PRODUCT CODE 00003T/Screenshot 2025-12-07 211317.png";
import screenshot3T_9 from "@/../products/PRODUCT CODE 00003T/Screenshot 2025-12-07 211330.png";
import screenshot3T_10 from "@/../products/PRODUCT CODE 00003T/Screenshot 2025-12-07 211344.png";
import screenshot3T_11 from "@/../products/PRODUCT CODE 00003T/Screenshot 2025-12-07 211358.png";
import screenshot3T_12 from "@/../products/PRODUCT CODE 00003T/Screenshot 2025-12-07 211410.png";
import screenshot3T_13 from "@/../products/PRODUCT CODE 00003T/Screenshot 2025-12-07 215440.png";
import screenshot3T_14 from "@/../products/PRODUCT CODE 00003T/Screenshot 2025-12-07 215518.png";
import screenshot3T_15 from "@/../products/PRODUCT CODE 00003T/Screenshot 2025-12-07 215551.png";
import screenshot3T_16 from "@/../products/PRODUCT CODE 00003T/Screenshot 2025-12-07 215602.png";
import screenshot3T_17 from "@/../products/PRODUCT CODE 00003T/Screenshot 2025-12-07 215822.png";
import screenshot3T_18 from "@/../products/PRODUCT CODE 00003T/Screenshot 2025-12-07 215831.png";
import screenshot3T_19 from "@/../products/PRODUCT CODE 00003T/Screenshot 2025-12-07 215839.png";
import screenshot3T_20 from "@/../products/PRODUCT CODE 00003T/Screenshot 2025-12-07 215849.png";
import redBack from "@/../products/PRODUCT CODE 00004T/red back.png";
import redFront from "@/../products/PRODUCT CODE 00004T/red front.png";
import redLeftSleeve from "@/../products/PRODUCT CODE 00004T/red left sleeve.png";
import redRightSleeve from "@/../products/PRODUCT CODE 00004T/red right sleeve.png";
import whiteBack from "@/../products/PRODUCT CODE 00004T/white back.png";
import whiteFront from "@/../products/PRODUCT CODE 00004T/white front.png";
import whiteLeftSleeve from "@/../products/PRODUCT CODE 00004T/white left sleeve.png";
import whiteRightSleeve from "@/../products/PRODUCT CODE 00004T/white right sleeve.png";

// Placeholder for missing images (add real ones later)
const placeholderImage = "https://via.placeholder.com/600";

// Size options (added 'S')
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL"];

// Function to generate original price (2x of actual price for fixed discount)
const generateOriginalPrice = (actualPrice: number) => {
  return Math.round(actualPrice * 2);
};

// Function to calculate discount percentage
const calculateDiscount = (originalPrice: number, actualPrice: number) => {
  return Math.round(((originalPrice - actualPrice) / originalPrice) * 100);
};

interface ProductCardProps {
  product: {
    id: string | number;
    name: string;
    category: string;
    price: number;
    image?: string;
    sizes?: string[];
    color?: string;
    size?: string;
    code?: string;
  };
  showName?: boolean;
  showSizes?: boolean;
  showPrice?: boolean;
  showCart?: boolean;
  showLike?: boolean;
  addToCart?: (product: any, size?: string) => void;
  removeFromCart?: (id: string, color?: string, size?: string) => void;
  isLiked?: (id: string) => boolean;
  addToLikes?: (product: any, color?: string, size?: string, variantImage?: string) => void;
  removeFromLikes?: (id: string, color?: string, size?: string) => void;
  cart?: { id: string; quantity: number }[];
  toast?: {
    success: (msg: string) => void;
    error: (msg: string) => void;
  };
  onCardClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showName = true,
  showSizes = true,
  showPrice = true,
  showCart = true,
  showLike = true,
  addToCart = () => {},
  removeFromCart = () => {},
  isLiked = () => false,
  addToLikes = () => {},
  removeFromLikes = () => {},
  cart = [],
  toast = { success: () => {}, error: () => {} },
  onCardClick,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(
    showSizes ? "M" : ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{size?: string; color?: string; quantity?: string}>({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const lastClickRef = useRef(0);
  const clickTimeoutRef = useRef<number | null>(null);
  const reviewsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (reviewsScrollRef.current) {
        const el = reviewsScrollRef.current;
        el.scrollLeft += 1;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
          el.scrollLeft = 0;
        }
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Handle browser back button to close modal
  useEffect(() => {
    if (isModalOpen) {
      const handlePopState = () => {
        setIsModalOpen(false);
      };
      window.addEventListener('popstate', handlePopState);
      // Push a new history entry to enable back
      history.pushState(null, '', window.location.href);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isModalOpen]);

  // Product-specific image map
  const productImageMap: Record<
    string,
    {
      colorOptions: { name: string; key: string; hex: string }[];
      angleOptions: { name: string; key: string }[];
      images: Record<string, Record<string, string>>;
      defaultColor: string;
      defaultAngle: string;
    }
  > = {
    "Back Grey Limited Edition": {
      colorOptions: [
        { name: "Grey", key: "grey", hex: "#3A3A3A" },
        { name: "Blue", key: "blue", hex: "#223A63" },
        { name: "Green", key: "green", hex: "#2C5B3D" },
        { name: "Maroon", key: "maroon", hex: "#800000" },
      ],
      angleOptions: [
        { name: "Back", key: "back" },
        { name: "Front", key: "front" },
        { name: "Close Up", key: "closeup" },
      ],
      images: {
        grey: {
          back: backGreyBack,
          front: backGreyFront,
          closeup: backGreyCloseUp,
        },
        blue: {
          back: blueBack,
          front: blueFront,
          closeup: blueCloseUp,
        },
        green: {
          back: greenBack,
          front: greenFront,
          closeup: greenCloseUp,
        },
        maroon: {
          back: maroonBack,
          front: maroonFront,
          closeup: maroonCloseUp,
        },
      },
      defaultColor: "grey",
      defaultAngle: "front",
    },
    "Black Joggers": {
      colorOptions: [
        { name: "Black", key: "black", hex: "#000000" },
        { name: "Lavender", key: "lavender", hex: "#E6E6FA" },
      ],
      angleOptions: [
        { name: "Back", key: "back" },
        { name: "Front", key: "front" },
        { name: "Close Up", key: "closeup" },
      ],
      images: {
        black: {
          back: blackJoggers,
          front: blackJoggers,
          closeup: blackJoggers,
        },
        lavender: {
          back: lavenderJoggers,
          front: lavenderJoggers,
          closeup: lavenderJoggers,
        },
      },
      defaultColor: "black",
      defaultAngle: "front",
    },
    "Off White Sweatpants": {
      colorOptions: [
        { name: "Off White", key: "offwhite", hex: "#FAF9F6" },
        { name: "Black", key: "black", hex: "#000000" },
      ],
      angleOptions: [
        { name: "Front", key: "front" },
      ],
      images: {
        offwhite: {
          front: offWhiteSweatpants,
        },
        black: {
          front: blackSweatpants,
        },
      },
      defaultColor: "offwhite",
      defaultAngle: "front",
    },
    "Graphic Tee Screenshot": {
      colorOptions: [
        { name: "Yellow", key: "yellow", hex: "#FFFF00" },
        { name: "Grey", key: "grey", hex: "#808080" },
        { name: "Green", key: "green", hex: "#008000" },
        { name: "Brown", key: "brown", hex: "#A52A2A" },
        { name: "Lavender", key: "lavender", hex: "#E6E6FA" },
        { name: "Black", key: "black", hex: "#000000" },
      ],
      angleOptions: [
        { name: "Front", key: "front" },
        { name: "Back", key: "back" },
        { name: "Side 1", key: "side1" },
        { name: "Side 2", key: "side2" },
        { name: "Side 5", key: "side5" },
        { name: "Side 6", key: "side6" },
        { name: "Side 7", key: "side7" },
        { name: "Side 8", key: "side8" },
        { name: "Side 17", key: "side17" },
        { name: "Side 18", key: "side18" },
      ],
      images: {
        yellow: {
          front: screenshotT_side7,
          back: screenshotT_side7,
          side1: screenshotT_side7,
          side2: screenshotT_side7,
          side5: screenshotT_side7,
          side6: screenshotT_side7,
          side7: screenshotT_side7,
          side8: screenshotT_side7,
          side17: screenshotT_side7,
          side18: screenshotT_side7,
        },
        grey: {
          front: screenshotT,
          back: screenshotT,
          side1: screenshotT,
          side2: screenshotT,
          side5: screenshotT,
          side6: screenshotT,
          side7: screenshotT,
          side8: screenshotT,
          side17: screenshotT,
          side18: screenshotT,
        },
        green: {
          front: screenshotT_side1,
          back: screenshotT_side1,
          side1: screenshotT_side1,
          side2: screenshotT_side1,
          side5: screenshotT_side1,
          side6: screenshotT_side1,
          side7: screenshotT_side1,
          side8: screenshotT_side1,
          side17: screenshotT_side1,
          side18: screenshotT_side1,
        },
        brown: {
          front: screenshotT_side5,
          back: screenshotT_side5,
          side1: screenshotT_side5,
          side2: screenshotT_side5,
          side5: screenshotT_side5,
          side6: screenshotT_side5,
          side7: screenshotT_side5,
          side8: screenshotT_side5,
          side17: screenshotT_side5,
          side18: screenshotT_side5,
        },
        lavender: {
          front: screenshotT_side17,
          back: screenshotT_side17,
          side1: screenshotT_side17,
          side2: screenshotT_side17,
          side5: screenshotT_side17,
          side6: screenshotT_side17,
          side7: screenshotT_side17,
          side8: screenshotT_side17,
          side17: screenshotT_side17,
          side18: screenshotT_side17,
        },
        black: {
          front: screenshotT_back,
          back: screenshotT_back,
          side1: screenshotT_back,
          side2: screenshotT_back,
          side5: screenshotT_back,
          side6: screenshotT_back,
          side7: screenshotT_back,
          side8: screenshotT_back,
          side17: screenshotT_back,
          side18: screenshotT_back,
        },
      },
      defaultColor: "black",
      defaultAngle: "front",
    },
    "Hoodie Screenshot": {
      colorOptions: [
        { name: "Black", key: "black", hex: "#000000" },
      ],
      angleOptions: [
        { name: "Front", key: "front" },
      ],
      images: {
        black: {
          front: screenshotH,
        },
      },
      defaultColor: "black",
      defaultAngle: "front",
    },
    "Tee Screenshot 3T": {
      colorOptions: [
        { name: "Dark Green", key: "darkgreen", hex: "#006400" },
        { name: "Black", key: "black", hex: "#000000" },
        { name: "Maroon", key: "maroon", hex: "#800000" },
        { name: "Navy Blue", key: "navyblue", hex: "#000080" },
      ],
      angleOptions: [
        { name: "Angle 1", key: "angle1" },
        { name: "Angle 2", key: "angle2" },
        { name: "Angle 3", key: "angle3" },
        { name: "Angle 4", key: "angle4" },
        { name: "Angle 5", key: "angle5" },
      ],
      images: {
        darkgreen: {
          angle1: screenshot3T_1,
          angle2: screenshot3T_2,
          angle3: screenshot3T_3,
          angle4: screenshot3T_4,
          angle5: screenshot3T_5,
        },
        black: {
          angle1: screenshot3T_6,
          angle2: screenshot3T_7,
          angle3: screenshot3T_8,
          angle4: screenshot3T_9,
          angle5: screenshot3T_10,
        },
        maroon: {
          angle1: screenshot3T_11,
          angle2: screenshot3T_12,
          angle3: screenshot3T_13,
          angle4: screenshot3T_14,
          angle5: screenshot3T_15,
        },
        navyblue: {
          angle1: screenshot3T_16,
          angle2: screenshot3T_17,
          angle3: screenshot3T_18,
          angle4: screenshot3T_19,
          angle5: screenshot3T_20,
        },
      },
      defaultColor: "black",
      defaultAngle: "angle1",
    },
    "Green Back Top": {
      colorOptions: [
        { name: "Green", key: "green", hex: "#008000" },
        { name: "White", key: "white", hex: "#FFFFFF" },
      ],
      angleOptions: [
        { name: "Front", key: "front" },
        { name: "Back", key: "back" },
        { name: "Left Sleeve", key: "leftsleeve" },
        { name: "Right Sleeve", key: "rightsleeve" },
      ],
      images: {
        green: {
          front: redFront,
          back: redBack,
          leftsleeve: redLeftSleeve,
          rightsleeve: redRightSleeve,
        },
        white: {
          front: whiteFront,
          back: whiteBack,
          leftsleeve: whiteLeftSleeve,
          rightsleeve: whiteRightSleeve,
        },
      },
      defaultColor: "green",
      defaultAngle: "back",
    },
    "R2T Oversized Tee": {
      colorOptions: [
        { name: "Black", key: "black", hex: "#000000" },
        { name: "White", key: "white", hex: "#FFFFFF" },
      ],
      angleOptions: [
        { name: "Front", key: "front" },
        { name: "Back", key: "back" },
      ],
      images: {
        black: { front: r2tBlackFront, back: r2tBlackBack },
        white: { front: r2tWhiteFront, back: r2tWhiteBack },
      },
      defaultColor: "black",
      defaultAngle: "front",
    },
    "Hoodie 00003 H": {
      colorOptions: [
        { name: "Black", key: "black", hex: "#000000" },
        { name: "Pink", key: "pink", hex: "#FFC0CB" },
      ],
      angleOptions: [
        { name: "Back", key: "back" },
        { name: "Front", key: "front" },
        { name: "Close Up", key: "closeup" },
      ],
      images: {
        black: {
          back: hoodie03HBlackBack,
          front: hoodie03HBlackFront,
          closeup: hoodie03HBlackCloseUp,
        },
        pink: {
          back: hoodie03HPinkBack,
          front: hoodie03HPinkFront,
          closeup: hoodie03HPinkCloseUp,
        },
      },
      defaultColor: "black",
      defaultAngle: "front",
    },
  };

  const config = productImageMap[product.name];
  const hasModalSwatches = !!config;

  const [selectedColor, setSelectedColor] = useState<string>(
    hasModalSwatches ? config.defaultColor : ""
  );
  const [selectedAngle, setSelectedAngle] = useState<string>(
    hasModalSwatches ? config.defaultAngle : ""
  );

  const currentImage =
    hasModalSwatches && config.images[selectedColor]?.[selectedAngle]
      ? config.images[selectedColor][selectedAngle]
      : product.image || placeholderImage;

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);

  const handleCardClick = () => {
    // If there's an existing pending single-click action, treat this as a double-click/tap and cancel it
    if (clickTimeoutRef.current) {
      window.clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      return; // double-tap detected — do not trigger favorite
    }

    // Schedule single-click action; if a second tap/click occurs within 300ms, it will be cancelled
    clickTimeoutRef.current = window.setTimeout(() => {
      clickTimeoutRef.current = null;
      if (onCardClick) {
        onCardClick();
      } else if (hasModalSwatches) {
        setIsModalOpen(true);
      }
    }, 300) as unknown as number;
  };

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        window.clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }
    };
  }, []);

  const cycleAngle = () => {
    if (!hasModalSwatches) return;
    const angles = config.angleOptions.map(a => a.key);
    const currentIndex = angles.indexOf(selectedAngle);
    setSelectedAngle(angles[(currentIndex + 1) % angles.length]);
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchEndY(null);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !touchStartY || !touchEndY || !hasModalSwatches) return;
    const distanceX = touchStart - touchEnd;
    const distanceY = touchStartY - touchEndY;
    const isHorizontal = Math.abs(distanceX) > Math.abs(distanceY);
    if (isHorizontal) {
      const isLeftSwipe = distanceX > minSwipeDistance;
      const isRightSwipe = distanceX < -minSwipeDistance;
      if (isLeftSwipe || isRightSwipe) {
        const angles = config.angleOptions.map(a => a.key);
        const currentIndex = angles.indexOf(selectedAngle);
        if (isLeftSwipe) {
          setSelectedAngle(angles[(currentIndex + 1) % angles.length]);
        } else {
          setSelectedAngle(angles[(currentIndex - 1 + angles.length) % angles.length]);
        }
      }
    } else {
      const isUpSwipe = distanceY > minSwipeDistance;
      const isDownSwipe = distanceY < -minSwipeDistance;
      if (isUpSwipe || isDownSwipe) {
        const colors = config.colorOptions.map(c => c.key);
        if (colors.length <= 1) return;
        const currentIndex = colors.indexOf(selectedColor);
        if (isUpSwipe) {
          setSelectedColor(colors[(currentIndex + 1) % colors.length]);
        } else {
          setSelectedColor(colors[(currentIndex - 1 + colors.length) % colors.length]);
        }
        // reset to default angle when changing color
        setSelectedAngle(config.defaultAngle);
      }
    }
  };

  // Prefer CartContext handlers, fall back to props when provided
  const cartContext = useCart();
  const {
    addToCart: ctxAddToCart,
    removeFromCart: ctxRemoveFromCart,
    updateQuantity: ctxUpdateQuantity,
    addToLikes: ctxAddToLikes,
    removeFromLikes: ctxRemoveFromLikes,
    isLiked: ctxIsLiked,
    cart: ctxCart,
  } = cartContext;

  const addToCartHandler = ctxAddToCart ?? addToCart;
  const removeFromCartHandler = ctxRemoveFromCart ?? removeFromCart;
  const updateQuantityHandler = ctxUpdateQuantity ?? (() => {});
  const addToLikesHandler = ctxAddToLikes ?? addToLikes;

  const { toast: showToast } = useToast();
  const navigate = useNavigate();
  const removeFromLikesHandler = ctxRemoveFromLikes ?? removeFromLikes;
  const isLikedHandler = ctxIsLiked ?? isLiked;

  const liked = isLikedHandler(Number(product.id));
  const cartSource = ctxCart && ctxCart.length ? ctxCart : cart;
  const matchColor = selectedColor || 'Default';
  const matchSize = selectedSize || 'M';
  const cartItem = cartSource.find((item) => Number(item.id) === Number(product.id) && String(item.color || '') === String(matchColor) && String(item.size || '') === String(matchSize));
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    // Clear previous errors
    setValidationErrors({});

    // Validate selections
    const errors: {size?: string; color?: string; quantity?: string} = {};

    if (showSizes && !selectedSize) {
      errors.size = "Please select a size";
    }

    if (hasModalSwatches && !selectedColor) {
      errors.color = "Please select a color";
    }

    const currentQuantity = cartItem ? cartItem.quantity : 0;
    if (currentQuantity < 1) {
      errors.quantity = "Please select quantity";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Add to cart
    setIsAddingToCart(true);
    addToCartHandler(product as any, selectedColor || undefined, selectedSize || undefined, currentImage);

    // Show success feedback
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });

    // Reset button after 2 seconds
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    // Clear previous errors
    setValidationErrors({});

    // Set defaults if not selected
    if (showSizes && !selectedSize) {
      setSelectedSize('M');
    }
    if (hasModalSwatches && !selectedColor) {
      setSelectedColor(config?.defaultColor || 'default');
    }

    // Validate selections (now should pass with defaults)
    const errors: {size?: string; color?: string; quantity?: string} = {};

    // Removed validations since we set defaults

    // Determine the selected image
    const selectedImage = config?.images[selectedColor]?.[selectedAngle] || placeholderImage;

    // Add item to cart and navigate to checkout
    addToCartHandler(product, selectedColor || undefined, selectedSize || undefined, selectedImage);

    // Navigate to checkout
    setIsModalOpen(false);
    setTimeout(() => navigate('/checkout'), 100);
  };

  const handleRemoveFromCart = () => {
    if (quantityInCart > 0) {
      removeFromCartHandler(Number(product.id), selectedColor || undefined, selectedSize || undefined);
      showToast({
        title: "Removed from cart",
        description: `${product.name} has been removed from your cart.`,
        variant: "destructive"
      });
    } else {
      showToast({
        title: "Not in cart",
        description: `${product.name} is not in your cart.`,
        variant: "destructive"
      });
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    if (liked) {
      removeFromLikesHandler(Number(product.id), selectedColor || undefined, selectedSize || undefined);
      showToast({
        title: "Removed from favorites",
        description: `${product.name} has been removed from your favorites.`,
      });
    } else {
      addToLikesHandler(product as any, selectedColor || undefined, selectedSize || undefined, currentImage);
      showToast({
        title: "Added to favorites",
        description: `${product.name} has been added to your favorites.`,
      });
    }
  };

  const handleImageDoubleClick = () => {
    if (hasModalSwatches) setIsModalOpen(true);
  };

  const handleModalClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Card
        className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleCardClick}
      >
        <CardContent className="p-0">
          <div className={`relative overflow-hidden aspect-square flex items-center justify-center ${product.code === '00002H' ? 'bg-white' : 'bg-gray-50'}`}>
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
              onDoubleClick={handleImageDoubleClick}
            />

            {/* arrows moved to modal so nothing here */}

            {/* Like Button */}
            {showLike && (
              <button
                onClick={handleLike}
                className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all z-10"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    liked ? "fill-red-500 text-red-500" : "text-gray-700 hover:text-red-500"
                  }`}
                />
              </button>
            )}

            {/* Product Code Badge */}
            {product.name === "Back Grey Limited Edition" && (
              <div className="absolute top-3 left-3 bg-[#D9C6A4] text-[#0F0F0F] text-xs font-mono font-bold px-2 py-1 rounded shadow">
                00001H
              </div>
            )}
          </div>

          <div className="p-2 space-y-1">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                {product.category}
              </p>
              {showName && (
                <div className="mt-0.5 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-xs text-foreground">{product.code || product.name}</h3>
                    {product.color && (
                      <p className="text-xs text-[#6B6B6B] mt-0.5">{`Color: ${product.color}`}</p>
                    )}
                  </div>
                  {showPrice && (
                    <div className="text-xs font-bold ml-3">
                      <span className="line-through text-gray-500 mr-2">₹{generateOriginalPrice(product.price)}</span>
                      <span className="text-green-600">₹{product.price}</span>
                      <span className="text-[10px] text-red-500 ml-1">({calculateDiscount(generateOriginalPrice(product.price), product.price)}% off)</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Modal */}
      {isModalOpen && hasModalSwatches && config && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={handleModalClose}
        >
          <div
            className="relative w-full h-full bg-white overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row h-full md:h-auto">
              {/* Mobile: Product Info First, Desktop: Image Left, Details Right */}
              <div className="order-2 md:order-2 md:w-1/2 p-4 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto">
                  {/* Product Title */}
                  <h2 className="text-heading-3 font-bold text-gray-900 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {product.name}
                  </h2>

                  {/* Price */}
                  <div className="mb-3">
                    <span className="text-base md:text-lg font-semibold text-gray-500 line-through mr-3">₹{generateOriginalPrice(product.price)}</span>
                    <span className="text-base md:text-lg font-semibold text-green-600">₹{product.price}</span>
                    <span className="text-xs text-red-500 ml-2">({calculateDiscount(generateOriginalPrice(product.price), product.price)}% off)</span>
                  </div>

                  {/* Product Code */}
                  <p className="text-sm text-gray-600 mb-2">Product Code: {product.code}</p>

                  {/* Description Collapsible */}
                  <Collapsible className="mb-4">
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left border-t pt-4">
                      <span className="text-sm font-medium">Description</span>
                      <span className="text-sm">▼</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <p className="text-xs md:text-sm text-gray-700 mt-2">
                        Crafted with premium materials and tailored for statement-making looks. Pair it with minimalist accessories for a sleek daytime fit or layer it with bold textures for night outs.
                      </p>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Customer Reviews Collapsible */}
                  <Collapsible className="mb-4">
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left border-t pt-4">
                      <span className="text-sm font-medium">Customer Reviews (3)</span>
                      <span className="text-sm">▼</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div ref={reviewsScrollRef} className="overflow-x-auto pb-2 mt-2">
                        <div className="flex gap-4 min-w-max">
                          <div className="border rounded-lg p-3 min-w-[250px]">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">John D.</span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400">★</span>
                                  ))}
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">2 days ago</span>
                            </div>
                            <p className="text-sm text-gray-700">Amazing quality! Fits perfectly and looks even better in person. Highly recommend for everyday wear.</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>Verified Purchase</span>
                              <span>Helpful (12)</span>
                            </div>
                          </div>
                          <div className="border rounded-lg p-3 min-w-[250px]">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Sarah M.</span>
                                <div className="flex">
                                  {[...Array(4)].map((_, i) => (
                                    <span key={i} className="text-yellow-400">★</span>
                                  ))}
                                  <span className="text-gray-300">★</span>
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">1 week ago</span>
                            </div>
                            <p className="text-sm text-gray-700">Love the design, but runs a bit small. Would recommend sizing up if you're between sizes.</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>Verified Purchase</span>
                              <span>Helpful (8)</span>
                            </div>
                          </div>
                          <div className="border rounded-lg p-3 min-w-[250px]">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Alex K.</span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400">★</span>
                                  ))}
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">3 days ago</span>
                            </div>
                            <p className="text-sm text-gray-700">Perfect for everyday wear. Comfortable material and stylish design. Will definitely buy again!</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>Verified Purchase</span>
                              <span>Helpful (15)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Stock Status */}
                  <div className="mb-4">
                    <span className="text-xs text-green-600 font-medium">In Stock</span>
                  </div>

                  {/* Size Selection */}
                  {showSizes && (
                    <div className="mb-4">
                      <h3 className="text-xs font-medium text-gray-900 mb-2">Size</h3>
                      <div className="flex gap-2">
                        {SIZE_OPTIONS.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                              selectedSize === size
                                ? "border-black bg-black text-white"
                                : "border-gray-300 hover:border-gray-400 text-gray-700"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      {validationErrors.size && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-600 text-xs font-medium">⚠️ Please select a size to continue</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Color Selection */}
                  <div className="mb-4">
                    <h3 className="text-xs font-medium text-gray-900 mb-2">Color</h3>
                    <div className="flex gap-2">
                      {config.colorOptions.map((color) => (
                        <button
                          key={color.key}
                          onClick={() => {
                            setSelectedColor(color.key);
                            setSelectedAngle(config.defaultAngle);
                          }}
                          className={`w-6 h-6 rounded-full border-2 ${
                            selectedColor === color.key ? 'border-black' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>
                    {validationErrors.color && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-xs font-medium">⚠️ Please select a color to continue</p>
                      </div>
                    )}
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-6">
                    <h3 className="text-xs font-medium text-gray-900 mb-2">Quantity</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => {
                            const currentQty = cartItem ? cartItem.quantity : 0;
                            if (currentQty > 0) {
                              try {
                                updateQuantityHandler(Number(product.id), currentQty - 1, selectedColor || undefined, selectedSize || undefined);
                              } catch (err) {}
                            }
                          }}
                          className="px-2 py-1 hover:bg-gray-50 text-sm"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 border-x border-gray-300 text-sm">{cartItem ? cartItem.quantity : 0}</span>
                        <button
                          onClick={() => {
                            const currentQty = cartItem ? cartItem.quantity : 0;
                            if (currentQty > 0) {
                              try {
                                updateQuantityHandler(Number(product.id), currentQty + 1, selectedColor || undefined, selectedSize || undefined);
                              } catch (err) {}
                            } else {
                              addToCartHandler(product as any, selectedColor || undefined, selectedSize || undefined, currentImage);
                            }
                          }}
                          className="px-2 py-1 hover:bg-gray-50 text-sm"
                        >
                          +
                        </button>
                      </div>
                      {validationErrors.quantity && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-600 text-xs font-medium">⚠️ Please select quantity to continue</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* CTA Buttons - Sticky at bottom */}
                <div className="flex-shrink-0 border-t pt-4 mt-4">
                  <div className="space-y-2">
                    <Button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                      className="w-full bg-black hover:bg-gray-800 text-white py-2.5 text-base font-medium disabled:opacity-50"
                    >
                      {isAddingToCart ? "Added ✓" : "Add to Cart"}
                    </Button>
                    <Button
                      onClick={handleBuyNow}
                      disabled={isBuyingNow}
                      variant="outline"
                      className="w-full border-2 border-black text-black hover:bg-black hover:text-white py-2.5 text-base font-medium disabled:opacity-50"
                    >
                      {isBuyingNow ? "Processing..." : "Buy Now"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Image Section - Desktop: Left, Mobile: Above */}
              <div className="order-1 md:order-1 md:w-1/2 p-4">
                <div className="relative">
                  <img
                    src={config.images[selectedColor]?.[selectedAngle] || placeholderImage}
                    alt={`${product.name} - ${selectedColor} ${selectedAngle}`}
                    className="w-full h-auto max-h-[40vh] md:max-h-[60vh] object-contain rounded-lg"
                    onClick={cycleAngle}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                  />

                  {/* Navigation Arrows Removed */}
                </div>

                {/* Angle/View Selection Buttons Below Image */}
                {config.angleOptions.length > 1 && (
                  <div className="mt-4">
                    <div className="flex justify-center gap-2 flex-wrap">
                      {config.angleOptions.map((angle) => (
                        <button
                          key={angle.key}
                          onClick={() => setSelectedAngle(angle.key)}
                          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                            selectedAngle === angle.key
                              ? "border-black bg-black text-white"
                              : "border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {angle.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;