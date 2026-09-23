import { useContext, useEffect, useRef, useState } from "react";
import {
  FiPlay,
  FiPause,
  FiHeart,
  FiSkipBack,
  FiSkipForward,
  FiShuffle,
  FiRepeat,
} from "react-icons/fi";
import { MusicContext } from "../context/MusicContext";
import { formatTime } from "../utils/SongDuration.js";
import { FavoriteButton } from "../components/FavoriteButton.jsx";
import { AddToPlaylistButton } from "../components/AddToPlaylistButton.jsx";

export const Player = ({ song }) => {
  const {
    currentSong,
    isPlaying,
    setIsPlaying,
    likedSongs,
    toggleFavorite,
    playlists,
    addSongToPlaylist,
    playNext,
    playPrevious,
    handleEnded,
    shuffleQueue,
    isShuffled,
    currentIndex,
  } = useContext(MusicContext);

  const audioRef = useRef(null);
  const restartedRef = useRef(false);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    restartedRef.current = false;
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentSong?.audioUrl) return;

    if (isPlaying) {
      const playAudio = async () => {
        try {
          await audio.play();
        } catch (error) {
          if (error.name !== "AbortError") {
            console.error("Audio play failed:", error);
          }
        }
      };

      playAudio();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentSong?.audioUrl) return;

    audio.pause();

    audio.src = currentSong.audioUrl;

    setProgress(0);
    setDuration(0);

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    if (isPlaying) {
      audio.play().catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Audio play failed:", error);
        }
      });
    }

    return () => {
      audio.pause();

      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);

      audio.removeEventListener("timeupdate", handleTimeUpdate);

      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong]);

  const titleRef = useRef(null);
const titleContainerRef = useRef(null);
const [isTitleOverflowing, setIsTitleOverflowing] = useState(false);

useEffect(() => {
  const title = titleRef.current;
  const container = titleContainerRef.current;

  if (!title || !container) return;

  const checkOverflow = () => {
    setIsTitleOverflowing(title.scrollWidth > container.clientWidth);
  };

  checkOverflow();

  const observer = new ResizeObserver(checkOverflow);
  observer.observe(container);

  return () => observer.disconnect();
}, [currentSong]);

  const handlePreviousClick = () => {
    const audio = audioRef.current;
    if (!restartedRef.current) {
      if (audio) {
        audio.currentTime = 0;
        setProgress(0);
      }
      restartedRef.current = true;
    } else {
      playPrevious();
    }
  };

  const handleSeek = (e) => {
    const newTime = Number(e.target.value);
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const handleAddClick = () => {
    setMenuOpen((prev) => !prev);
  };

  const handlePlaylistSelect = (playlistId) => {
    addSongToPlaylist(playlistId, currentSong);
    setMenuOpen(false);
  };

  if (!currentSong) return null;
  const isFav = likedSongs.some((f) => f.id === currentSong.id);

  return (
    <>
      <audio ref={audioRef} />
      <div
        className="relative
         w-full
    m-auto
    min-h-[88px]
    min-[648px]:h-[5.625rem]
    py-2
    min-[648px]:py-0
    px-2
    min-[648px]:px-5
    bg-surface
    border-t
    rounded-t-3xl
    border-brand-light/40
    flex
    flex-col
    min-[648px]:flex-row
    items-center
    justify-center
    min-[648px]:justify-between
    gap-2
    min-[648px]:gap-3
    z-[950]"
      >
        <div
          className="
    absolute
    left-0
    bottom-full
    mb-2
    flex
    items-center
    gap-2
    bg-surface/30
    backdrop-blur
    rounded-r-xl
    px-2
    py-1.5
    shadow-lg
    min-w-0
    min-[648px]:static
    min-[648px]:mb-0
    min-[648px]:gap-4
    min-[648px]:w-auto
    min-[648px]:min-w-45

    min-[648px]:border-0
    min-[648px]:bg-transparent
    min-[648px]:rounded-none
    min-[648px]:px-0
    min-[648px]:py-0
    min-[648px]:shadow-none

    flex-shrink-0
  "
        >
          <img
            src={currentSong.coverArt}
            alt={currentSong.title}
            className={`
    w-10 h-10
    min-[648px]:w-14 min-[648px]:h-14
    rounded-full
    object-cover
    shadow-sm
    shrink-0
    song-cover
    ${isPlaying ? "song-cover-playing" : ""}
  `}
          />
          <div className="flex flex-col justify-center ">
          <div className="max-w-[160px] min-[648px]:max-w-37.5 overflow-hidden">
  <p
    className={`
      song-title-track
      text-xs
      min-[648px]:text-sm
      text-text-primary
      font-bold

      ${
        isPlaying
          ? "song-title-animated"
          : "song-title-paused"
      }
    `}
  >
    {currentSong.title}
  </p>
</div>
            <p
              className="
    text-xs
    text-text-secondary
    truncate
    max-w-[160px]
    min-[648px]:max-w-37.5
    cursor-pointer
    hover:underline"
            >
              {currentSong.artist}
            </p>
          </div>
        </div>

        <div
          className="
    flex
    flex-col
    items-center
    justify-center
    w-full
    min-[648px]:w-[40%]
    max-w-150
    gap-2"
        >
          <div
            className="
    flex
    items-center
    justify-center
    gap-4
    min-[648px]:gap-6
    w-full"
          >
            <FavoriteButton item={currentSong} type="song" />
            <FiShuffle
              onClick={shuffleQueue}
              className={`cursor-pointer text-lg transition 
    ${
      isShuffled
        ? "text-brand-primary"
        : "text-text-secondary hover:text-brand-primary"
    }`}
            />
            <FiSkipBack
              onClick={handlePreviousClick}
              className="text-text-secondary hover:text-text-primary cursor-pointer text-xl transition hover:scale-105"
            />

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="
  w-8
  h-8
  min-[648px]:w-10
  min-[648px]:h-10
  flex
  items-center
  justify-center
  bg-brand-primary
  text-white
  rounded-full
  hover:scale-105
  hover:bg-brand-dark
  transition-all
"
            >
              {isPlaying ? (
                <FiPause className="text-xl" />
              ) : (
                <FiPlay className="text-xl ml-1" />
              )}
            </button>

            <FiSkipForward
              onClick={playNext}
              className="text-text-secondary hover:text-text-primary cursor-pointer text-xl transition hover:scale-105"
            />
            <FiRepeat className="text-text-secondary hover:text-brand-primary cursor-pointer text-lg transition" />
            <div className="relative">
            <AddToPlaylistButton onClick={handleAddClick} />

            {menuOpen && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-surface border border-brand-light/40 rounded-lg shadow-xl w-36 sm:w-44 py-1 max-w-[90vw] z-10">
                {playlists.map((pl) => (
                  <button
                    key={pl._id}
                    onClick={() => handlePlaylistSelect(pl._id)}
                    className="block w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-brand-light/20 hover:text-text-primary"
                  >
                    {pl.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          </div>

          <div className="flex items-center gap-2 w-full ">
            <span
              className="
    text-[10px]
    min-[648px]:text-xs
    text-text-secondary
    w-6
    min-[648px]:w-10
    shrink-0
    text-right
    font-medium
  "
            >
              {formatTime(progress)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={progress}
              onChange={handleSeek}
              className="flex-1 h-1.5 bg-brand-light/30 rounded-full appearance-none cursor-pointer accent-brand-primary hover:accent-brand-dark transition"
            />
            <span
              className="
    text-[10px]
    min-[648px]:text-xs
    text-text-secondary
    w-10
    text-left
    font-medium
  "
            >
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div
          className="
    flex
    justify-center
    items-center

    gap-3
    min-[648px]:gap-5

    pr-1
    min-[648px]:pr-5

    shrink-0

    absolute
    top-3
    right-2

    min-[648px]:static
  "
        >
          
          
        </div>
      </div>
    </>
  );
};
