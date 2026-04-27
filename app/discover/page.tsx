import { DiscoverContent } from "@/components/DiscoverContent";
import { songs } from "@/data/songs";

export default function DiscoverPage() {
  return (
    // This page is intentionally simple because the main interaction lives in the filter component.
    <main className="min-h-screen bg-black px-4 py-4 text-white sm:px-5 sm:py-5">
      <h1 className="text-2xl font-bold sm:text-3xl">Discover</h1>
      <p className="mt-2 text-gray-400">
        Find music that actually matches your vibe.
      </p>

      {/* The interactive discover UI is grouped in a client component so it can share app-level state. */}
      <DiscoverContent songs={songs} />
    </main>
  );
}
