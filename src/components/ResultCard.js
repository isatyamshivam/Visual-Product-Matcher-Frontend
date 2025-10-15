import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { Heart, Info, Link as LinkIcon } from "lucide-react";
const ResultCard = ({ product }) => {
    const imageSrc = useMemo(() => {
        if (product.image_url_local)
            return product.image_url_local;
        if (product.image_url)
            return product.image_url;
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
        const value = typeof product.price === "number" ? product.price : Number(product.price);
        if (!Number.isFinite(value)) {
            return "Price on request";
        }
        return `$${value.toFixed(2)}`;
    }, [product.price]);
    return (_jsxs("article", { className: "group flex flex-col overflow-hidden rounded-3xl border border-primary-100 bg-white/95 shadow-soft transition hover:-translate-y-1 hover:shadow-xl", children: [_jsxs("div", { className: "relative h-56 w-full overflow-hidden bg-primary-50/60", children: [_jsx("img", { src: imageSrc, alt: product.name, className: "h-full w-full object-cover transition duration-500 group-hover:scale-105" }), similarityLabel && (_jsx("span", { className: "absolute right-3 top-3 rounded-full bg-primary-50/90 px-3 py-1 text-xs font-semibold text-primary-700 shadow", children: similarityLabel }))] }), _jsxs("div", { className: "flex flex-1 flex-col gap-3 p-5", children: [_jsxs("header", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsx("h3", { className: "text-base font-semibold text-primary-700", children: product.name }), _jsx("button", { type: "button", className: "rounded-full border border-transparent p-2 text-primary-500/80 transition hover:border-primary-100 hover:bg-primary-50 hover:text-primary-600", "aria-label": "Save for later", children: _jsx(Heart, { className: "h-4 w-4" }) })] }), _jsx("div", { className: "text-xs uppercase tracking-wide text-primary-500", children: product.brand ?? "Unbranded" })] }), _jsx("p", { className: "line-clamp-3 text-sm text-primary-600/90", children: product.description ?? "No description available for this product yet." }), _jsxs("div", { className: "mt-auto flex items-center justify-between text-sm text-primary-600/90", children: [_jsx("span", { className: "font-medium text-primary-700", children: formattedPrice }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Info, { className: "h-4 w-4" }), _jsx("span", { children: product.category })] })] }), product.image_url && (_jsxs("a", { href: product.image_url, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-2 text-sm font-medium text-primary-600 transition hover:text-primary-700", children: [_jsx(LinkIcon, { className: "h-4 w-4" }), "View original image"] }))] })] }));
};
export default ResultCard;
