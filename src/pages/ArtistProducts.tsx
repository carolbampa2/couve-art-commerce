import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useLanguage } from "@/context/LanguageContext";

interface Artist {
  id: number;
  name: string;
  bio: string;
  imageUrl: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  artistId: number;
  exclusive: boolean;
  couveRequired?: number;
}

const ArtistProducts = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const { t } = useLanguage();
  
  // Mock artist data - in a real app, you would fetch this from an API
  const artists: Artist[] = [
    {
      id: 1,
      name: "Clara Monteiro",
      bio: "Urban landscape artist exploring the intersection of city life and nature.",
      imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 2,
      name: "Rodrigo Almeida",
      bio: "Digital artist specializing in vibrant neon aesthetics and cyberpunk themes.",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    },
    // Other artists...
  ];

  // Mock products data - in a real app, you would fetch this from an API
  const products: Product[] = [
    {
      id: "1",
      title: "Urban Dreamscape",
      description: "A fusion of city landscapes and natural elements",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      artistId: 1,
      exclusive: false,
    },
    {
      id: "2",
      title: "Neon Nights",
      description: "Vibrant cyberpunk aesthetic on comfortable cotton",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      artistId: 2,
      exclusive: true,
      couveRequired: 100,
    },
    {
      id: "3",
      title: "City Bloom",
      description: "Flowers emerging from concrete jungles",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      artistId: 1,
      exclusive: false,
    },
    {
      id: "4",
      title: "Digital Dream",
      description: "Abstract digital art translated to wearable form",
      price: 32.99,
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      artistId: 2,
      exclusive: true,
      couveRequired: 150,
    },
    {
      id: "5",
      title: "Urban Fusion",
      description: "Street art inspired geometric patterns",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      artistId: 1,
      exclusive: false,
    },
  ];

  const currentArtist = artists.find(artist => artist.id === Number(artistId));
  const artistProducts = products.filter(product => product.artistId === Number(artistId));

  if (!currentArtist) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-16">
          <div className="container">
            <h1 className="text-2xl font-bold">{t("Artist not found")}</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
            <div className="flex-shrink-0">
              <img 
                src={currentArtist.imageUrl} 
                alt={currentArtist.name}
                className="rounded-full w-32 h-32 object-cover" 
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">{currentArtist.name}</h1>
              <p className="text-muted-foreground mb-4 max-w-2xl">{currentArtist.bio}</p>
              <h2 className="text-xl font-semibold mb-2">{t("Products by")} {currentArtist.name}</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artistProducts.map(product => (
              <Card key={product.id} className="overflow-hidden">
                <AspectRatio ratio={4/3}>
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="object-cover w-full h-full transition-transform hover:scale-105"
                  />
                </AspectRatio>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{product.title}</h3>
                    <span className="font-medium">${product.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2">{product.description}</p>
                  {product.exclusive && (
                    <Badge variant="outline" className="bg-paisagem-purple text-white border-none mb-2">
                      {t("COUVE Exclusive")}
                    </Badge>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="w-full gradient-bg">
                    {t("View Details")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {artistProducts.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">{t("No products found for this artist.")}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArtistProducts;
