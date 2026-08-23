import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMusic } from "react-icons/fi";
import { ForwardBackButton } from "./ForwordBackButton";
import { MusicContext } from "../context/MusicContext";
import placeholder from "../assets/images/album-placeholder.png";

export const CreatePlaylistPage = () => {
  const navigate = useNavigate();
  const { createPlaylist } = useContext(MusicContext);

  const [playlistName, setPlaylistName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = playlistName.trim();

    if (!name || loading) return;

    try {
      setLoading(true);

      const playlist = await createPlaylist(name);
      console.log(playlist);
      console.log(playlist?._id);

      if (playlist?._id) {
        navigate(`/playlist/${playlist._id}`);
      }
    } catch (error) {
      console.error("Create playlist error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 pt-4 pb-10 sm:px-6 sm:pt-6">
      <ForwardBackButton />

      <div className="w-full max-w-xl mx-auto">
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={placeholder}
              alt="Playlist cover"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Create a Playlist
          </h1>

          <p className="mt-2 text-sm sm:text-base text-text-secondary">
            Give a name your space and start building your vibe.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 sm:mt-10">
          <label
            htmlFor="playlist-name"
            className="block text-sm font-medium text-text-primary mb-2"
          >
            Playlist name
          </label>

          <input
            id="playlist-name"
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="awesome playlist"
            maxLength={60}
            autoFocus
            className="
              w-full
              rounded-xl
              border border-brand-light/40
              bg-surface
              px-4 py-3
              text-sm sm:text-base
              text-text-primary
              placeholder:text-text-secondary
              outline-none
              focus:border-brand-primary
              focus:ring-2 focus:ring-brand-primary/20
              transition
            "
          />

          <div className="flex justify-between mt-2">
            <p className="text-xs text-text-secondary">
              Choose a name you’ll recognize later.
            </p>

            <span className="text-xs text-text-secondary">
              {playlistName.length}/60
            </span>
          </div>

          <div className="flex flex-row justify-between items-center gap-3 mt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="
                px-10 py-3
                rounded-full
                border border-brand-light/40
                text-text-primary
                font-semibold
                hover:bg-brand-light/10
                transition
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!playlistName.trim() || loading}
              className="
                px-10 py-3
                rounded-full
                bg-brand-primary
                text-white
                font-semibold
                hover:bg-brand-dark
                hover:scale-[1.02]
                active:scale-[0.98]
                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:hover:scale-100
                transition-all
              "
            >
              {loading ? "Creating..." : "Done"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
