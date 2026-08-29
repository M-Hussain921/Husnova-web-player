import { SongCard } from "./SongCard";

export const SongSection = ({ titleStart, titleHighlight, songs }) => {
  return (
    <section className="mb-6 sm:mb-10">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-text-primary">
        {titleStart}{" "}
        <span className="text-brand-primary">{titleHighlight}</span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6 pb-2">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </section>
  );
};
