import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
  return (
    <main className="bg-white">
      <Navbar />
      {children}
    </main>
  );
}
