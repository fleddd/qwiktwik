import Hero from '@/components/Hero';
import Metrics from '@/components/Metrics';
import Modes from '@/components/Modes';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <Metrics />
      <Modes />
      <Features />
      <Testimonials />
      <CTA />
      <FAQ />
    </>
  );
}