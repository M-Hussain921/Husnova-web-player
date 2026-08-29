import Logo from "../assets/brand-logo.png";

export const Loader = ({ message = "Loading your music..." }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg">
      <div className="mt-6 flex items-end gap-1 h-8">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="w-1.5 rounded-full bg-brand-primary"
            style={{
              animation: `eq 0.9s ease-in-out ${i * 0.12}s infinite`,
            }}
          />
        ))}
      </div>

      <h2 className="mt-6 text-lg sm:text-xl font-semibold text-text-primary tracking-wide">
        HUSNOVA
      </h2>
      <p className="mt-2 text-sm text-text-secondary">{message}</p>
    </div>
  );
};
