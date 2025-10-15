import type {
  CategoryResponse,
  Product,
  ProductListResponse,
  ProductSearchResponse,
} from "./types";

const API_BASE = import.meta.env.VITE_API_URL ?? (__API_URL__ as string);

const defaultHeaders = {
  Accept: "application/json",
};

const toQueryString = (params: Record<string, unknown>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    query.append(key, String(value));
  });
  const result = query.toString();
  return result ? `?${result}` : "";
};

export const getProducts = async (params: {
  category?: string;
  available?: boolean;
  limit?: number;
} = {}): Promise<Product[]> => {
  const response = await fetch(
    `${API_BASE}/api/products${toQueryString(params)}`,
    {
      headers: defaultHeaders,
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch products (${response.status})`);
  }
  const payload: ProductListResponse = await response.json();
  return payload.products ?? [];
};

export const getCategories = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE}/api/categories`, {
    headers: defaultHeaders,
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch categories (${response.status})`);
  }
  const payload: CategoryResponse = await response.json();
  return payload.categories ?? [];
};

export const searchProducts = async (input: {
  file?: File | null;
  imageUrl?: string;
  topK?: number;
  threshold?: number;
}): Promise<ProductSearchResponse> => {
  const form = new FormData();
  if (input.file) {
    form.append("file", input.file);
  }
  if (input.imageUrl) {
    form.append("image_url", input.imageUrl);
  }
  form.append("top_k", String(input.topK ?? 12));
  form.append("similarity_threshold", String(input.threshold ?? 0));

  const response = await fetch(`${API_BASE}/api/search`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Search failed");
  }

  return (await response.json()) as ProductSearchResponse;
};

export const getRelatedProducts = async (
  productId: string,
  limit = 6
): Promise<Product[]> => {
  const response = await fetch(
    `${API_BASE}/api/products/${productId}/related${toQueryString({ limit })}`,
    {
      headers: defaultHeaders,
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch related products (${response.status})`);
  }
  const payload: ProductListResponse = await response.json();
  return payload.products ?? [];
};
