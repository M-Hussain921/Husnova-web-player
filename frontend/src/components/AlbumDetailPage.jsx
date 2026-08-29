import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MusicContext } from "../context/MusicContext.jsx";
import { FiArrowLeft, FiPlay, FiPause } from "react-icons/fi";
import { formatTime } from "../utils/SongDuration.js";
import { FavoriteButton } from "./FavoriteButton.jsx";
import { SongsList } from "./SongsList.jsx";
import { ForwardBackButton } from "./ForwordBackButton.jsx";
import { PageLoading } from "./PageLoading.jsx";

export const AlbumDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    fetchAlbumDetails,
    playAlbum,
    currentSong,
    isPlaying,
    togglePlayPause,
  } = useContext(MusicContext);

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadAlbum = async () => {
      setLoading(true);
      const data = await fetchAlbumDetails(id);
      if (isMounted) {
        setAlbum(data);
        setLoading(false);
      }
    };

    loadAlbum();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <PageLoading />;
  }

  if (!album) {
    return <div className="p-4 sm:p-6 text-text-primary">Album not found</div>;
  }

  const handlePlayAll = () => {
    playAlbum(album.songs, 0);
  };

  const handleSongClick = (index) => {
    const isThisSongPlaying =
      currentSong?.id === album.songs[index].id && isPlaying;

    if (isThisSongPlaying) {
      togglePlayPause();
    } else {
      playAlbum(album.songs, index);
    }
  };

  const totalDuration = album.songs.reduce(
    (acc, song) => acc + song.duration,
    0,
  );

  return (
    <div className="p-4 sm:p-6">
      <ForwardBackButton />

      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 mb-6 sm:mb-8 text-center sm:text-left">
        <img
          src={album.image}
          alt={album.title}
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl object-cover shadow-lg"
        />
        <div>
          <p className="text-xs uppercase text-text-secondary tracking-wide">
            Album
          </p>
          <h1 className="text-xl sm:text-3xl font-bold text-text-primary">
            {album.title}
          </h1>
          <p className="text-text-secondary mt-1">
            {album.songs.length} songs {formatTime(totalDuration)}
          </p>

          <button
            onClick={handlePlayAll}
            className="mt-4 flex items-center justify-center sm:justify-start gap-2 bg-brand-primary text-white px-4 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base rounded-full hover:scale-105 transition-all mx-auto sm:mx-0"
          >
            <FiPlay /> Play All
          </button>
        </div>
      </div>

      <SongsList
        songs={album.songs}
        currentSong={currentSong}
        isPlaying={isPlaying}
        onSongClick={(song, index) => handleSongClick(index)}
        pageSize={20}
        showLoadMore={true}
      />
    </div>
  );
};
