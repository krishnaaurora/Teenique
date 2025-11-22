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
    name: "Oversized Beige Blazer",
    price: 89.99,
    image: product1,
    category: "Outerwear",
  },
  {
    id: 2,
    name: "Classic Leather Jacket",
    price: 129.99,
    image: product2,
    category: "Outerwear",
  },
  {
    id: 3,
    name: "Minimal White Crop Top",
    price: 34.99,
    image: product3,
    category: "Tops",
  },
  {
    id: 4,
    name: "Vintage Denim Jeans",
    price: 69.99,
    image: product4,
    category: "Bottoms",
  },
  {
    id: 5,
    name: "Floral Summer Dress",
    price: 79.99,
    image: product5,
    category: "Dresses",
  },
  {
    id: 6,
    name: "Graphic Statement Tee",
    price: 29.99,
    image: product6,
    category: "Tops",
  },
];
