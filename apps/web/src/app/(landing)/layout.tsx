import GridBackground from "@/components/GridBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SmoothScroll>
      <GridBackground />
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </SmoothScroll>
  );
}