export type Product = {
  id: string;
  name: string;
  category: string;
  brand?: string;
  color?: string;
  price?: number;
  description?: string;
  image_path?: string;
  image_url?: string;
  image_url_local?: string;
  available?: boolean;
  similarity?: number;
  similarity_percentage?: number;
};

export type ProductSearchResponse = {
  query_id: string;
  results: Product[];
  total: number;
  timestamp: string;
};

export type ProductListResponse = {
  products: Product[];
  count: number;
  timestamp: string;
};

export type CategoryResponse = {
  categories: string[];
  total: number;
  timestamp: string;
};
