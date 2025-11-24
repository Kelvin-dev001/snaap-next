"use client";
import { useEffect, useState } from "react";
import API from "@/utils/api"; // Adjust if needed

export interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  discountPrice?: number | null;
  thumbnail?: string;
  images?: string[];
  rating?: number;
  [key: string]: any;
}

export default function useProducts(search = "") {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getProducts(search ? { search } : {})
      .then(res => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search]);

  return { products, loading };
}