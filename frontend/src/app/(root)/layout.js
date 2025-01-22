import Navbar from "@/components/Navbar";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="sm:w-[80%] mx-auto max-w-[1200px] bg-white min-h-screen">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {children}
        </TooltipProvider>
      </main>
    </>
  );
}
