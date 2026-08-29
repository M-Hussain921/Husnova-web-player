import { useContext } from "react";
import { MusicContext } from "../context/MusicContext";
import { AlbumPlayButton } from "../components/AlbumPlayButton";
import { FavoriteButton } from "../components/FavoriteButton";
import { AlbumCard } from "../components/AlbumCard";

export const AlbumPage = () => {
  const { homeContent } = useContext(MusicContext);

  return (
    <div className="px-4 pt-4 sm:px-6 sm:pt-6">
      <AlbumCard
        title="Trending"
        albums={homeContent.trendingAlbums}
      />
      <AlbumCard
        title="New Release"
        albums={homeContent.newReleaseAlbums}
      />
      <AlbumCard
        title="New Bollywood"
        albums={homeContent.topAlbums}
      />
      <AlbumCard
        title="Best Of 90s"
        albums={homeContent.bestOf90s}
      />
      <AlbumCard
        title="Top Playist"
        albums={homeContent.topPlaylist}
      />
      <div>
        <h2 className="m-auto text-center text-text-secondary text-base sm:text-xl font-semibold mt-10 px-2">
          ----- Loop it. Live it. -----
        </h2>
      </div>
    </div>
  );
};
