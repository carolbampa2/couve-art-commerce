
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Globe } from "lucide-react";

const LanguageThemeSelector = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center space-x-2">
      {/* Dropdown para seleção de idioma */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            className={language === 'en' ? "bg-accent" : ""} 
            onClick={() => setLanguage('en')}
          >
            {t("English")}
          </DropdownMenuItem>
          <DropdownMenuItem 
            className={language === 'pt-BR' ? "bg-accent" : ""} 
            onClick={() => setLanguage('pt-BR')}
          >
            {t("Portuguese")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Botão para alternar entre tema claro e escuro */}
      <Button variant="outline" size="icon" onClick={toggleTheme}>
        {theme === 'light' ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default LanguageThemeSelector;
