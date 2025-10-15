import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { getCategories, getProducts, searchProducts } from "../lib/api";
import type { Product } from "../lib/types";
import ResultCard from "./ResultCard";

const MAX_RESULTS = 24;

const ProductMatcher = () => {
  const [catalogue, setCatalogue] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [queryId, setQueryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [topK, setTopK] = useState(12);
  const [threshold, setThreshold] = useState(0);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [fetchedCategories, products] = await Promise.all([
          getCategories(),
          getProducts({ limit: 12 }),
        ]);
        if (fetchedCategories.length) {
          setCategories(fetchedCategories);
        }
        setCatalogue(products);
      } catch (err) {
        console.error(err);
        setError("Unable to load initial data. Check that the API is running.");
      }
    };
    bootstrap();
  }, []);

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setFilePreview(null);
      return;
    }
    setImageFile(file);
    setImageUrl("");
    setError(null);
    const url = URL.createObjectURL(file);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFilePreview(url);
  };

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setImageUrl(value);
    setImageFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFilePreview(value ? value.trim() : null);
  };

  const resetQuery = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setImageFile(null);
    setImageUrl("");
    setFilePreview(null);
    setResults([]);
    setQueryId(null);
    setError(null);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!imageFile && !imageUrl.trim()) {
      setError("Select an image file or paste an image URL before searching.");
      return;
    }

    setIsSearching(true);
    try {
      const topResults = Math.min(Math.max(topK, 1), MAX_RESULTS);
      const similarity = Math.min(Math.max(threshold, 0), 100);
      const payload = await searchProducts({
        file: imageFile ?? undefined,
        imageUrl: imageUrl.trim() || undefined,
        topK: topResults,
        threshold: similarity / 100,
      });
      setResults(payload.results);
      setQueryId(payload.query_id);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Search failed. Please try again."
      );
    } finally {
      setIsSearching(false);
    }
  };

  const filteredCatalogue = useMemo(() => {
    if (selectedCategory === "All") {
      return catalogue;
    }
    return catalogue.filter(
      (item: Product) =>
        item.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [catalogue, selectedCategory]);

  const sliderBackground = useMemo(() => {
    const clamped = Math.min(Math.max(threshold, 0), 100);
    const fill = clamped === 0 ? 0.5 : clamped;
    return `linear-gradient(to right, #6f4e37 ${fill}%, #e5d6c9 ${fill}%)`;
  }, [threshold]);

  return (
    <div className="grid gap-10 lg:grid-cols-[380px,_1fr]">
      <section className="space-y-6 rounded-3xl border border-primary-100/60 bg-white/95 p-6 shadow-soft">
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-3">
            <label className="text-sm font-medium text-primary-700">Upload image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full cursor-pointer rounded-xl border border-dashed border-primary-200/80 bg-primary-50/50 p-3 text-sm text-primary-700"
            />
            <p className="text-xs text-primary-600/80">
              JPEG, PNG or WebP. Large files are resized automatically before
              matching.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-primary-700">Or paste image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={handleUrlChange}
              placeholder="https://..."
              className="w-full rounded-xl border border-primary-100 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {filePreview && (
            <div className="overflow-hidden rounded-2xl border border-primary-100 bg-primary-50/60">
              <img
                src={filePreview}
                alt="Query preview"
                className="h-48 w-full object-cover"
              />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-primary-700">
              Top results
              <input
                type="number"
                min={1}
                max={MAX_RESULTS}
                value={topK}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const value = Number(event.target.value);
                    setTopK(Number.isFinite(value) ? value : 12);
                  }}
                className="w-full rounded-xl border border-primary-100 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-primary-700">
              Threshold ({threshold}%)
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={threshold}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const value = Number(event.target.value);
                    setThreshold(Number.isFinite(value) ? value : 0);
                  }}
                className="threshold-slider w-full"
                style={{ accentColor: "#6f4e37", background: sliderBackground }}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-primary-600 hover:to-primary-600 disabled:cursor-not-allowed disabled:from-primary-200 disabled:to-primary-200"
          >
            {isSearching ? "Searching..." : "Find similar products"}
          </button>
          <button
            type="button"
            onClick={resetQuery}
            className="w-full rounded-full border border-primary-200/80 px-4 py-2 text-sm font-semibold text-primary-700 transition hover:border-primary-200 hover:bg-primary-50/60"
          >
            Clear
          </button>
        </form>

        {error && (
          <div className="rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-sm text-primary-700">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <label className="text-sm font-medium text-primary-700">Browse catalogue</label>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="w-full rounded-xl border border-primary-100 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ul className="divide-y divide-primary-100/70 rounded-2xl border border-primary-100 bg-primary-50/40">
            {filteredCatalogue.map((product) => (
              <li key={product.id} className="flex items-start gap-3 px-3 py-3 text-primary-700">
                <div className="h-12 w-12 overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-primary-100/60">
                  {product.image_url_local || product.image_url ? (
                    <img
                      src={product.image_url_local || product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-primary-500/70">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium text-primary-700">{product.name}</p>
                  <p className="text-xs uppercase tracking-wide text-primary-500/80">{product.category}</p>
                </div>
              </li>
            ))}
            {filteredCatalogue.length === 0 && (
              <li className="px-3 py-4 text-center text-sm text-primary-500/80">
                No catalogue entries for this category yet.
              </li>
            )}
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary-700">Search results</h2>
            {queryId && (
              <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                Query #{queryId.slice(0, 8)}
              </span>
            )}
          </div>
          <p className="text-sm text-primary-600/80">
            {results.length
              ? "Matches are sorted by cosine similarity."
              : "Run a search to see visually similar items."}
          </p>
        </div>

        {results.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((product) => (
              <ResultCard key={`${product.id}-${product.similarity}`} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-dashed border-primary-200/70 bg-white/90 text-sm text-primary-500/80">
            Upload an image to see similar products.
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductMatcher;
