import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MusicContext } from "../context/MusicContext";
import { FiMusic, FiPlus } from "react-icons/fi";
import placeholder from "../assets/images/album-placeholder.png";

export const YourPlaylistsPage = () => {
  const { playlists } = useContext(MusicContext);
  const navigate = useNavigate();

  return (
    <div className="px-4 pt-4 pb-6 sm:px-6 sm:pt-6 sm:pb-10">
      <div className="flex items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary">
            My Playlists
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-text-secondary">
            {playlists.length}{" "}
            {playlists.length === 1 ? "playlist" : "playlists"}
          </p>
        </div>

        <button
          onClick={() => navigate("/create-playlist")}
          className="flex  justify-center items-center  gap-2 px-4 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base bg-brand-primary text-white rounded-full font-semibold hover:scale-105 transition"
        >
          <FiPlus className="text-sm sm:text-lg" />
          New Playlist
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="min-h-75 sm:min-h-100 flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-light/20 flex items-center justify-center mb-4">
            <FiMusic className="text-3xl sm:text-4xl text-brand-primary" />
          </div>

          <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
            No playlists yet
          </h2>

          <p className="mt-2 text-sm sm:text-base text-text-secondary max-w-xs">
            Create your first playlist and start adding your favorite songs.
          </p>

          <button
            onClick={() => navigate("/add-playlist")}
            className="mt-5 flex items-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded-full text-sm sm:text-base font-semibold hover:scale-105 active:scale-95 transition-all"
          >
            <FiPlus />
            Create Playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-5 sm:gap-x-5 sm:gap-y-7">
          {playlists.map((pl) => (
            <button
              key={pl._id}
              onClick={() => navigate(`/playlist/${pl._id}`)}
              className="text-left min-w-0 group"
            >
              <div className="relative w-full aspect-square rounded-xl bg-zinc-800 overflow-hidden">
                <img
                  src={placeholder}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="absolute bottom-1 right-6 flex gap-2 sm:gap-9 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10 transition-opacity pointer-events-none sm:pointer-events-auto"></div>
              </div>

              <div className="mt-2 sm:mt-3 min-w-0">
                <p className="text-sm sm:text-base font-semibold text-text-primary truncate">
                  {pl.name}
                </p>

                <p className="mt-0.5 text-xs sm:text-sm text-text-secondary">
                  {pl.songs?.length || 0}{" "}
                  {(pl.songs?.length || 0) === 1 ? "song" : "songs"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {playlists.length > 0 && (
        <div className="mt-10 sm:mt-14">
          <h2 className="m-auto text-center text-text-secondary text-sm sm:text-xl font-semibold px-2">
            ----- Loop it. Live it. -----
          </h2>
        </div>
      )}
    </div>
  );
};
