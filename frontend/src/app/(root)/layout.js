import Navbar from "@/components/Navbar";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className=" mx-auto  hero-gradient min-h-screen">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {children}
        </TooltipProvider>
      </main>
      <footer className="  mx-auto max-w-[1200px] text-center p-4">
        <p>
          &copy; {new Date().getFullYear()} Kitchen Companion - Group 2 -
          COMP313 - SEC402
        </p>
      </footer>
    </>
  );
}
