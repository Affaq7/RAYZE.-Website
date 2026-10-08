import { Hero } from "@/components/sections/hero";
import { AboutFeature } from "@/components/sections/about-feature";
import { ServicesStack } from "@/components/sections/services-stack";
import { SelectedWork } from "@/components/sections/selected-work";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutFeature />
      <ServicesStack />
      <SelectedWork />
    </>
  );
}

