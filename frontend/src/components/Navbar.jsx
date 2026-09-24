import React, { useState, useEffect, useRef, useContext } from "react";
import { FiSearch, FiUser, FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MusicContext } from "../context/MusicContext";
import { useClickOutside } from "../hooks/useClickOutside.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { AuthForm } from "../components/AuthForm.jsx";
import { AuthContext } from "../context/AuthContext";
import { LogoutButton } from "../components/LogOutButton.jsx";

export const Navbar = ({ onMenuClick }) => {
  const [input, setInput] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authformOpen, setAuthformOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const {
    searchResults,
    searchMusic,
    playSong,
    fetchArtistDetails,
    fetchAlbumDetails,
    playAlbum,
    playArtistSongs,
  } = useContext(MusicContext);
  const [loadingKey, setLoadingKey] = useState(null);

  const { user, token, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const debouncedInput = useDebounce(input, 400);

  useEffect(() => {
    if (!debouncedInput.trim()) {
      setDropdownOpen(false);
      return;
    }
    searchMusic(debouncedInput);
    setDropdownOpen(true);
  }, [debouncedInput]);

  useClickOutside(containerRef, () => {
    setDropdownOpen(false);
    setInput("");
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeDropdown = () => {
    setDropdownOpen(false);
    setInput("");
  };

  const handleSongClick = (song) => {
    playSong(song, searchResults.songs);
    closeDropdown();
    if (song.albumId) {
      navigate(`/album/${song.albumId}`);
    } else if (song.artistId) {
      navigate(`/artist/${song.artistId}`);
    }
  };

  const handleArtistClick = async (artist) => {
    setLoadingKey(`artist-${artist.id}`);
    const details = await fetchArtistDetails(artist.id);
    setLoadingKey(null);

    if (details?.topSongs?.length) {
      playArtistSongs(details.topSongs, artist.id);
    }
    closeDropdown();
    navigate(`/artist/${artist.id}`);
  };

  const handlePlaylistClick = async (playlist) => {
    setLoadingKey(`playlist-${playlist.id}`);
    const details = await fetchAlbumDetails(playlist.id);
    setLoadingKey(null);

    if (details?.songs?.length) {
      playAlbum(details.songs, 0, playlist.id);
    }
    closeDropdown();
    navigate(`/album/${playlist.id}`);
  };

  const hasAnyResults =
    searchResults.songs.length > 0 ||
    searchResults.artists.length > 0 ||
    searchResults.playlists.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    searchMusic(input);
    setDropdownOpen(true);
  };

  return (
    <header
      className={`
        sticky
        top-0
        left-0
        z-[50]
        w-full
        px-2.5
        sm:px-4
        lg:px-6
        py-1.5
        sm:py-2
        text-xs
        sm:text-sm
        border-b
        border-brand-light/20
        transition-all
    ${
      scrolled
        ? "bg-surface/95 backdrop-blur-xl"
        : "bg-surface/80 backdrop-blur-xl"
    }
  `}
>
      <div className="flex items-center justify-between w-full gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden text-text-primary text-2xl shrink-0"
          aria-label="Open menu"
        >
          <FiMenu className="text-xl" />
        </button>
        <form
          onSubmit={handleSubmit}
          ref={containerRef}
          className="
          relative
          flex-1
          min-w-0
          w-full
          min-[648px]:max-w-80
          group"
        >
          <input
            type="text"
            placeholder="Search artists, songs, albums..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => input.trim() && setDropdownOpen(true)}
            className="
            w-full
            h-9
            min-[648px]:h-10
            bg-brand-dark/10
            text-xs
            min-[648px]:text-sm
            text-text-primary
            pl-9
            min-[648px]:pl-10
            pr-3
            rounded-xl
            min-[648px]:rounded-2xl
            outline-none
            transition-all
            placeholder:text-text-secondary
            truncate"
          />
          <button
            type="submit"
            className="
            absolute
            left-3
            min-[648px]:left-3.5
            top-1/2
            -translate-y-1/2
            text-text-secondary
            group-focus-within:text-brand-primary
            transition-colors"
            aria-label="Search"
          >
            <FiSearch className="text-base min-[648px]:text-lg" />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full mt-2 w-full bg-surface rounded-xl max-h-96 overflow-y-auto z-[1200]">
              {!hasAnyResults && (
                <p className="px-4 py-3 text-sm text-text-secondary">
                  No results found.
                </p>
              )}
              {searchResults.songs.length > 0 &&
                searchResults.songs.map((song) => (
                  <div
                    key={song.id}
                    onClick={() => handleSongClick(song)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-brand-light/20 cursor-pointer"
                  >
                    <img
                      src={song.coverArt}
                      className="w-9 h-9 rounded object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-text-primary truncate">
                        {song.title}
                      </p>
                      <p className="text-xs text-text-secondary truncate">
                        {song.artist}
                      </p>
                    </div>
                  </div>
                ))}
              {searchResults.artists.length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-xs font-semibold text-text-secondary uppercase">
                    Artists
                  </p>
                  {searchResults.artists.map((artist) => (
                    <div
                      key={artist.id}
                      onClick={() => handleArtistClick(artist)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-brand-light/20 cursor-pointer"
                    >
                      <img
                        src={artist.image}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <p className="text-sm text-text-primary truncate">
                        {artist.name}
                      </p>
                      {loadingKey === `artist-${artist.id}` && (
                        <span className="text-xs text-text-secondary ml-auto">
                          Loading...
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {searchResults.playlists.length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-xs font-semibold text-text-secondary uppercase">
                    Playlists
                  </p>
                  {searchResults.playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      onClick={() => handlePlaylistClick(playlist)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-brand-light/20 cursor-pointer"
                    >
                      <img
                        src={playlist.image}
                        className="w-9 h-9 rounded object-cover"
                      />
                      <p className="text-sm text-text-primary truncate">
                        {playlist.title}
                      </p>
                      {loadingKey === `playlist-${playlist.id}` && (
                        <span className="text-xs text-text-secondary ml-auto">
                          Loading...
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </form>
        {token ? (
          <div className="flex items-center space-x-4 shrink-0">
            <LogoutButton onClick={() => logOut()} className="mr-2 text-base" />
          </div>
        ) : (
          <div
            className="
            flex
            items-center
            shrink-0"
          >
            <button
              onClick={() => setAuthformOpen(true)}
              className="
              flex
              items-center
              justify-center
              shrink-0
              px-2
              min-[648px]:px-3
              py-1.5
              min-[648px]:py-2
              rounded-xl
              text-xs
              min-[648px]:text-sm
              font-semibold
              text-text-secondary
              hover:bg-brand-light/10
              hover:text-white
              transition-all"
            >
              <FiUser
                className="
                mr-1.5
                min-[648px]:mr-2
                text-sm
                min-[648px]:text-base"
              />

              <span>Join</span>
            </button>
          </div>
        )}
        {authformOpen && <AuthForm onClose={() => setAuthformOpen(false)} />}
      </div>
    </header>
  );
};
