
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

interface Artist {
  id: number;
  name: string;
  bio: string;
  imageUrl: string;
  products: number;
  featured: boolean;
}

const FeaturedArtists = () => {
  const { t } = useLanguage();
  
  const artists: Artist[] = [
    {
      id: 1,
      name: "Clara Monteiro",
      bio: "Urban landscape artist exploring the intersection of city life and nature.",
      imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      products: 7,
      featured: true,
    },
    {
      id: 2,
      name: "Rodrigo Almeida",
      bio: "Digital artist specializing in vibrant neon aesthetics and cyberpunk themes.",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      products: 5,
      featured: true,
    },
    {
      id: 3,
      name: "Julia Santos",
      bio: "Mixed media artist bringing together traditional techniques and modern digital design.",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      products: 4,
      featured: false,
    },
  ];

  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2">{t("Meet Our Artists")}</h2>
          <p className="text-muted-foreground max-w-[700px]">
            {t("Talented creators bringing unique visions to life, supported by the Paisagem platform.")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <Card key={artist.id} className="card-hover">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={artist.imageUrl} alt={artist.name} />
                    <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <h3 className="font-semibold text-xl">{artist.name}</h3>
                      {artist.featured && (
                        <Badge variant="secondary" className="bg-paisagem-teal text-white">
                          {t("Featured")}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">{artist.bio}</p>
                    
                    <Button 
                      asChild
                      variant="outline" 
                      className="mt-2 hover:bg-paisagem-purple hover:text-white transition-colors"
                    >
                      <Link to={`/artist-products/${artist.id}`}>
                        {t("View Products")} ({artist.products})
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-10">
          <Link to="/artists" className="text-paisagem-purple hover:text-paisagem-darkPurple font-medium underline underline-offset-4">
            {t("View All Artists")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtists;
