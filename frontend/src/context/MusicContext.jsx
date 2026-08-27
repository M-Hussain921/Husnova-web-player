import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import { mapRawSongToSongs } from "../utils/mapRawSong";
import { authFetch } from "../utils/apiClient";
import { AuthContext } from "./AuthContext";
import { runInBatches } from "../utils/runInBatches";

export const MusicContext = createContext();

const BASE_URL = "https://husnova-web-player.onrender.com";
const BACKEND_API = `${BASE_URL}/user`;

async function fetchSongsByQuery(query, limit = 10) {
  try {
    const res = await fetch(
      `${BASE_URL}/search/songs?query=${encodeURIComponent(query)}&limit=${limit}`,
    );

    if (!res.ok) throw new Error("Server down");

    const data = await res.json();
    const results = data?.data?.results || [];
    if (results.length === 0) return [];

    return results.map(mapRawSongToSongs);
  } catch (error) {
    console.warn(`Server failed. error:${error}`);
    return [];
  }
}

async function fetchSongById(id) {
  try {
    const res = await fetch(`${BASE_URL}/songs?id=${encodeURIComponent(id)}`);

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const results = Array.isArray(data?.data)
      ? data.data
      : data?.data?.results || [];

    if (!results.length) {
      console.warn("NO SONG FOUND:", id);
      return null;
    }

    return mapRawSongToSongs(results[0]);
  } catch (error) {
    console.error("Song fetch error:", error);
    return null;
  }
}

async function fetchArtistByQuery(query, limit = 10) {
  try {
    const res = await fetch(
      `${BASE_URL}/search/artists?query=${encodeURIComponent(query)}&limit=${limit}`,
    );

    if (!res.ok) throw new Error("Server down");

    const data = await res.json();
    const results = Array.isArray(data?.data)
      ? data.data
      : data?.data?.results || [];
    if (results.length === 0) return [];

    if (!Array.isArray(results) || results.length === 0) return [];
    return results.map((artist) => ({
      id: artist.id,
      name: artist.name,
      image: artist.image?.[2]?.url || "https://via.placeholder.com/150",
    }));
  } catch (error) {
    console.warn(`Server failed. error:${error}`);
    return [];
  }
}

async function fetchAlbumsByQuery(query, limit = 10) {
  try {
    const res = await fetch(
      `${BASE_URL}/search/albums?query=${encodeURIComponent(query)}&limit=${limit}`,
    );

    if (!res.ok) throw new Error("Server down");

    const data = await res.json();
    const results = data?.data?.results || [];

    return results.map((album) => ({
      id: album.id,
      title: album.name,
      artist: album.artists.primary[0].name || "Unknown",
      image: album.image?.[2]?.url || "https://via.placeholder.com/150",
      year: album.year,
    }));
  } catch (error) {
    console.warn("Album fetch error:", error);
    return [];
  }
}

async function fetchAlbumDetails(id) {
  try {
    const res = await fetch(`${BASE_URL}/albums?id=${id}`);
    if (!res.ok) throw new Error("Server down");

    const data = await res.json();
    const album = data?.data;
    if (!album) return null;

    const songs = (album.songs || []).map(mapRawSongToSongs);
    return {
      id: album.id,
      title: album.name || album.title || "Unknown Album",
      artist: album.primaryArtists || album.artists || "Unknown Artist",
      image:
        typeof album.image === "string"
          ? album.image
          : album.image?.[2]?.url || "https://via.placeholder.com/150",
      songs,
    };
  } catch (err) {
    console.warn("Album details fetch error:", err);
    return null;
  }
}

async function fetchArtistDetails(id) {
  try {
    const res = await fetch(`${BASE_URL}/artists?id=${id}`);
    if (!res.ok) throw new Error("Server down");

    const data = await res.json();
    const artist = data?.data;
    if (!artist) return null;

    const artistName = artist.name || artist.title || "Unknown Artist";
    const artistImage =
      typeof artist.image === "string"
        ? artist.image
        : artist.image?.[2]?.url || "https://via.placeholder.com/150";

    const bioText = Array.isArray(artist.bio)
      ? artist.bio
          .filter((b) => b?.text)
          .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
          .map((b) => b.text)
          .join("\n\n")
      : artist.bio || null;

    const topSongs = Array.isArray(artist.topSongs)
      ? artist.topSongs.map((s) => (s.coverArt ? s : mapRawSongToSongs(s)))
      : [];

    const allSongs = (artist.songs || []).map(mapRawSongToSongs);
    console.log(artist.songs[0]);

    const topAlbums = Array.isArray(artist.topAlbums)
      ? artist.topAlbums.map((album) => ({
          id: album.id,
          title: album.title || album.name,
          artist:
            album.artist || album.artists?.primary?.[0]?.name || "Unknown",
          image:
            typeof album.image === "string"
              ? album.image
              : album.image?.[2]?.url || "https://via.placeholder.com/150",
          songCount: album.songCount,
        }))
      : [];

    return {
      id: artist.id,
      name: artistName,
      image: artistImage,
      bio: bioText,
      topSongs,
      topAlbums,
      allSongs,
    };
  } catch (error) {
    console.warn("Artist details fetch error:", error);
    return null;
  }
}

export function MusicProvider({ children }) {
  const didLoadRef = useRef(false);
  const { token } = useContext(AuthContext);

  const [homeContent, setHomeContent] = useState({
    weeklyTop: [],
    newReleases: [],
    popularArtist: [],
    topPlaylist: [],
    trendingAlbums: [],
    newReleaseAlbums: [],
    bestOf90s: [],
  });
  const [searchResults, setSearchResults] = useState({
    songs: [],
    artists: [],
    playlists: [],
  });
  const [isPlaying, setIsPlaying] = useState(false);

  const [likedSongs, setLikedSongs] = useState([]);
  const [likedArtists, setLikedArtists] = useState([]);
  const [savedAlbums, setSavedAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [originalQueue, setOriginalQueue] = useState([]);
  const [history, setHistory] = useState([]);

  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");

  const currentSong = queue[currentIndex];

  const [currentAlbumId, setCurrentAlbumId] = useState(null);
  const [currentArtistId, setCurrentArtistId] = useState(null);

  const playSong = (song, songList = queue) => {
    const index = songList.findIndex((s) => s.id === song.id);
    if (index === -1) {
      setQueue([song]);
      setOriginalQueue([song]);
      setCurrentIndex(0);
    } else {
      setQueue(songList);
      setOriginalQueue(songList);
      setCurrentIndex(index);
    }
    setCurrentAlbumId(null);
    setCurrentArtistId(null);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  };

  const playAlbum = (songs, startIndex = 0, albumId = null) => {
    if (!songs || songs.length === 0) return;

    setQueue(songs);
    setOriginalQueue(songs);
    setCurrentIndex(startIndex);
    setCurrentAlbumId(albumId);
    setCurrentArtistId(null);
    setIsPlaying(true);
  };

  const playArtistSongs = (songs, startIndex = 0, artistId = null) => {
    if (!songs || songs.length === 0) return;

    const selectedSong = songs[startIndex];

    if (!selectedSong) return;

    setQueue(songs);
    setOriginalQueue(songs);
    setCurrentIndex(startIndex);

    setCurrentAlbumId(null);
    setCurrentArtistId(artistId);

    setIsPlaying(true);
  };

  const playNext = () => {
    if (repeatMode === "one") {
      return;
    }

    setHistory((prev) => [...prev, queue[currentIndex]]);

    if (currentIndex < queue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      if (repeatMode === "all") {
        setCurrentIndex(0);
      } else {
        setIsPlaying(false);
      }
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (repeatMode === "all") {
      setCurrentIndex(queue.length - 1);
    }
  };

  const shuffleQueue = () => {
    if (queue.length === 0) return;

    if (isShuffled) {
      const index = originalQueue.findIndex(
        (s) => s.id === queue[currentIndex].id,
      );

      setQueue(originalQueue);
      setCurrentIndex(index);
      setIsShuffled(false);
      return;
    }

    const current = queue[currentIndex];
    const newQueue = [...queue];

    for (let i = newQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newQueue[i], newQueue[j]] = [newQueue[j], newQueue[i]];
    }

    const newIndex = newQueue.findIndex((s) => s.id === current.id);

    setOriginalQueue(queue);
    setQueue(newQueue);
    setCurrentIndex(newIndex);
    setIsShuffled(true);
  };

  const handleEnded = () => {
    playNext();
  };

  const loadHomePageContent = async () => {
    try {
      const [
        weeklyTop,
        newReleases,
        trendingAlbums,
        newReleaseAlbums,
        bestOf90s,
        topPlaylist,
      ] = await Promise.all([
        fetchSongsByQuery("trending bollywood", 10),
        fetchSongsByQuery("New bollywood", 10),
        fetchAlbumsByQuery("trending bollywood", 10),
        fetchAlbumsByQuery("new bollywood", 10),
        fetchAlbumsByQuery("best of 90s hindi", 10),
        fetchAlbumsByQuery("Chill Playlist", 10),
      ]);

      const internationalArtists = [
        "Taylor Swift",
        "Billie Eilish",
        "Ed Sheeran",
        "A.R. Rahman",
        "Sonu Nigam",
      ];

      const indianArtists = [
        "Arijit Singh",
        "Shreya Ghoshal",
        "Armaan Malik",
        "Neha Kakkar",
        "Haney singh",
        "Amitabh Bhattacharya",
        "A.R. Rahman",
        "KK singer",
      ];

      const queries = [...indianArtists];

      const artistsResults = await runInBatches(queries, 2, (name) =>
        fetchArtistByQuery(name, 1),
      );

      const albumsResults = await runInBatches(queries, 1, (name) =>
        fetchAlbumsByQuery(name, 2),
      );

      const popularArtist = artistsResults.flat();
      const topAlbums = albumsResults.flat();

      const uniqueAlbums = Array.from(
        new Map(topAlbums.map((a) => [a.id, a])).values(),
      );

      const broadArtistQueries = [
        "Arijit Singh",
        "Shreya Ghoshal",
        "Sonu Nigam",
        "Armaan Malik",
        "Neha Kakkar",
        "A.R. Rahman",
        "Jubin Nautiyal",
        "Ed Sheeran",
        "KK singer",
        "Mohit Chauhan",
        "Divine rapper",
        "Ritviz singer",
        "Badshah rapper",
        "Diljit Dosanjh",
        "Honey Singh",
        "AP Dhillon",
        "Sidhu Moosewala",
        "Darshan Raval",
        "Neeti Mohan",
        "Sunidhi Chauhan",
        "Anuv Jain",
        "Prateek Kuhad",
        "Sachet Tandon",
        "Jonita Gandhi",
        "Shaan singer",
        "Kailash Kher",
        "Javed Ali",
        "Sachet Tandon",
        "Jonita Gandhi",
        "Dhvani Bhanushali",
        "Guru Randhawa",
        "B Praak",
        "Ammy Virk",
        "Jassie Gill",
        "Gippy Grewal",
        "Nakash Aziz",
        "Mohammed Rafi",
        "Jasleen Royal",
        "Karan Aujla",
        "Shankar Mahadevan",
        "Ilaiyaraaja",
        "Anirudh Ravichander",
        "Sid Sriram",
        "Amit Trivedi",
        "Pritam composer",
        "Lata Mangeshkar",
        "Kishore Kumar",
        "Mukesh singer",
        "Ankit Tiwari",
        "Tulsi Kumar",
        "Palak Muchhal",
        "Shilpa Rao",
        "Monali Thakur",
        "Asees Kaur",
        "Jasleen Royal",
      ];

      const broadArtistResults = await runInBatches(
        broadArtistQueries,
        2,
        (q) => fetchArtistByQuery(q, 1),
      );

      const allArtistsFlat = broadArtistResults.flat();

      const uniqueAllArtists = Array.from(
        new Map(allArtistsFlat.map((a) => [a.id, a])).values(),
      );

      setHomeContent({
        weeklyTop,
        newReleases,
        popularArtist,
        topAlbums: uniqueAlbums,
        trendingAlbums,
        newReleaseAlbums,
        allArtists: uniqueAllArtists,
        bestOf90s,
        topPlaylist,
      });
    } catch (error) {
      console.error("Home content fetching error", error);
    }
  };

  const searchMusic = async (query) => {
    if (!query.trim()) {
      setSearchResults({ songs: [], artists: [], playlists: [] });
      return;
    }
    try {
      const [songs, artists, playlists] = await Promise.all([
        fetchSongsByQuery(query, 8),
        fetchArtistByQuery(query, 4),
        fetchAlbumsByQuery(query, 4),
      ]);
      setSearchResults({ songs, artists, playlists });
    } catch (error) {
      console.error("Search error", error);
    }
  };

  const toggleFavorite = async (item, type, token, extra = {}) => {
    try {
      let url = "";
      let body = {};

      switch (type) {
        case "song":
          url = `${BACKEND_API}/liked-song`;
          body = { songId: item.id };
          break;

        case "artist":
          url = `${BACKEND_API}/liked-artist`;
          body = { artistId: item.id };
          break;

        case "album":
          url = `${BACKEND_API}/liked-playlist`;
          body = { playlistId: item.id };
          break;

        default:
          throw new Error("Invalid favorite type");
      }

      const data = await authFetch(url, token, {
        method: "POST",
        body: JSON.stringify(body),
      });

      switch (type) {
        case "song":
          setLikedSongs((prev) =>
            data.liked ? [...prev, item] : prev.filter((i) => i.id !== item.id),
          );
          break;

        case "artist":
          setLikedArtists((prev) =>
            data.liked ? [...prev, item] : prev.filter((i) => i.id !== item.id),
          );
          break;

        case "album":
          setSavedAlbums((prev) =>
            data.liked ? [...prev, item] : prev.filter((i) => i.id !== item.id),
          );
          break;

        default:
          break;
      }
    } catch (error) {
      console.error("toggle favorite error:", error);
    }
  };

  const createPlaylist = async (name) => {
    try {
      const data = await authFetch(`${BACKEND_API}/create-playlist`, token, {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      setPlaylists((prev) => [...prev, data.data]);
      return data?.data;
    } catch (error) {
      console.error("create playlist error:", error);
    }
  };

  const addSongToPlaylist = async (playlistId, track) => {
    try {
      const data = await authFetch(`${BACKEND_API}/my-playlist`, token, {
        method: "POST",
        body: JSON.stringify({ playlistId, songId: track.id }),
      });
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((pl) => {
          if (pl._id !== playlistId) return pl;
          return {
            ...pl,
            songs: data.liked
              ? [...pl.songs, track.id]
              : pl.songs.filter((songId) => songId !== track.id),
          };
        }),
      );
    } catch (error) {
      console.error("add to song playlist error:", error);
    }
  };

  useEffect(() => {
    if (didLoadRef.current) return;
    didLoadRef.current = true;
    loadHomePageContent();
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchUserData = async () => {
      try {
        const [songsData, artistsData, playlistsData, myPlaylistsData] =
          await Promise.all([
            authFetch(`${BACKEND_API}/liked-songs`, token),
            authFetch(`${BACKEND_API}/liked-artists`, token),
            authFetch(`${BACKEND_API}/liked-playlists`, token),
            authFetch(`${BACKEND_API}/my-playlists`, token),
          ]);
        setLikedSongs(songsData.data.map(mapRawSongToSongs));
        setLikedArtists(artistsData.data);
        const albumsData =
          playlistsData?.data?.data || playlistsData?.data || [];
        setSavedAlbums(Array.isArray(albumsData) ? albumsData : []);
        setPlaylists(myPlaylistsData.data);
      } catch (error) {
        console.error("fetch user data error:", error);
      }
    };
    fetchUserData();
  }, [token]);

  return (
    <MusicContext.Provider
      value={{
        homeContent,
        searchResults,
        searchMusic,
        currentSong,
        currentIndex,
        isPlaying,
        setIsPlaying,
        likedArtists,
        savedAlbums,
        likedSongs,
        toggleFavorite,
        playlists,
        createPlaylist,
        addSongToPlaylist,
        fetchSongsByQuery,
        fetchArtistByQuery,
        fetchAlbumsByQuery,
        fetchAlbumDetails,
        playSong,
        playAlbum,
        playNext,
        playPrevious,
        togglePlayPause,
        currentIndex,
        queue,
        handleEnded,
        shuffleQueue,
        isShuffled,
        toggleRepeat,
        repeatMode,
        currentAlbumId,
        currentArtistId,
        fetchArtistDetails,
        playArtistSongs,
        fetchSongById,
        toggleFavorite,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}
