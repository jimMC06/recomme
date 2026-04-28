export type Song = {
  id: string;
  title: string;
  artist: string;
  genre: string;
  subgenre: string;
  vibe: string;
  task: string;
  popularity: "Rising" | "Known" | "Popular";
  match: number;
  tags: string[];
  description: string;
  album: string;
  releaseYear: number;
  listens: number;
};
