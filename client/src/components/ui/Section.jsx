export default function Section({
  children,
  className = "",
  container = true,
  dark = false,
  ...props
}) {
  return (
    <section
      className={`${dark ? "bg-white/[0.02]" : ""} ${className}`}
      {...props}
    >
      {container ? (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}
