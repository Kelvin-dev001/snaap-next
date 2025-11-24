"use client";
import { useEffect, useState } from "react";
import API from "@/utils/api"; // Adjust the import if your apiService path is different

export interface Brand {
  _id?: string;
  name: string;
  logo?: string;
  [key: string]: any;
}

export default function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getBrands()
      .then(res => {
        // Support both {brands: []} and plain array
        if (Array.isArray(res.data)) setBrands(res.data);
        else if (Array.isArray(res.data?.brands)) setBrands(res.data.brands);
        else setBrands([]);
      })
      .catch(() => setBrands([]))
      .finally(() => setLoading(false));
  }, []);

  return { brands, loading };
}