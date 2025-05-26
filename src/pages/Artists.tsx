
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useArtists } from "@/hooks/useArtists";

const Artists = () => {
  const { t } = useLanguage();
  const { data: artists, isLoading, error } = useArtists();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-destructive">Erro ao carregar artistas</p>
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
            {artists?.map((artist) => (
              <Card key={artist.id} className="card-hover">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={artist.avatar_url || '/placeholder.svg'} alt={artist.name} />
                      <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <h3 className="font-semibold text-xl">{artist.name}</h3>
                        <Badge variant="secondary" className="bg-paisagem-teal text-white">
                          {t("Featured")}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">{artist.bio}</p>
                      
                      <Button 
                        asChild
                        variant="outline" 
                        className="mt-2 hover:bg-paisagem-purple hover:text-white transition-colors"
                      >
                        <Link to={`/artist-products/${artist.id}`}>
                          {t("View Products")} ({artist.products_count || 0})
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
            <Button asChild className="gradient-bg">
              <Link to="/artist-signup">
                {t("Contact us to become a Paisagem artist")}
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Artists;
