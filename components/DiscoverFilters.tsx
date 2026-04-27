"use client";

import { useMemo, useState } from "react";

import { SongCard } from "@/components/SongCard";
import type { Song } from "@/types/song";

type DiscoverFiltersProps = {
  songs: Song[];
};

type MatchFilter = "all" | "95+" | "90+" | "under-90";

type ActiveFilters = {
  genre: string;
  vibe: string;
  task: string;
  popularity: string;
  match: MatchFilter;
};

type AdvancedFilters = {
  stickToGenre: number;
  stickToVibe: number;
  stickToTask: number;
};

// These labels control the match filter options and map directly to filter logic below.
const matchFilterOptions: { label: string; value: MatchFilter }[] = [
  { label: "All match scores", value: "all" },
  { label: "95%+", value: "95+" },
  { label: "90%+", value: "90+" },
  { label: "Under 90%", value: "under-90" },
];

const defaultFilters: ActiveFilters = {
  genre: "All",
  vibe: "All",
  task: "All",
  popularity: "All",
  match: "all",
};

const defaultAdvancedFilters: AdvancedFilters = {
  stickToGenre: 1,
  stickToVibe: 1,
  stickToTask: 1,
};

type FilterSelectProps = {
  label: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
};

function FilterSelect({
  label,
  options,
  selectedValue,
  onSelect,
}: FilterSelectProps) {
  return (
    <div>
      {/* Each standard filter uses the same labeled select pattern for consistency. */}
      <label className="mb-2 block text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="relative">
        <select
          value={selectedValue}
          onChange={(event) => onSelect(event.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 pr-10 text-sm text-gray-200 outline-none transition focus:border-green-500"
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
              className="bg-gray-900 text-gray-200"
            >
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
          v
        </span>
      </div>
    </div>
  );
}

type MatchFilterSelectProps = {
  selectedValue: MatchFilter;
  onSelect: (value: MatchFilter) => void;
};

function MatchFilterSelect({
  selectedValue,
  onSelect,
}: MatchFilterSelectProps) {
  return (
    <div>
      {/* The match dropdown uses typed option values because its logic is numeric. */}
      <label className="mb-2 block text-sm font-medium text-gray-300">
        Match %
      </label>
      <div className="relative">
        <select
          value={selectedValue}
          onChange={(event) => onSelect(event.target.value as MatchFilter)}
          className="w-full appearance-none rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 pr-10 text-sm text-gray-200 outline-none transition focus:border-green-500"
        >
          {matchFilterOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-gray-900 text-gray-200"
            >
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
          v
        </span>
      </div>
    </div>
  );
}

type AdvancedFilterSliderProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

function AdvancedFilterSlider({
  label,
  value,
  onChange,
}: AdvancedFilterSliderProps) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-4">
      {/* These sliders are UI-only for now and can be connected to ranking logic later. */}
      <label className="mb-3 block text-sm font-medium text-gray-200">
        {label}
      </label>
      <input
        type="range"
        min="0"
        max="2"
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-green-500"
      />
      <div className="mt-2 grid grid-cols-3 text-xs text-gray-400">
        <span className="text-left">Off</span>
        <span className="text-center">Default</span>
        <span className="text-right">Max</span>
      </div>
    </div>
  );
}

export function DiscoverFilters({ songs }: DiscoverFiltersProps) {
  // The main filter state powers the song list filtering below.
  const [filters, setFilters] = useState<ActiveFilters>(defaultFilters);
  // The advanced controls are stored separately because they do not affect results yet.
  const [advancedFilters, setAdvancedFilters] =
    useState<AdvancedFilters>(defaultAdvancedFilters);
  // This controls whether the full filter controls are expanded or collapsed.
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  // These lists are built from the song data so the filter UI stays in sync with the data.
  const genreOptions = useMemo(
    () => ["All", ...new Set(songs.map((song) => song.genre))],
    [songs]
  );
  const vibeOptions = useMemo(
    () => ["All", ...new Set(songs.map((song) => song.vibe))],
    [songs]
  );
  const taskOptions = useMemo(
    () => ["All", ...new Set(songs.map((song) => song.task))],
    [songs]
  );
  const popularityOptions = useMemo(
    () => ["All", ...new Set(songs.map((song) => song.popularity))],
    [songs]
  );

  const filterSummary = useMemo(() => {
    // The summary row stays visible when collapsed so the active filter state is still legible.
    const summaryItems = [
      filters.genre !== "All" ? `Genre: ${filters.genre}` : null,
      filters.vibe !== "All" ? `Vibe: ${filters.vibe}` : null,
      filters.task !== "All" ? `Task: ${filters.task}` : null,
      filters.popularity !== "All"
        ? `Popularity: ${filters.popularity}`
        : null,
      filters.match !== "all"
        ? `Match: ${
            matchFilterOptions.find((option) => option.value === filters.match)
              ?.label
          }`
        : null,
      advancedFilters.stickToGenre !== defaultAdvancedFilters.stickToGenre
        ? `Stick to genre: ${advancedFilters.stickToGenre}`
        : null,
      advancedFilters.stickToVibe !== defaultAdvancedFilters.stickToVibe
        ? `Stick to vibe: ${advancedFilters.stickToVibe}`
        : null,
      advancedFilters.stickToTask !== defaultAdvancedFilters.stickToTask
        ? `Stick to task: ${advancedFilters.stickToTask}`
        : null,
    ].filter(Boolean);

    return summaryItems.length > 0 ? summaryItems.join(" | ") : null;
  }, [filters, advancedFilters]);

  // The filtered list is recalculated every time the user changes a filter button.
  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      const matchesGenre =
        filters.genre === "All" || song.genre === filters.genre;
      const matchesVibe = filters.vibe === "All" || song.vibe === filters.vibe;
      const matchesTask = filters.task === "All" || song.task === filters.task;
      const matchesPopularity =
        filters.popularity === "All" || song.popularity === filters.popularity;

      const matchesScore =
        filters.match === "all" ||
        (filters.match === "95+" && song.match >= 95) ||
        (filters.match === "90+" && song.match >= 90) ||
        (filters.match === "under-90" && song.match < 90);

      return (
        matchesGenre &&
        matchesVibe &&
        matchesTask &&
        matchesPopularity &&
        matchesScore
      );
    });
  }, [filters, songs]);

  return (
    <section className="mt-8 space-y-6">
      <div className="rounded-lg border border-gray-800 bg-gray-950">
        {/* The header doubles as the collapse toggle so the whole filter block is easy to open and close. */}
        <button
          type="button"
          onClick={() => setIsFiltersOpen((currentValue) => !currentValue)}
          aria-expanded={isFiltersOpen}
          className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
        >
          <div>
            <h2 className="text-xl font-semibold text-white">Filters</h2>
            <p className="mt-1 text-sm text-gray-400">
              Change the filters to narrow down the songs you see.
            </p>
          </div>
          <span
            className={`text-sm text-gray-400 transition-transform ${
              isFiltersOpen ? "rotate-180" : ""
            }`}
          >
            v
          </span>
        </button>

        {filterSummary ? (
          // The summary line remains visible so the current state is readable even when controls are hidden.
          <div className="border-t border-gray-800 px-4 py-3 text-sm text-gray-400">
            {filterSummary}
          </div>
        ) : null}

        {isFiltersOpen ? (
          <div
            className={`space-y-4 p-4 ${filterSummary ? "border-t border-gray-800" : ""}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Recommended for You
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Fine-tune the filters below to shape your recommendations.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  // Reset both groups together so the panel always returns to a clean default state.
                  setFilters(defaultFilters);
                  setAdvancedFilters(defaultAdvancedFilters);
                }}
                className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-200"
              >
                Reset filters
              </button>
            </div>

            {/* The main filter controls are grouped into a compact responsive grid. */}
            <div className="grid gap-4 md:grid-cols-2">
              <FilterSelect
                label="Genre"
                options={genreOptions}
                selectedValue={filters.genre}
                onSelect={(value) =>
                  setFilters((currentFilters) => ({
                    ...currentFilters,
                    genre: value,
                  }))
                }
              />

              <FilterSelect
                label="Vibe"
                options={vibeOptions}
                selectedValue={filters.vibe}
                onSelect={(value) =>
                  setFilters((currentFilters) => ({
                    ...currentFilters,
                    vibe: value,
                  }))
                }
              />

              <FilterSelect
                label="Task"
                options={taskOptions}
                selectedValue={filters.task}
                onSelect={(value) =>
                  setFilters((currentFilters) => ({
                    ...currentFilters,
                    task: value,
                  }))
                }
              />

              <FilterSelect
                label="Popularity"
                options={popularityOptions}
                selectedValue={filters.popularity}
                onSelect={(value) =>
                  setFilters((currentFilters) => ({
                    ...currentFilters,
                    popularity: value,
                  }))
                }
              />

              <MatchFilterSelect
                selectedValue={filters.match}
                onSelect={(value) =>
                  setFilters((currentFilters) => ({
                    ...currentFilters,
                    match: value,
                  }))
                }
              />
            </div>

            {/* The advanced section stays collapsed by default so the main filter UI remains lightweight. */}
            <details className="rounded-lg border border-gray-800 bg-gray-900/40">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-gray-200">
                <div className="flex items-center justify-between gap-4">
                  <span>Advanced Filters</span>
                  <span className="text-xs text-gray-500">v</span>
                </div>
              </summary>

              <div className="grid gap-4 border-t border-gray-800 px-4 py-4 md:grid-cols-3">
                <AdvancedFilterSlider
                  label="Stick to genre"
                  value={advancedFilters.stickToGenre}
                  onChange={(value) =>
                    setAdvancedFilters((currentFilters) => ({
                      ...currentFilters,
                      stickToGenre: value,
                    }))
                  }
                />

                <AdvancedFilterSlider
                  label="Stick to vibe"
                  value={advancedFilters.stickToVibe}
                  onChange={(value) =>
                    setAdvancedFilters((currentFilters) => ({
                      ...currentFilters,
                      stickToVibe: value,
                    }))
                  }
                />

                <AdvancedFilterSlider
                  label="Stick to task"
                  value={advancedFilters.stickToTask}
                  onChange={(value) =>
                    setAdvancedFilters((currentFilters) => ({
                      ...currentFilters,
                      stickToTask: value,
                    }))
                  }
                />
              </div>
            </details>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-gray-400">
          Showing {filteredSongs.length} of {songs.length} songs
        </p>
      </div>

      {filteredSongs.length > 0 ? (
        // Matching songs are rendered as reusable cards so the list stays easy to extend.
        <div className="grid gap-4">
          {filteredSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      ) : (
        // This empty state explains why the list disappeared when filters get too narrow.
        <div className="rounded-lg border border-dashed border-gray-700 p-6 text-sm text-gray-400">
          No songs match these filters yet. Try changing one of the filters.
        </div>
      )}
    </section>
  );
}
