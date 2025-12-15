import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container px-4 py-24 text-center">
          <p className="text-lg text-muted-foreground mb-6">Product not found.</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
        </main>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Forward any variant info (if present on the product) to ensure cart shows correct image/color
    // ProductDetails has no color picker, so use product.image as the variant image when available
    addToCart(product, (product as any).color || undefined, (product as any).size || undefined, (product as any).image || undefined);
    toast.success(`${product.name} added to your cart`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-12 md:py-16">
        <button
          className="text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors mb-6"
          onClick={() => navigate(-1)}
        >
          ← Back to lifestyle
        </button>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-border/50 bg-card">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Teenique Essentials</p>
              <h1 className="text-4xl font-bold text-foreground mt-3">{product.name}</h1>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Crafted with premium materials and tailored for statement-making looks, this piece elevates any wardrobe.
              Pair it with minimalist accessories for a sleek daytime fit or layer it with bold textures for night outs.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-3xl font-semibold text-foreground">₹{product.price}</span>
              <span className="text-sm text-muted-foreground">In stock · ships in 2 days</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="px-8 bg-orange-500 hover:bg-orange-600 text-white" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/gallery")}>Explore more</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
