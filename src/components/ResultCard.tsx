import { useMemo } from "react";
import { Heart, Info, Link as LinkIcon } from "lucide-react";
import type { Product } from "../lib/types";

type Props = {
  product: Product;
};

const ResultCard = ({ product }: Props) => {
  const imageSrc = useMemo(() => {
    if (product.image_url_local) return product.image_url_local;
    if (product.image_url) return product.image_url;
    return "/placeholder.svg";
  }, [product.image_url, product.image_url_local]);

  const similarityLabel = useMemo(() => {
    if (typeof product.similarity_percentage === "number") {
      return `${product.similarity_percentage.toFixed(1)}% match`;
    }
    if (typeof product.similarity === "number") {
      return `${(product.similarity * 100).toFixed(1)}% match`;
    }
    return null;
  }, [product.similarity, product.similarity_percentage]);

  const formattedPrice = useMemo(() => {
    const value =
      typeof product.price === "number" ? product.price : Number(product.price);
    if (!Number.isFinite(value)) {
      return "Price on request";
    }
    return `$${value.toFixed(2)}`;
  }, [product.price]);

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-primary-100 bg-white/95 shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 w-full overflow-hidden bg-primary-50/60">
        <img
          src={imageSrc}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {similarityLabel && (
          <span className="absolute right-3 top-3 rounded-full bg-primary-50/90 px-3 py-1 text-xs font-semibold text-primary-700 shadow">
            {similarityLabel}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <header className="space-y-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold text-primary-700">
              {product.name}
            </h3>
            <button
              type="button"
              className="rounded-full border border-transparent p-2 text-primary-500/80 transition hover:border-primary-100 hover:bg-primary-50 hover:text-primary-600"
              aria-label="Save for later"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>
          <div className="text-xs uppercase tracking-wide text-primary-500">
            {product.brand ?? "Unbranded"}
          </div>
        </header>
        <p className="line-clamp-3 text-sm text-primary-600/90">
          {product.description ?? "No description available for this product yet."}
        </p>
        <div className="mt-auto flex items-center justify-between text-sm text-primary-600/90">
          <span className="font-medium text-primary-700">{formattedPrice}</span>
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>{product.category}</span>
          </div>
        </div>
        {product.image_url && (
          <a
            href={product.image_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 transition hover:text-primary-700"
          >
            <LinkIcon className="h-4 w-4" />
            View original image
          </a>
        )}
      </div>
    </article>
  );
};

export default ResultCard;
