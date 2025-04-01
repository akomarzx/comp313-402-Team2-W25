import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({ children }) {
  // Renders the navigation bar
  return (
    <>
      <Navbar />

      {/* Main content area */}
      <main className="mx-auto hero-gradient min-h-screen bg-gray-50">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {children}
        </TooltipProvider>
      </main>

      {/* Footer section */}
      <footer className="mx-auto max-w-[1200px] text-center p-4">
        <p>
          &copy; {new Date().getFullYear()} Kitchen Companion - Group 2 -
          COMP313 - SEC402
        </p>
      </footer>
    </>
  );
}
