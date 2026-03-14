import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../context/ToastContext";

export default function NotificationToast() {
  const { toasts } = useToast();

  return (
    <div className="fixed right-4 top-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`rounded-2xl px-4 py-3 font-semibold shadow-playful ${
              toast.type === "error" ? "bg-coral text-white" : "bg-mint text-ink"
            }`}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
