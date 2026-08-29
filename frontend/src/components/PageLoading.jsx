export const PageLoading = () => {
  return (
    <div className="grid place-items-center h-screen">
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
    </div>
  );
};
