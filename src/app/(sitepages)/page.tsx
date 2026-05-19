import Hero from "@/sitepages/components/home/Hero";
import KeyBenefits from "@/sitepages/components/home/KeyBenefits";
import WhatWeDo from "@/sitepages/components/home/WhatWeDo";
import Testimonials from "@/sitepages/components/home/Testimonials";
import Contact from "@/sitepages/components/home/Contact";
import Newsletter from "@/sitepages/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <KeyBenefits />
      <WhatWeDo />
      <Testimonials />
      <Contact />
      <Newsletter />
    </>
  );
}
