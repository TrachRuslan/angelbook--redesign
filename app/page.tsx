import { Hero } from "@/components/layout/hero";
import { FeaturedMemorials } from "@/components/sections/featured-memorials";
import { Features } from "@/components/sections/features";

export default function Home() {
  return (
    <main className="flex flex-col gap-32 bg-charcoal-950">
      <Hero />
      <FeaturedMemorials />
      <Features />
    </main>
  );
}
