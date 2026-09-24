import { useRef } from "react";
import {
  FiHome,
  FiDisc,
  FiUsers,
  FiHeart,
  FiList,
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
      {isOpen && (
        <div
          className="
            fixed inset-0
            bg-black/50
            backdrop-blur-[2px]
            z-[900]
            lg:hidden
          "
        />
      )}

      <aside
        ref={sidebarRef}
        className={`
          fixed
          top-0
          left-0
          z-[1001]
          w-[82vw]
          max-w-60
          h-dvh
          bg-surface
          border-r
          border-brand-light/15
          flex
          flex-col
          overflow-hidden
          transition-transform
          duration-300
          ease-out
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
          lg:z-40
        `}
      >
        <div
          className="
            shrink-0
            flex
            items-center
            justify-center
            px-3
            py-4
            sm:px-4
            sm:py-5
            lg:py-3.5
            border-b
            border-brand-light/15
          "
        >
          <img
            src={BrandLogo}
            alt="Husnova"
            className="
              w-28
              h-auto
              object-contain
              sm:w-32
              md:w-34
              lg:w-32
              xl:w-36
            "
          />
        </div>

        <nav
          className="
            flex-1
            min-h-0
            overflow-y-auto
            px-2
            py-4
            sm:px-3
            sm:py-5
            scrollbar-thin
          "
        >
          {menuSections.map((section) => (
            <div
              key={section.title}
              className="
                mb-6
                sm:mb-7
                lg:mb-6
                xl:mb-7
              "
            >
              <p
                className="
                  px-2
                  sm:px-3
                  mb-2
                  sm:mb-2.5
                  text-[9px]
                  sm:text-[10px]
                  md:text-[10px]
                  lg:text-[9px]
                  xl:text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-text-secondary/60
                "
              >
                {section.title}
              </p>

              <ul
                className="
                  space-y-0.5
                  sm:space-y-1
                "
              >
                {section.links.map((link) => {
                  const Icon = link.icon;

                  return (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        end={link.to === "/"}
                        onClick={onClose}
                        className="
                          group
                          relative
                          flex
                          items-center
                          gap-2.5
                          sm:gap-3
                          w-full
                          px-2
                          sm:px-2.5
                          py-2
                          sm:py-2.5
                          rounded-lg
                          sm:rounded-xl
                          transition-all
                          duration-200
                        "
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <span
                                className="
                                  absolute
                                  left-0
                                  w-0.5
                                  h-5
                                  rounded-full
                                  bg-brand-primary
                                "
                              />
                            )}

                            <span
                              className={`
                                shrink-0
                                flex
                                items-center
                                justify-center
                                transition-colors
                                ${
                                  isActive
                                    ? "text-brand-primary"
                                    : "text-text-secondary group-hover:text-text-primary"
                                }
                              `}
                            >
                              <Icon
                                className="
                                  text-[15px]
                                  sm:text-[17px]
                                  md:text-[18px]
                                  lg:text-[16px]
                                  xl:text-[17px]
                                "
                              />
                            </span>

                            <span
                              className={`
                                truncate
                                font-medium
                                text-[12px]
                                sm:text-sm
                                md:text-sm
                                lg:text-[13px]
                                xl:text-sm
                                transition-colors
                                ${
                                  isActive
                                    ? "text-text-primary"
                                    : "text-text-secondary group-hover:text-text-primary"
                                }
                              `}
                            >
                              {link.name}
                            </span>
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
            shrink-0
            h-3
            sm:h-4
            border-t
            border-brand-light/10
          "
        />
      </aside>
    </>
  );
};