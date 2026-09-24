import brandLogo from "../../public/favicon_io/favicon-32x32.png";

export const Footer = () => {
  return (
    <footer
      className="
        flex
        flex-col
        md:flex-row
        items-center
        justify-between
        pt-6
        pb-3
        px-4
        gap-2
        md:gap-1
      "
    >
      <div
        className="
          text-text-primary
          flex
          flex-row
          items-center
          justify-center
          gap-3
          flex-wrap
        "
      >
        <img
          src={brandLogo}
          alt="Ain Music"
          className="w-8 h-8 object-contain"
        />

        <p
          className="
            text-[0.85rem]
            sm:text-sm
            text-text-secondary
          "
        >
          &copy; 2026 Ain Music. All rights reserved.
        </p>
      </div>

      <div
        className="
          md:ml-auto
          text-sm
          px-1
          mt-2
          md:mt-0
        "
      >
        <span className="text-text-secondary">
          Designed &amp; developed by{" "}
        </span>

        <a
          href="https://hussain-portfolio-pink.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex
            items-center
            font-bold
            text-xl
            hover:underline
            transition
          "
        >
          <span className="text-[#4285F4]">H</span>
          <span className="text-[#EA4335]">u</span>
          <span className="text-[#FBBC05]">s</span>
          <span className="text-[#FBBC05]">s</span>
          <span className="text-[#4285F4]">a</span>
          <span className="text-[#34A853]">i</span>
          <span className="text-[#EA4335]">n</span>
        </a>
      </div>
    </footer>
  );
};