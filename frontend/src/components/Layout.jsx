import { Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { Player } from "./Player";
import { Footer } from "./Footer";
import { Loader } from "./loader";
import { MusicContext } from "../context/MusicContext";
export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {loading}=useContext(MusicContext);

  if(loading) return <Loader/>;

  const onMenuClick = () => {
    setSidebarOpen(true);
  };

  const onClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen h-dvh bg-bg text-text-primary overflow-hidden">
      <div className="flex flex-1 overflow-hidden min-h-0">
        <Sidebar isOpen={sidebarOpen} onClose={onClose} />

        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          <Navbar onMenuClick={onMenuClick} />

          <main className="flex-1 overflow-y-auto flex flex-col">
            <div className="flex-1">
              <Outlet />
            </div>
            <Footer />
          </main>
        </div>
      </div>
      <Player />
    </div>
  );
};

export default Layout;