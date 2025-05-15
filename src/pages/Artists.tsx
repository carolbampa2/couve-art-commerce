
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
  categories: string[];
}

const Artists = () => {
  const { t } = useLanguage();
  
  const artists: Artist[] = [
    {
      id: 1,
      name: "Clara Monteiro",
      bio: "Urban landscape artist exploring the intersection of city life and nature.",
      imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      products: 7,
      featured: true,
      categories: ["Urban", "Nature", "Mixed Media"],
    },
    {
      id: 2,
      name: "Rodrigo Almeida",
      bio: "Digital artist specializing in vibrant neon aesthetics and cyberpunk themes.",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      products: 5,
      featured: true,
      categories: ["Digital", "Cyberpunk", "Neon"],
    },
    {
      id: 3,
      name: "Julia Santos",
      bio: "Mixed media artist bringing together traditional techniques and modern digital design.",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      products: 4,
      featured: false,
      categories: ["Mixed Media", "Traditional", "Contemporary"],
    },
    {
      id: 4,
      name: "Paulo Vieira",
      bio: "Contemporary artist focused on abstract expressions of urban Brazilian culture.",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      products: 6,
      featured: false,
      categories: ["Abstract", "Urban", "Cultural"],
    },
    {
      id: 5,
      name: "Mariana Costa",
      bio: "Illustrator who combines traditional Brazilian motifs with modern digital techniques.",
      imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      products: 8,
      featured: true,
      categories: ["Illustration", "Digital", "Cultural"],
    },
    {
      id: 6,
      name: "André Martins",
      bio: "Street art inspired creator who brings urban aesthetics to wearable designs.",
      imageUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      products: 3,
      featured: false,
      categories: ["Street Art", "Urban", "Contemporary"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-2">{t("Our Artists")}</h1>
            <p className="text-muted-foreground max-w-[700px] mb-6">
              {t("artists_description")}
            </p>

            <div className="relative w-full max-w-md mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder={t("Search artists by name or style...")}
                className="pl-10" 
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <Badge variant="outline" className="cursor-pointer hover:bg-secondary">{t("All")}</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-secondary">{t("Digital")}</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-secondary">{t("Traditional")}</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-secondary">{t("Mixed Media")}</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-secondary">{t("Cultural")}</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-secondary">{t("Urban")}</Badge>
            </div>
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
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <h3 className="font-semibold text-xl">{artist.name}</h3>
                        {artist.featured && (
                          <Badge variant="secondary" className="bg-paisagem-teal text-white">
                            {t("Featured")}
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">{artist.bio}</p>
                      
                      <div className="flex flex-wrap justify-center gap-1">
                        {artist.categories.map((category, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {t(category)}
                          </Badge>
                        ))}
                      </div>
                      
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

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">{t("Want to join our artist community?")}</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t("artist_join_description")}
            </p>
            <a 
              href="mailto:artists@paisagem.art" 
              className="text-paisagem-purple hover:text-paisagem-darkPurple font-medium underline underline-offset-4"
            >
              {t("Contact us to become a Paisagem artist")}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Artists;
