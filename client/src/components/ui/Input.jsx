import { useState } from "react";
import { motion } from "framer-motion";

export default function Input({
  label,
  placeholder,
  type = "text",
  className = "",
  error,
  floating = false,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleInput = (e) => setHasValue(e.target.value.length > 0);

  const inputClasses = `
    w-full rounded-xl border bg-[#0f0f0f]/80 backdrop-blur-sm px-4 py-3
    text-sm text-white outline-none transition-all duration-200
    ${error ? "border-red-500/50 focus:border-red-500" : focused ? "border-[#00AEEF]/50 shadow-[0_0_20px_rgba(0,174,239,0.08)]" : "border-white/10"}
    ${floating && label ? "pt-6 pb-2" : ""}
    ${className}
  `;

  const sharedProps = {
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    onInput: handleInput,
    placeholder: floating ? " " : placeholder,
    className: inputClasses,
  };

  return (
    <div className="relative">
      {label && !floating && (
        <label className="block text-xs font-bold uppercase tracking-[0.1em] text-zinc-400 mb-2">
          {label}
        </label>
      )}

      {floating && label && (
        <motion.label
          animate={{
            y: focused || hasValue ? 0 : 20,
            scale: focused || hasValue ? 0.75 : 1,
            color: focused ? "rgba(0,174,239,0.8)" : "rgba(163,163,163,0.6)",
          }}
          transition={{ duration: 0.15 }}
          className="absolute left-4 top-3 z-10 origin-left text-sm pointer-events-none"
        >
          {label}
        </motion.label>
      )}

      {type === "textarea" ? (
        <textarea rows={4} {...sharedProps} {...props} />
      ) : (
        <input type={type} {...sharedProps} {...props} />
      )}

      {focused && !error && (
        <motion.div
          layoutId="input-glow"
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ boxShadow: "0 0 25px rgba(0,174,239,0.06)" }}
        />
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
