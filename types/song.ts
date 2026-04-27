export type Song = {
  id: string;
  title: string;
  artist: string;
  genre: string;
  vibe: string;
  task: string;
  popularity: "Rising" | "Known" | "Popular";
  match: number;
  tags: string[];
};
