import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { getCategories, getProducts, searchProducts } from "../lib/api";
import ResultCard from "./ResultCard";
const MAX_RESULTS = 24;
const ProductMatcher = () => {
    const [catalogue, setCatalogue] = useState([]);
    const [categories, setCategories] = useState(["All"]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [filePreview, setFilePreview] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState([]);
    const [queryId, setQueryId] = useState(null);
    const [error, setError] = useState(null);
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
            }
            catch (err) {
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
    const handleFileChange = (event) => {
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
    const handleUrlChange = (event) => {
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
    const onSubmit = async (event) => {
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
        }
        catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Search failed. Please try again.");
        }
        finally {
            setIsSearching(false);
        }
    };
    const filteredCatalogue = useMemo(() => {
        if (selectedCategory === "All") {
            return catalogue;
        }
        return catalogue.filter((item) => item.category?.toLowerCase() === selectedCategory.toLowerCase());
    }, [catalogue, selectedCategory]);
    const sliderBackground = useMemo(() => {
        const clamped = Math.min(Math.max(threshold, 0), 100);
        const fill = clamped === 0 ? 0.5 : clamped;
        return `linear-gradient(to right, #6f4e37 ${fill}%, #e5d6c9 ${fill}%)`;
    }, [threshold]);
    return (_jsxs("div", { className: "grid gap-10 lg:grid-cols-[380px,_1fr]", children: [_jsxs("section", { className: "space-y-6 rounded-3xl border border-primary-100/60 bg-white/95 p-6 shadow-soft", children: [_jsxs("form", { className: "space-y-5", onSubmit: onSubmit, children: [_jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "text-sm font-medium text-primary-700", children: "Upload image" }), _jsx("input", { type: "file", accept: "image/*", onChange: handleFileChange, className: "block w-full cursor-pointer rounded-xl border border-dashed border-primary-200/80 bg-primary-50/50 p-3 text-sm text-primary-700" }), _jsx("p", { className: "text-xs text-primary-600/80", children: "JPEG, PNG or WebP. Large files are resized automatically before matching." })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "text-sm font-medium text-primary-700", children: "Or paste image URL" }), _jsx("input", { type: "url", value: imageUrl, onChange: handleUrlChange, placeholder: "https://...", className: "w-full rounded-xl border border-primary-100 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100" })] }), filePreview && (_jsx("div", { className: "overflow-hidden rounded-2xl border border-primary-100 bg-primary-50/60", children: _jsx("img", { src: filePreview, alt: "Query preview", className: "h-48 w-full object-cover" }) })), _jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [_jsxs("label", { className: "space-y-2 text-sm font-medium text-primary-700", children: ["Top results", _jsx("input", { type: "number", min: 1, max: MAX_RESULTS, value: topK, onChange: (event) => {
                                                    const value = Number(event.target.value);
                                                    setTopK(Number.isFinite(value) ? value : 12);
                                                }, className: "w-full rounded-xl border border-primary-100 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100" })] }), _jsxs("label", { className: "space-y-2 text-sm font-medium text-primary-700", children: ["Threshold (", threshold, "%)", _jsx("input", { type: "range", min: 0, max: 100, step: 5, value: threshold, onChange: (event) => {
                                                    const value = Number(event.target.value);
                                                    setThreshold(Number.isFinite(value) ? value : 0);
                                                }, className: "threshold-slider w-full", style: { accentColor: "#6f4e37", background: sliderBackground } })] })] }), _jsx("button", { type: "submit", disabled: isSearching, className: "flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-primary-600 hover:to-primary-600 disabled:cursor-not-allowed disabled:from-primary-200 disabled:to-primary-200", children: isSearching ? "Searching..." : "Find similar products" }), _jsx("button", { type: "button", onClick: resetQuery, className: "w-full rounded-full border border-primary-200/80 px-4 py-2 text-sm font-semibold text-primary-700 transition hover:border-primary-200 hover:bg-primary-50/60", children: "Clear" })] }), error && (_jsx("div", { className: "rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-sm text-primary-700", children: error })), _jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "text-sm font-medium text-primary-700", children: "Browse catalogue" }), _jsx("select", { value: selectedCategory, onChange: (event) => setSelectedCategory(event.target.value), className: "w-full rounded-xl border border-primary-100 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100", children: categories.map((category) => (_jsx("option", { value: category, children: category }, category))) }), _jsxs("ul", { className: "divide-y divide-primary-100/70 rounded-2xl border border-primary-100 bg-primary-50/40", children: [filteredCatalogue.map((product) => (_jsxs("li", { className: "flex items-start gap-3 px-3 py-3 text-primary-700", children: [_jsx("div", { className: "h-12 w-12 overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-primary-100/60", children: product.image_url_local || product.image_url ? (_jsx("img", { src: product.image_url_local || product.image_url, alt: product.name, className: "h-full w-full object-cover" })) : (_jsx("div", { className: "flex h-full w-full items-center justify-center text-xs text-primary-500/70", children: "No image" })) }), _jsxs("div", { className: "flex-1 text-sm", children: [_jsx("p", { className: "font-medium text-primary-700", children: product.name }), _jsx("p", { className: "text-xs uppercase tracking-wide text-primary-500/80", children: product.category })] })] }, product.id))), filteredCatalogue.length === 0 && (_jsx("li", { className: "px-3 py-4 text-center text-sm text-primary-500/80", children: "No catalogue entries for this category yet." }))] })] })] }), _jsxs("section", { className: "space-y-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-semibold text-primary-700", children: "Search results" }), queryId && (_jsxs("span", { className: "rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700", children: ["Query #", queryId.slice(0, 8)] }))] }), _jsx("p", { className: "text-sm text-primary-600/80", children: results.length
                                    ? "Matches are sorted by cosine similarity."
                                    : "Run a search to see visually similar items." })] }), results.length > 0 ? (_jsx("div", { className: "grid gap-6 sm:grid-cols-2 xl:grid-cols-3", children: results.map((product) => (_jsx(ResultCard, { product: product }, `${product.id}-${product.similarity}`))) })) : (_jsx("div", { className: "flex min-h-[220px] items-center justify-center rounded-3xl border border-dashed border-primary-200/70 bg-white/90 text-sm text-primary-500/80", children: "Upload an image to see similar products." }))] })] }));
};
export default ProductMatcher;
