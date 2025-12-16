import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

// Product Images (update paths as needed)
import blackBack from "@/../products/PRODUCT CODE 00005T/black back.png";
import blackFront from "@/../products/PRODUCT CODE 00005T/black front.png";
import blackLeftSleeve from "@/../products/PRODUCT CODE 00005T/black left sleeve.png";
import blackRightSleeve from "@/../products/PRODUCT CODE 00005T/black right sleeve.png";
import navyBlueBack from "@/../products/PRODUCT CODE 00005T/navy blue back.png";
import navyBlueFront from "@/../products/PRODUCT CODE 00005T/navy blue front.png";
import navyBlueLeftSleeve from "@/../products/PRODUCT CODE 00005T/navy blue left sleeve.png";
import navyBlueRightSleeve from "@/../products/PRODUCT CODE 00005T/navy blue right sleeve.png";
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

// Size options (removed 'S' and 'XXL')
const SIZE_OPTIONS = ["XS", "M", "L", "XL"];

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
  const lastClickRef = useRef(0);
  const clickTimeoutRef = useRef<number | null>(null);

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
      },
      defaultColor: "yellow",
      defaultAngle: "front",
    },
    "Hoodie Screenshot": {
      colorOptions: [
        { name: "White", key: "white", hex: "#FFFFFF" },
        { name: "Black", key: "black", hex: "#000000" },
        { name: "Grey", key: "grey", hex: "#808080" },
        { name: "Cream", key: "cream", hex: "#FFFDD0" },
        { name: "Red", key: "red", hex: "#FF0000" },
        { name: "Dusty Pink", key: "dustypink", hex: "#DCA0DC" },
        { name: "Maroon", key: "maroon", hex: "#800000" },
      ],
      angleOptions: [
        { name: "Angle 1", key: "angle1" },
        { name: "Angle 2", key: "angle2" },
        { name: "Angle 3", key: "angle3" },
        { name: "Angle 4", key: "angle4" },
      ],
      images: {
        white: {
          angle1: hoodieWhite1,
          angle2: hoodieWhite2,
          angle3: hoodieWhite3,
          angle4: hoodieWhite3,
        },
        black: {
          angle1: hoodieBlack1,
          angle2: hoodieBlack2,
          angle3: hoodieBlack3,
          angle4: hoodieBlack3,
        },
        grey: {
          angle1: hoodieGrey1,
          angle2: hoodieGrey1,
          angle3: hoodieGrey2,
          angle4: hoodieGrey2,
        },
        cream: {
          angle1: hoodieCream1,
          angle2: hoodieCream2,
          angle3: hoodieCream3,
          angle4: hoodieCream4,
        },
        red: {
          angle1: hoodieRed1,
          angle2: hoodieRed2,
          angle3: hoodieRed3,
          angle4: hoodieRed4,
        },
        dustypink: {
          angle1: hoodieDustyPink1,
          angle2: hoodieDustyPink2,
          angle3: hoodieDustyPink3,
          angle4: hoodieDustyPink4,
        },
        maroon: {
          angle1: hoodieMaroon1,
          angle2: hoodieMaroon2,
          angle3: hoodieMaroon3,
          angle4: hoodieMaroon4,
        },
      },
      defaultColor: "white",
      defaultAngle: "angle1",
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
      defaultColor: "darkgreen",
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
    "Classic Black Tee": {
      colorOptions: [{ name: "Black", key: "black", hex: "#000000" }],
      angleOptions: [{ name: "Front", key: "front" }],
      images: {
        black: { front: blackFront },
      },
      defaultColor: "black",
      defaultAngle: "front",
    },
    "Black Front Top": {
      colorOptions: [
        { name: "Black", key: "black", hex: "#000000" },
        { name: "Navy Blue", key: "navyblue", hex: "#000080" },
      ],
      angleOptions: [
        { name: "Front", key: "front" },
        { name: "Back", key: "back" },
        { name: "Left Sleeve", key: "leftsleeve" },
        { name: "Right Sleeve", key: "rightsleeve" },
      ],
      images: {
        black: {
          front: blackFront,
          back: blackBack,
          leftsleeve: blackLeftSleeve,
          rightsleeve: blackRightSleeve,
        },
        navyblue: {
          front: navyBlueFront,
          back: navyBlueBack,
          leftsleeve: navyBlueLeftSleeve,
          rightsleeve: navyBlueRightSleeve,
        },
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
      if (onCardClick) onCardClick();
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
  const removeFromLikesHandler = ctxRemoveFromLikes ?? removeFromLikes;
  const isLikedHandler = ctxIsLiked ?? isLiked;

  const liked = isLikedHandler(Number(product.id));
  const cartSource = ctxCart && ctxCart.length ? ctxCart : cart;
  const matchColor = selectedColor || 'Default';
  const matchSize = selectedSize || 'M';
  const cartItem = cartSource.find((item) => Number(item.id) === Number(product.id) && String(item.color || '') === String(matchColor) && String(item.size || '') === String(matchSize));
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    if (showSizes && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCartHandler(product as any, selectedColor || undefined, selectedSize || undefined, currentImage);
    toast.success(`${product.name} ${selectedSize ? `(${selectedSize})` : ""} added to cart!`);
  };

  const handleRemoveFromCart = () => {
    if (quantityInCart > 0) {
      removeFromCartHandler(Number(product.id), selectedColor || undefined, selectedSize || undefined);
      toast.success(`${product.name} removed from cart!`);
    } else {
      toast.error(`${product.name} is not in your cart`);
    }
  };

  const handleLike = () => {
    if (liked) {
      removeFromLikesHandler(Number(product.id), selectedColor || undefined, selectedSize || undefined);
      toast.success(`${product.name} removed from favorites!`);
    } else {
      addToLikesHandler(product as any, selectedColor || undefined, selectedSize || undefined, currentImage);
      toast.success(`${product.name} added to favorites!`);
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
          <div className="relative overflow-hidden aspect-square flex items-center justify-center bg-gray-50">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
              onDoubleClick={handleImageDoubleClick}
            />

            {/* arrows moved to modal so nothing here */}

            {/* Like Button */}
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

            {/* Product Code Badge */}
            {product.name === "Back Grey Limited Edition" && (
              <div className="absolute top-3 left-3 bg-[#D9C6A4] text-[#0F0F0F] text-xs font-mono font-bold px-2 py-1 rounded shadow">
                00001H
              </div>
            )}
          </div>

          <div className="p-4 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                {product.category}
              </p>
              {showName && (
                <div className="mt-1 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{product.code || product.name}</h3>
                    {product.color && (
                      <p className="text-xs text-[#6B6B6B] mt-1">{`Color: ${product.color}`}</p>
                    )}
                  </div>
                  {showPrice && (
                    <div className="text-lg font-bold ml-4">₹{product.price}</div>
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={handleModalClose}
        >
          <div className="relative max-w-md w-full mx-4">

            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">


              {/* Main Image */}
              <div className="px-4 pb-4">
                <div className="relative">
                  <img
                    src={config.images[selectedColor]?.[selectedAngle] || placeholderImage}
                    alt={`${product.name} - ${selectedColor} ${selectedAngle}`}
                    className="w-full max-h-[60vh] object-contain cursor-pointer"
                      onClick={cycleAngle}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                  />

                  {/* Centered left/right arrows inside modal only */}
                  {config.colorOptions.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const colors = config.colorOptions.map(c => c.key);
                          const currentIndex = colors.indexOf(selectedColor);
                          const prevIndex = (currentIndex - 1 + colors.length) % colors.length;
                          setSelectedColor(colors[prevIndex]);
                          setSelectedAngle(config.defaultAngle);
                        }}
                        aria-label="Previous color"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-transparent hover:bg-white/10 p-2 rounded-full z-20"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                        </svg>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const colors = config.colorOptions.map(c => c.key);
                          const currentIndex = colors.indexOf(selectedColor);
                          const nextIndex = (currentIndex + 1) % colors.length;
                          setSelectedColor(colors[nextIndex]);
                          setSelectedAngle(config.defaultAngle);
                        }}
                        aria-label="Next color"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent hover:bg-white/10 p-2 rounded-full z-20"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Color Swatches */}
              <div className="flex justify-center space-x-2 mb-4">
                {config.colorOptions.map((color) => (
                  <button
                    key={color.key}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColor(color.key);
                    }}
                    className={`w-8 h-8 rounded-full border-2 hover:bg-gray-200 transition-colors ${
                      selectedColor === color.key ? 'border-black' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>

              {/* size selector moved below product code inside modal */}

              {/* Product Info + compact controls (in modal) */}
              <div className="p-4 border-t flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">
                    {product.category}
                  </p>
                  <h3 className="text-lg font-bold mt-1">{product.code}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentQty = cartItem ? cartItem.quantity : 0;
                                      if (currentQty > 0) {
                                        try {
                                          updateQuantityHandler(Number(product.id), currentQty - 1, selectedColor || undefined, selectedSize || undefined);
                                        } catch (err) {}
                                      }
                    }}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 bg-[#E8E4DE] rounded-full flex items-center justify-center"
                  >
                    -
                  </button>

                  <span className="text-sm">{cartItem ? cartItem.quantity : 0}</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentQty = cartItem ? cartItem.quantity : 0;
                      if (currentQty > 0) {
                        try {
                          updateQuantityHandler(Number(product.id), currentQty + 1, selectedColor || undefined, selectedSize || undefined);
                        } catch (err) {}
                      } else {
                        addToCartHandler(product as any, selectedColor || undefined, selectedSize || undefined, currentImage);
                      }
                    }}
                    aria-label="Increase quantity"
                    className="w-8 h-8 bg-[#E8E4DE] rounded-full flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Size selector placed directly below product code in modal */}
              {showSizes && (
                <div className="flex flex-wrap gap-2 px-4 mt-2 mb-4">
                  {SIZE_OPTIONS.map((size) => (
                    <button
                      key={size}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSize(size);
                      }}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                        selectedSize === size
                          ? "border-[#D9C6A4] bg-[#D9C6A4] text-black"
                          : "border-border hover:border-[#D9C6A4] text-muted-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;