export default function Container({
  children,
  className = "",
  size = "default",
  ...props
}) {
  const sizes = {
    sm: "max-w-3xl",
    default: "max-w-7xl",
    lg: "max-w-[90rem]",
    full: "max-w-full",
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizes[size]} ${className}`} {...props}>
      {children}
    </div>
  );
}
