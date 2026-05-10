export default function Button({
  children,
  type = "button",
  variant = "primary",
  disabled,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50";
  const styles = {
    primary: "bg-brand-600 text-white hover:bg-brand-700",
    secondary:
      "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-slate-600 hover:bg-slate-100",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${styles[variant] || styles.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
