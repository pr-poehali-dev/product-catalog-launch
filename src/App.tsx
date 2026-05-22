import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "@/context/AppContext";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import About from "@/pages/About";
import Contacts from "@/pages/Contacts";
import Support from "@/pages/Support";
import Cabinet from "@/pages/Cabinet";
import Auth from "@/pages/Auth";
import SellerCabinet from "@/pages/SellerCabinet";

const queryClient = new QueryClient();

function AppInner() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home": return <Home onNavigate={setCurrentPage} />;
      case "catalog": return <Catalog />;
      case "about": return <About />;
      case "contacts": return <Contacts />;
      case "support": return <Support />;
      case "cabinet": return <Cabinet />;
      case "seller-cabinet": return <SellerCabinet onNavigate={setCurrentPage} />;
      case "auth": return <Auth onNavigate={setCurrentPage} />;
      default: return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <AppInner />
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
