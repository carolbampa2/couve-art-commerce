
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Wallet, User, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LanguageThemeSelector from "@/components/LanguageThemeSelector";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import WalletConnectModal from "@/components/WalletConnectModal";

const Navbar = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleWalletConnect = () => {
    if (!walletConnected) {
      setIsWalletModalOpen(true);
    } else {
      setWalletConnected(false);
      setWalletAddress(null);
      console.log("Disconnecting wallet...");
    }
  };

  const handleWalletConnected = (address: string) => {
    setWalletConnected(true);
    setWalletAddress(address);
    console.log("Connected wallet:", address);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
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
          <LanguageThemeSelector />

          {/* Wallet Connect Button */}
          <Button 
            onClick={handleWalletConnect} 
            variant={walletConnected ? "outline" : "default"}
            className={`hidden md:flex items-center ${walletConnected ? 'border-green-500 text-green-500' : 'gradient-bg'}`}
          >
            <Wallet className="mr-2 h-4 w-4" />
            {walletConnected ? 
              (walletAddress ? `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}` : t('Connected')) : 
              t('Connect Wallet')}
          </Button>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                    <AvatarFallback>
                      {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.user_metadata?.full_name || 'Usuário'}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    {t("Perfil")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/artist-signup" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    {t("Tornar-se Artista")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("Sair")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="hidden md:flex gradient-bg">
              <Link to="/auth">{t("Entrar")}</Link>
            </Button>
          )}

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
                  onClick={handleWalletConnect} 
                  variant={walletConnected ? "outline" : "default"}
                  className={`mt-4 ${walletConnected ? 'border-green-500 text-green-500' : 'gradient-bg'}`}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  {walletConnected ? 
                    (walletAddress ? `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}` : t('Connected')) : 
                    t('Connect Wallet')}
                </Button>

                {user ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback>
                          {user.user_metadata?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.user_metadata?.full_name || 'Usuário'}</span>
                    </div>
                    <Button variant="outline" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("Sair")}
                    </Button>
                  </div>
                ) : (
                  <Button asChild className="gradient-bg">
                    <Link to="/auth">{t("Entrar")}</Link>
                  </Button>
                )}
                
                <div className="mt-4 flex items-center justify-center">
                  <LanguageThemeSelector />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <WalletConnectModal 
        open={isWalletModalOpen} 
        onOpenChange={setIsWalletModalOpen}
        onConnect={handleWalletConnected}
      />
    </header>
  );
};

export default Navbar;
