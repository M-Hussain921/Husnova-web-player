import { Outlet } from "react-router-dom";
import { useContext, useState } from "react";

import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { Player } from "./Player";
import { Footer } from "./Footer";
import { Loader } from "./Loader";

import { MusicContext } from "../context/MusicContext";

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { loading, currentSong } = useContext(MusicContext);

  if (loading) return <Loader />;

  return (
    <div className="h-dvh bg-bg text-text-primary overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="h-full flex flex-col min-w-0 lg:ml-60">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main
          className={`
            flex-1
            min-h-0
            overflow-y-auto
            flex
            flex-col
            ${currentSong ? "pb-24" : "pb-0"}
          `}
        >
          <div className="flex-1">
            <Outlet />
          </div>

          <Footer />
        </main>
      </div>

      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 z-[2000]">
          <Player />
        </div>
      )}
    </div>
  );
};

export default Layout;