import Hero from "@/sitepages/components/home/Hero";
import KeyBenefits from "@/sitepages/components/home/KeyBenefits";
import WhatWeDo from "@/sitepages/components/home/WhatWeDo";
import Testimonials from "@/sitepages/components/home/Testimonials";
import Contact from "@/sitepages/components/home/Contact";
import Newsletter from "@/sitepages/components/home/Newsletter";
import LetsConnect from "@/sitepages/components/home/LetsConnect";
import OurTeam from "@/sitepages/components/home/OurTeam";
import Tech from "@/sitepages/components/home/Tech";

export default function Home() {
  return (
    <>
      <Hero />
      <Tech />
      <KeyBenefits />
      <WhatWeDo />
      <LetsConnect />
      <OurTeam />
      <Testimonials />
      <Contact />
      <Newsletter />
    </>
  );
}


