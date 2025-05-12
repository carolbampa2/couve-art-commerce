
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Lock, ShoppingCart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Product {
  id: number;
  title: string;
  artist: string;
  price: string;
  imageUrl: string;
  exclusive: boolean;
  couveRequired?: number;
  category: string;
  type: "tshirt" | "hoodie" | "print" | "accessory";
}

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const products: Product[] = [
    {
      id: 1,
      title: "Urban Dreams Tee",
      artist: "Clara Monteiro",
      price: "39.99",
      imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      exclusive: false,
      category: "Urban",
      type: "tshirt"
    },
    {
      id: 2,
      title: "Neon Genesis Hoodie",
      artist: "Rodrigo Almeida",
      price: "64.99",
      imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      exclusive: true,
      couveRequired: 100,
      category: "Digital",
      type: "hoodie"
    },
    {
      id: 3,
      title: "Tropical Harmony Tee",
      artist: "Julia Santos",
      price: "37.99",
      imageUrl: "https://images.unsplash.com/photo-1582725461232-4fcdfb79dbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      exclusive: false,
      category: "Nature",
      type: "tshirt"
    },
    {
      id: 4,
      title: "Crypto Dreams Print",
      artist: "Paulo Vieira",
      price: "49.99",
      imageUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      exclusive: true,
      couveRequired: 250,
      category: "Digital",
      type: "print"
    },
    {
      id: 5,
      title: "Rio Vibes Tee",
      artist: "Mariana Costa",
      price: "42.99",
      imageUrl: "https://images.unsplash.com/photo-1583744946564-b52d01a7f59e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      exclusive: false,
      category: "Urban",
      type: "tshirt"
    },
    {
      id: 6,
      title: "Street Art Cap",
      artist: "André Martins",
      price: "29.99",
      imageUrl: "https://images.unsplash.com/photo-1560774358-d727658f457c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      exclusive: false,
      category: "Street",
      type: "accessory"
    },
    {
      id: 7,
      title: "Digital Future Hoodie",
      artist: "Rodrigo Almeida",
      price: "69.99",
      imageUrl: "https://images.unsplash.com/photo-1618354691792-d1d42acfd860?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      exclusive: true,
      couveRequired: 150,
      category: "Digital",
      type: "hoodie"
    },
    {
      id: 8,
      title: "Amazonia Print",
      artist: "Julia Santos",
      price: "54.99",
      imageUrl: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      exclusive: false,
      category: "Nature",
      type: "print"
    }
  ];

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase() || 
                               product.type === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Shop Our Collection</h1>
            <p className="text-muted-foreground max-w-[700px] mb-6">
              Discover unique designs created by talented artists,
              with special editions available exclusively for COUVE token holders.
            </p>
            
            <div className="w-full max-w-4xl">
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Search products..." 
                    className="pl-10" 
                  />
                </div>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
              
              <Tabs defaultValue="all" className="w-full mb-8">
                <TabsList className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  <TabsTrigger 
                    value="all" 
                    onClick={() => setSelectedCategory("all")}
                    className="text-sm"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="tshirt" 
                    onClick={() => setSelectedCategory("tshirt")}
                    className="text-sm"
                  >
                    T-Shirts
                  </TabsTrigger>
                  <TabsTrigger 
                    value="hoodie" 
                    onClick={() => setSelectedCategory("hoodie")}
                    className="text-sm"
                  >
                    Hoodies
                  </TabsTrigger>
                  <TabsTrigger 
                    value="print" 
                    onClick={() => setSelectedCategory("print")}
                    className="text-sm"
                  >
                    Prints
                  </TabsTrigger>
                  <TabsTrigger 
                    value="accessory" 
                    onClick={() => setSelectedCategory("accessory")}
                    className="text-sm"
                  >
                    Accessories
                  </TabsTrigger>
                  <TabsTrigger 
                    value="exclusive" 
                    onClick={() => setSelectedCategory("exclusive")}
                    className="text-sm"
                  >
                    COUVE Exclusives
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
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
                    <Link to={`/checkout/${product.id}`}>
                      <Button size="sm" className={product.exclusive ? "bg-paisagem-gray hover:bg-paisagem-gray/90" : "gradient-bg"}>
                        {product.exclusive ? `${product.couveRequired}+ COUVE` : (
                          <span className="flex items-center">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Buy Now
                          </span>
                        )}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
