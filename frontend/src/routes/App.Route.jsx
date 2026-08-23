import { Routes, Route } from "react-router-dom";
import { AlbumDetailPage } from "../components/AlbumDetailPage.jsx";
import { ArtistsPage } from "../pages/ArtistsPage.jsx";
import { ArtistDetailPage } from "../pages/ArtistDetailPage.jsx";
import { Home } from "../pages/Home.jsx";
import { YourFavoritesPage } from "../pages/YourFavorites.jsx";
import { Layout } from "../components/Layout.jsx";
import { AlbumPage } from "../pages/AlbumPage.jsx";
import { PlaylistDetailPage } from "../pages/PlaylistDetailPage.jsx";
import { ProtectedRoutes } from "../auth/ProtectedRoute.jsx";
import { AuthForm } from "../components/AuthForm.jsx";
import { YourPlaylistsPage } from "../pages/YourPlaylist.jsx";
import { CreatePlaylistPage } from "../components/CreatePlaylistpage.jsx";

export const AppRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="join" element={<AuthForm />} />

        <Route
          path="your-playlists"
          element={
            <ProtectedRoutes>
              <YourPlaylistsPage />
            </ProtectedRoutes>
          }
        />

        <Route
          path="your-favorites"
          element={
            <ProtectedRoutes>
              <YourFavoritesPage />
            </ProtectedRoutes>
          }
        />

        <Route
          path="create-playlist"
          element={
            <ProtectedRoutes>
              <CreatePlaylistPage />
            </ProtectedRoutes>
          }
        />

        <Route index element={<Home />} />
        <Route path="albums" element={<AlbumPage />} />
        <Route path="artists" element={<ArtistsPage />} />
        <Route path="/album/:id" element={<AlbumDetailPage />} />
        <Route path="/artist/:id" element={<ArtistDetailPage />} />
        <Route path="/playlist/:id" element={<PlaylistDetailPage />} />
      </Route>
    </Routes>
  );
};
