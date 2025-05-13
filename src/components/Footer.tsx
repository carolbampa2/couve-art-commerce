
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Send, Twitter, Github, Instagram } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-muted">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <h1 className="text-2xl font-bold gradient-text">Paisagem</h1>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              {t("Connecting graphic artists to a wider audience through blockchain innovation. Purchase exclusive designs and unlock special content with COUVE tokens.")}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("Navigation")}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("Home")}
                </Link>
              </li>
              <li>
                <Link to="/artists" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("Artists")}
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("Shop")}
                </Link>
              </li>
              <li>
                <Link to="/token" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("About COUVE")}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("Subscribe")}</h3>
            <p className="text-muted-foreground mb-4">
              {t("Stay updated with our newest artists, products, and token updates.")}
            </p>
            <div className="flex space-x-2">
              <Input placeholder={t("Enter your email")} className="max-w-[220px]" />
              <Button size="icon" className="gradient-bg">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2023 Paisagem. {t("All rights reserved.")}
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("Privacy Policy")}
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("Terms of Service")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
