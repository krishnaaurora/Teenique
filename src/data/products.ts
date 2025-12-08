import { Product } from "@/contexts/CartContext";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

export const products: Product[] = [
  {
    id: 1,
    name: "Aura Beige Blazer",
    price: 2499,
    image: product1,
    category: "Outerwear",
  },
  {
    id: 2,
    name: "Noir Leather Jacket",
    price: 3999,
    image: product2,
    category: "Outerwear",
  },
  {
    id: 3,
    name: "Luna White Crop Top",
    price: 899,
    image: product3,
    category: "Tops",
  },
  {
    id: 4,
    name: "Muse Denim Jeans",
    price: 1799,
    image: product4,
    category: "Bottoms",
  },
  {
    id: 5,
    name: "Solstice Floral Dress",
    price: 2199,
    image: product5,
    category: "Dresses",
  },
  {
    id: 6,
    name: "Neon Statement Tee",
    price: 799,
    image: product6,
    category: "Tops",
  },
];
