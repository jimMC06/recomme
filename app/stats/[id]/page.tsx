import Link from "next/link";

import { AddToQueueButton } from "@/components/AddToQueueButton";
import { SongActions } from "@/components/SongActions";
import { songs } from "@/data/songs";

type SongStatsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getListenCount(match: number) {
  return `${(match * 12847).toLocaleString()} listens`;
}

export default async function SongStatsPage({ params }: SongStatsPageProps) {
  const { id } = await params;
  const song = songs.find((currentSong) => currentSong.id === id);

  if (!song) {
    return (
      <main className="min-h-screen bg-black px-4 py-10 text-white sm:px-5">
        <div className="mx-auto max-w-5xl rounded-2xl border border-gray-800 bg-gray-950 p-8">
          <h1 className="text-2xl font-bold">Song not found</h1>
          <p className="mt-2 text-sm text-gray-400">
            This prototype could not find a matching song in the sample data.
          </p>
        </div>
      </main>
    );
  }

  const similarSongs = songs
    .filter((currentSong) => currentSong.id !== song.id)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white sm:px-5">
      <div className="mx-auto grid max-w-6xl gap-6 pb-36 lg:grid-cols-[1fr_20rem]">
        <section className="space-y-6">
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-green-400">
              Song stats
            </p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              {song.title}
            </h1>
            <p className="mt-2 text-lg text-gray-300">{song.artist}</p>
            <p className="mt-4 text-sm text-gray-400">
              Prototype release info: a polished single-page placeholder for
              album, release date, label, and catalog details.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
              <p className="text-sm text-gray-400">Popularity</p>
              <p className="mt-2 rounded-lg bg-green-500 px-3 py-1 text-sm font-semibold text-black">
                {song.popularity}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
              <p className="text-sm text-gray-400">Listens</p>
              <p className="mt-2 text-xl font-semibold text-white">
                {getListenCount(song.match)}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
              <p className="text-sm text-gray-400">Match score</p>
              <p className="mt-2 text-xl font-semibold text-green-300">
                {song.match}% Match
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="mt-3 text-sm leading-6 text-gray-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. This
              track blends a {song.vibe.toLowerCase()} mood with{" "}
              {song.genre.toLowerCase()} textures, making it feel natural for{" "}
              {song.task.toLowerCase()} moments while still carrying enough
              energy to stand out in a playlist.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
            <h2 className="text-lg font-semibold">Genre and tags</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-green-900 bg-green-500/10 px-3 py-1 text-sm text-green-300">
                {song.genre}
              </span>
              {song.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-700 px-3 py-1 text-sm text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
            <h2 className="text-lg font-semibold">Why recommended</h2>
            <p className="mt-3 text-sm leading-6 text-gray-300">
              RecomMe matched this song because its {song.vibe.toLowerCase()}{" "}
              vibe, {song.task.toLowerCase()} use case, and{" "}
              {song.genre.toLowerCase()} style line up with the current sample
              preference profile. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt ut labore.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
            <h2 className="text-lg font-semibold">Similar songs</h2>
            <div className="mt-4 space-y-3">
              {similarSongs.map((similarSong) => (
                <article
                  key={similarSong.id}
                  className="rounded-xl border border-gray-800 bg-black/20 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-white">
                        {similarSong.title}
                      </h3>
                      <p className="truncate text-sm text-gray-400">
                        {similarSong.artist}
                      </p>
                    </div>
                    <span className="rounded-lg bg-green-500 px-2 py-1 text-xs font-semibold text-black">
                      {similarSong.match}%
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
            <div className="flex aspect-square items-center justify-center rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-800 via-gray-950 to-green-950 text-center">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-gray-500">
                  Cover
                </p>
                <p className="mt-2 text-xl font-semibold text-white">
                  {song.title}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <Link
                href={`/song-mix/${song.id}`}
                className="flex w-full items-center justify-center rounded-xl border border-green-900 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-300 transition hover:border-green-700"
              >
                Create Song Mix
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-gray-700 px-3 py-3 text-sm font-medium text-white transition hover:border-gray-500"
                >
                  Preview
                </button>
                <AddToQueueButton
                  song={song}
                  className="rounded-xl border border-gray-700 px-3 py-3 text-sm font-medium text-white transition hover:border-gray-500"
                />
              </div>
              <div className="flex justify-center">
                <SongActions song={song} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
            <h2 className="text-sm font-semibold text-white">Stats notes</h2>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Momentum,
              replay value, and playlist fit are represented with placeholder
              copy until live analytics are added.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
