import { useRef } from "react";
import {
  FiHome,
  FiDisc,
  FiUsers,
  FiHeart,
  FiList,
  FiMusic,
  FiX,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";

import BrandLogo from "../assets/brand-logo.png";
import { useClickOutside } from "../hooks/useClickOutside.js";

export const Sidebar = ({ isOpen, onClose }) => {
  const sidebarRef = useRef(null);

  useClickOutside(sidebarRef, onClose, isOpen);

  const menuSections = [
    {
      title: "Library",
      links: [
        {
          name: "Home",
          icon: FiHome,
          to: "/",
        },
        {
          name: "Albums",
          icon: FiDisc,
          to: "/albums",
        },
        {
          name: "Artists",
          icon: FiUsers,
          to: "/artists",
        },
      ],
    },
    {
      title: "Your Music",
      links: [
        {
          name: "My Playlist",
          icon: FiList,
          to: "/your-playlists",
        },
        {
          name: "My Favorites",
          icon: FiHeart,
          to: "/your-favorites",
        },
      ],
    },
  ];

  return (
    <>
      <aside
        ref={sidebarRef}
        className={`
          fixed
          top-0
          left-0
          z-[1001]
          w-60
          bg-surface
          border-brand-light/20
          flex
          flex-col
          rounded-br-2xl
          overflow-hidden
          transition-transform
          duration-300
          ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]"}
          lg:translate-x-0
          lg:z-40
        `}
      >
        <div
          className="
            relative
            flex
            items-center
            justify-center

            px-4
            py-4

            border-b
            border-brand-light/15
          "
        >
          <img
            src={BrandLogo}
            alt="Husnova"
            className="
              w-36
              h-auto
              object-contain
            "
          />
        </div>

        <nav
          className="
            flex-1
            overflow-y-auto
            px-3
            py-4
            scrollbar-thin
          "
        >
          {menuSections.map((section) => (
            <div key={section.title} className="mb-6 last:mb-0">
              <p
                className="
                  px-3
                  mb-2
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-text-secondary/60
                "
              >
                {section.title}
              </p>

              <ul className="space-y-1">
                {section.links.map((link) => {
                  const Icon = link.icon;

                  return (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        end={link.to === "/"}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `
                            group
                            flex
                            items-center
                            gap-2.5
                            w-full
                            px-2
                            py-1.5
                            rounded-xl
                            text-sm
                            font-medium
                            transition-all
                            duration-200
                           
                          `
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span
                              className={`
                                relative
                                shrink-0
                                flex
                                items-center
                                justify-center
                                rounded-lg
                                transition-all
                                duration-200
                                ${
                                  isActive
                                    ? `
                                      text-white
                                    `
                                    : `
                                      text-text-secondary
                                    `
                                }
                              `}
                            >
                              <Icon className="text-[17px]" />
                            </span>

                            <span className={`truncate  ${
                                  isActive
                                    ? `
                                      text-white
                                    `
                                    : `
                                      text-text-secondary
                                    `
                                }`}>{link.name}</span>
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div
          className="
            px-4
            py-2

            border-t
            border-brand-light/15
          "
        >
          <div
            className="
              flex
              items-center
              gap-2

              text-[11px]
              text-text-secondary/50
            "
          ></div>
        </div>
      </aside>
    </>
  );
};
