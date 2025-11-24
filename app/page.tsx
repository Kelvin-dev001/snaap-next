"use client";
import React, { useState, useEffect } from "react";
import { Box, Container, CircularProgress, Typography } from "@mui/material";
import API from "../utils/apiService";

// Section Components
import HeroBannerSlider from "../components/HeroBannerSlider";
import ShopByBrandSection from "../components/ShopByBrandSection";
import ShopByCategorySection from "../components/ShopByCategorySection";
import FeaturedProductsSection from "../components/FeaturedProductsSection";
import NewArrivalsSection from "../components/NewArrivalsSection";
import PocketFriendlySection from "../components/PocketFriendlySection";
import DealsSection from "../components/DealsSection";
import ReviewsSection from "../components/ReviewsSection";
import WhyChooseUsSection from "../components/WhyChooseUsSection";
import WhatsAppCTASection from "../components/WhatsAppCTASection";

// Helper to shuffle an array
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Page() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          featuredRes,
          allProductsRes,
          categoriesRes,
          brandsRes,
          reviewsRes,
        ] = await Promise.all([
          API.getFeaturedProducts(),
          API.getProducts(),
          API.getCategories(),
          API.getBrands(),
          API.getRecentReviews(),
        ]);

        const randomFeatured = shuffle(featuredRes.data.products || []);
        const randomProducts = shuffle(allProductsRes.data.products || []);
        setFeaturedProducts(randomFeatured);
        setNewArrivals(randomProducts.slice(0, 48));
        setCategories(categoriesRes.data.categories || []);
        setBrands(brandsRes.data.brands || []);
        setRecentReviews(reviewsRes.data.reviews || []);
      } catch (err) {
        setError("Failed to load homepage. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <HeroBannerSlider />
      <ShopByBrandSection brands={brands} />
      <ShopByCategorySection categories={categories} />
      <FeaturedProductsSection products={featuredProducts} />
      <PocketFriendlySection />
      <DealsSection />
      <NewArrivalsSection products={newArrivals} title="Hot Selling Smartphones in Kenya" />
      <ReviewsSection reviews={recentReviews} isHomepage />
      <WhyChooseUsSection />
      <WhatsAppCTASection />
    </Box>
  );
}