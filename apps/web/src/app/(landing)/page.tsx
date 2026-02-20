import Hero from '@/components/Hero';
import Metrics from '@/components/Metrics';
import Modes from '@/components/Modes';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Navbar from '../../components/Navbar';

export default function Home() {
  return (
    <>
      <Hero />
      <Metrics />
      <Modes />
      <Features />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}