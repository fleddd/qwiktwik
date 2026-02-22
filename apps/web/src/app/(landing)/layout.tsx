import GridBackground from "@/components/GridBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import { AuthService } from "@/services/auth.service";

export default async function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const response = await AuthService.getProfile();
  const user = response.success ? response.data : null;

  return (
    <SmoothScroll>
      <GridBackground />
      {/* Передаємо юзера в клієнтський Navbar */}
      <Navbar user={user} />
      <main>
        {children}
      </main>
      <Footer />
    </SmoothScroll>
  );
}