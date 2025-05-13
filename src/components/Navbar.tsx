
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Wallet } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import LanguageThemeSelector from "@/components/LanguageThemeSelector";
import { useLanguage } from "@/context/LanguageContext";

const Navbar = () => {
  const [connected, setConnected] = useState(false);
  const { t } = useLanguage();

  const handleConnect = () => {
    // This would be replaced with actual wallet connection logic
    setConnected(!connected);
    
    if (!connected) {
      console.log("Connecting wallet...");
    } else {
      console.log("Disconnecting wallet...");
    }
  };

  const navItems = [
    { name: t("Home"), path: "/" },
    { name: t("Artists"), path: "/artists" },
    { name: t("Shop"), path: "/shop" },
    { name: t("About COUVE"), path: "/token" },
  ];

  return (
    <header className="border-b border-border">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl md:text-3xl font-bold gradient-text tracking-tight">Paisagem</h1>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {/* Language and Theme Selector */}
          <LanguageThemeSelector />

          <Button 
            onClick={handleConnect} 
            variant={connected ? "outline" : "default"}
            className={`hidden md:flex items-center ${connected ? 'border-green-500 text-green-500' : 'gradient-bg'}`}
          >
            <Wallet className="mr-2 h-4 w-4" />
            {connected ? t('Connected') : t('Connect Wallet')}
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-6 mt-8">
                <Link to="/" className="flex items-center mb-6">
                  <h1 className="text-2xl font-bold gradient-text">Paisagem</h1>
                </Link>
                
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}

                <Button 
                  onClick={handleConnect} 
                  variant={connected ? "outline" : "default"}
                  className={`mt-4 ${connected ? 'border-green-500 text-green-500' : 'gradient-bg'}`}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  {connected ? t('Connected') : t('Connect Wallet')}
                </Button>
                
                {/* Language and Theme selector in mobile menu */}
                <div className="mt-4 flex items-center justify-center">
                  <LanguageThemeSelector />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
