"use client";
import { useEffect, useState } from "react";
import API from "@/utils/api"; // Adjust if paths differ

export interface Category {
  _id?: string;
  name: string;
  icon?: string;
  image?: string;
  [key: string]: any;
}

export default function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getCategories()
      .then(res => {
        if (Array.isArray(res.data)) setCategories(res.data);
        else if (Array.isArray(res.data?.categories)) setCategories(res.data.categories);
        else setCategories([]);
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}