import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="sm:w-[80%] mx-auto max-w-[1200px] bg-white min-h-screen py-10">
        {children}
      </main>
    </>
  );
}
