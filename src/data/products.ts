
import { Product } from "@/contexts/CartContext";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

import backGrey from "@/../products/PRODUCT CODE 00001H/back grey.png";
import blackJoggers from "@/../products/PRODUCT CODE 00001J/black joggers.png";
import offWhiteSweatpants from "@/../products/PRODUCT CODE 00001SP/off white sweatpants.png";
import screenshotT from "@/../products/PRODUCT CODE 00001T/Screenshot 2025-12-07 204932.png";
import screenshotH from "@/../products/PRODUCT CODE 00002H/Screenshot 2025-12-08 181544.png";
import screenshot3T_1 from "@/../products/PRODUCT CODE 00003T/Screenshot 2025-12-07 211113.png";
import redBack from "@/../products/PRODUCT CODE 00004T/red back.png";
import r2tBlackFront from "@/../products/RPODUCT CODE 00002T/black front.png";
import hoodie03HBlackFront from "@/../products/PRODUCT CODE 00003 H/black front.png";

export const products: Product[] = [
  {
    id: 7,
    name: "Back Grey Limited Edition",
    price: 899,
    image: backGrey,
    category: "Outerwear",
    code: "00001H",
  },
  {
    id: 8,
    name: "Black Joggers",
    price: 599,
    image: blackJoggers,
    category: "Bottoms",
    code: "00001j",
  },
  {
    id: 9,
    name: "Off White Sweatpants",
    price: 699,
    image: offWhiteSweatpants,
    category: "Bottoms",
    code: "00001sp",
  },
  {
    id: 10,
    name: "Graphic Tee Screenshot",
    price: 599,
    image: screenshotT,
    category: "Tops",
    code: "00001T",
  },
  {
    id: 11,
    name: "Hoodie Screenshot",
    price: 699,
    image: screenshotH,
    category: "Outerwear",
    code: "00002H",
  },
  {
    id: 12,
    name: "Tee Screenshot 3T",
    price: 599,
    image: screenshot3T_1,
    category: "Tops",
    code: "00003T",
  },
  {
    id: 13,
    name: "Green Back Top",
    price: 699,
    image: redBack,
    category: "Tops",
    code: "00004T",
  },
  {
    id: 15,
    name: "Black Front Tee",
    price: 499,
    image: r2tBlackFront,
    category: "Tops",
    code: "00002T",
  },
  {
    id: 16,
    name: "Hoodie 00003 H",
    price: 599,
    image: hoodie03HBlackFront,
    category: "Outerwear",
    code: "00003H",
  },
];
