import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MusicContext } from "../context/MusicContext";
import { AlbumCard } from "../components/AlbumCard";
import { SongsList } from "../components/SongsList";
import { FavoriteButton } from "../components/FavoriteButton";
import { ForwardBackButton } from "../components/ForwordBackButton";
import { PageLoading } from "../components/PageLoading";

export const ArtistDetailPage = () => {
  const { id } = useParams();
  const {
    fetchArtistDetails,
    playArtistSongs,
    currentSong,
    isPlaying,
    togglePlayPause,
  } = useContext(MusicContext);

  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("songs");

  useEffect(() => {
    setLoading(true);
    fetchArtistDetails(id).then((data) => {
      setArtist(data);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (artist && !artist.bio && activeTab === "biography") {
      setActiveTab("songs");
    }
  }, [artist]);

  if (loading) return <PageLoading />;
  if (!artist) return <p className="p-6">Artist not found.</p>;

  const hasBio = Boolean(artist.bio);
  const tabs = [
    { key: "songs", label: "Popular Songs" },
    { key: "albums", label: "Albums" },
  ];

  return (
    <div className="p-4 sm:p-6 ">
      <div className="relative flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8 text-center sm:text-left pt-10 pb-5 sm:pt-12 sm:pb-3">
        <div className="absolute z-10 left-0 top-0">
          <ForwardBackButton />
        </div>

        <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(90deg,transparent_24%,rgba(101,171,196,.06)_25%,rgba(101,171,196,.06)_26%,transparent_27%,transparent_74%,rgba(101,171,196,.06)_75%,rgba(101,171,196,.06)_76%,transparent_77%,transparent),linear-gradient(0deg,transparent_24%,rgba(101,171,196,.06)_25%,rgba(101,171,196,.06)_26%,transparent_27%,transparent_74%,rgba(101,171,196,.06)_75%,rgba(101,171,196,.06)_76%,transparent_77%,transparent)] bg-[length:50px_50px]" />

        <img
          src={artist.image}
          className="relative z-10 w-28 h-28 sm:w-40 sm:h-40 rounded-full object-cover"
        />
        <div className="relative z-10">
          <h1 className="text-xl sm:text-3xl font-bold">{artist.name}</h1>
          <div className="mt-3 flex items-center justify-center sm:justify-start gap-3">
            <button
              onClick={() =>
                artist.topSongs.length &&
                playArtistSongs(artist.topSongs, 0, artist.id)
              }
              className="px-4 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base bg-brand-primary text-white rounded-full font-semibold hover:scale-105 transition"
            >
              Play All
            </button>
            <FavoriteButton item={artist} type="artist" />
          </div>
        </div>
      </div>

      <div className="flex gap-4 sm:gap-6 border-b border-brand-light/30 mb-4 sm:mb-6 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 sm:pb-3 px-1 font-semibold text-sm sm:text-base whitespace-nowrap transition ${
              activeTab === tab.key
                ? "text-brand-primary border-b-2 border-brand-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "songs" && (
        <SongsList
          songs={artist.topSongs}
          currentSong={currentSong}
          isPlaying={isPlaying}
          onSongClick={(song, index) => {
            if (currentSong?.id === song.id && isPlaying) {
              togglePlayPause();
            } else {
              playArtistSongs(artist.topSongs, index, artist.id);
            }
          }}
        />
      )}

      {activeTab === "albums" && (
        <AlbumCard albums={artist.topAlbums} loading={loading} />
      )}

      <div>
        <h2 className="m-auto text-center text-text-secondary text-base sm:text-xl font-semibold mt-10 px-2">
          ----- Loop it. Live it. -----
        </h2>
      </div>
    </div>
  );
};
