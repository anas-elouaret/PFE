import { motion, AnimatePresence } from "framer-motion";

export default function Modal({
  isOpen,
  onClose,
  children,
  className = "",
  size = "md",
}) {
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[calc(100vw-2rem)]",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[999] flex items-center justify-center px-4 py-12"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className={`
              relative w-full ${sizes[size]}
              rounded-2xl border border-white/10
              bg-gradient-to-b from-[#12121a] to-[#0a0a0f]
              shadow-[0_30px_80px_rgba(0,0,0,0.4)]
              overflow-hidden
              ${className}
            `}
          >
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#00AEEF]/8 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#33C8FF]/8 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ModalHeader({ children, onClose, className = "" }) {
  return (
    <div className={`flex items-center justify-between border-b border-white/10 px-6 py-5 ${className}`}>
      <div className="text-lg font-bold text-white">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function ModalBody({ children, className = "" }) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
}

export function ModalFooter({ children, className = "" }) {
  return (
    <div className={`border-t border-white/10 px-6 py-4 flex items-center justify-end gap-3 ${className}`}>
      {children}
    </div>
  );
}
