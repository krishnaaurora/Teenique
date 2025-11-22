import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product, useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import cartIcon from "@/assets/cart-icon.png";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Card className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
        </div>
        <div className="p-4 space-y-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {product.category}
            </p>
            <h3 className="font-semibold text-foreground mt-1">
              {product.name}
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            <Button
              onClick={handleAddToCart}
              size="sm"
              variant="default"
              className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
            >
              <img src={cartIcon} alt="Add to cart" className="h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
