import { motion } from "framer-motion";
import { Star, ShoppingCart } from "lucide-react";
import { getServiceImage } from "../../data/serviceAssets";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80";

function formatPrice(amount) {
  return new Intl.NumberFormat("fr-FR").format(amount);
}

export default function ServiceCard({ service, onAddToCart }) {
  const handleAddToCart = onAddToCart;
  const imageSrc = getServiceImage(service.id) || service.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="h-full"
    >
      <div className="flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full">
        <div className="w-full h-48 overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={imageSrc}
            alt={service.title}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
        </div>

        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">
              {service.title}
            </h3>
            <div className="text-xl font-extrabold text-blue-600 mb-2">
              DH {formatPrice(service.price)}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1 text-yellow-400 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleAddToCart && handleAddToCart(service)}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer mt-auto"
            >
              <ShoppingCart className="w-4 h-4 text-white shrink-0" />
              <span className="text-white text-sm font-medium">Ajouter au panier</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}