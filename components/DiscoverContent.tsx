"use client";

import { DiscoverFilters } from "@/components/DiscoverFilters";
import type { Song } from "@/types/song";

type DiscoverContentProps = {
  songs: Song[];
};

export function DiscoverContent({ songs }: DiscoverContentProps) {
  return (
    // The filter component still owns the recommendation list and its local filter UI state.
    <DiscoverFilters songs={songs} />
  );
}
