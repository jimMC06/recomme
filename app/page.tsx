import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 pb-44 pt-8 text-white">
      <section className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">RecomMe</h1>
        <p className="mt-3 text-base text-gray-400 sm:text-lg">
          Find music that matches your vibe
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/discover"
            className="flex flex-1 items-center justify-center rounded-2xl border border-green-900 bg-green-500 px-6 py-4 text-center text-base font-semibold text-black transition hover:bg-green-400"
          >
            Go to Discovery
          </Link>
          <Link
            href="/playlist"
            className="flex flex-1 items-center justify-center rounded-2xl border border-gray-700 bg-gray-950 px-6 py-4 text-center text-base font-semibold text-white transition hover:border-gray-500"
          >
            Playlist Maker
          </Link>
        </div>
      </section>
    </main>
  );
}
