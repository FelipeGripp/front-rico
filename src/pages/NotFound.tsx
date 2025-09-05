import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, TrendingUp } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="mb-8">
          <TrendingUp className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
          <p className="text-xl text-muted-foreground mb-4">
            Página não encontrada
          </p>
          <p className="text-muted-foreground mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <a href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Voltar ao Chat
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
