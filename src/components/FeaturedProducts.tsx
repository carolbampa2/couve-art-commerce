
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface Product {
  id: number;
  title: string;
  artist: string;
  price: string;
  imageUrl: string;
  exclusive: boolean;
  couveRequired?: number;
}

const FeaturedProducts = () => {
  const products: Product[] = [
    {
      id: 1,
      title: "Urban Dreams",
      artist: "Clara Monteiro",
      price: "39.99",
      imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      exclusive: false,
    },
    {
      id: 2,
      title: "Neon Genesis",
      artist: "Rodrigo Almeida",
      price: "44.99",
      imageUrl: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      exclusive: true,
      couveRequired: 100,
    },
    {
      id: 3,
      title: "Tropical Harmony",
      artist: "Julia Santos",
      price: "37.99",
      imageUrl: "https://images.unsplash.com/photo-1582725461732-4fcdfb79dbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      exclusive: false,
    },
    {
      id: 4,
      title: "Crypto Dreams",
      artist: "Paulo Viera",
      price: "49.99",
      imageUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      exclusive: true,
      couveRequired: 250,
    },
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Products</h2>
          <p className="text-muted-foreground max-w-[700px]">
            Discover unique designs created by talented artists,
            with special editions available exclusively for COUVE token holders.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="card-hover overflow-hidden">
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105" 
                />
                {product.exclusive && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-paisagem-purple text-white">
                      <Lock className="h-3 w-3 mr-1" />
                      COUVE Exclusive
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="pt-4">
                <h3 className="font-medium text-lg mb-1">{product.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">By {product.artist}</p>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="font-semibold">${product.price}</span>
                  <Button size="sm" className={product.exclusive ? "bg-paisagem-gray hover:bg-paisagem-gray/90" : "gradient-bg"}>
                    {product.exclusive ? `${product.couveRequired}+ COUVE` : "Buy Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-10">
          <Button variant="outline" size="lg">View All Products</Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
