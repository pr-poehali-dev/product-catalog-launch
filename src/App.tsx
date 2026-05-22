import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import About from "@/pages/About";
import Contacts from "@/pages/Contacts";
import Support from "@/pages/Support";
import Cabinet from "@/pages/Cabinet";

const queryClient = new QueryClient();

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home": return <Home onNavigate={setCurrentPage} />;
      case "catalog": return <Catalog />;
      case "about": return <About />;
      case "contacts": return <Contacts />;
      case "support": return <Support />;
      case "cabinet": return <Cabinet />;
      default: return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
          {renderPage()}
        </Layout>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
