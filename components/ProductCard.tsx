import React from "react";
import {
  Card, CardMedia, CardContent, Typography, Box, Button,
  Stack, Chip, IconButton, Rating
} from "@mui/material";
import { Favorite, FavoriteBorder, WhatsApp, Star } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
import { getOptimizedCloudinaryUrl } from "../utils/cloudinaryUrl";

type Product = {
  _id: string;
  name: string;
  brand: string;
  price: number;
  discountPrice?: number;
  model?: string;
  rating?: number;
  thumbnail?: string;
  images?: string[];
  specs?: { storage?: string; ram?: string };
};

type ProductCardProps = {
  product: Product;
  onWishlistToggle?: (productId: string) => void;
  isWishlisted?: boolean;
  showWhatsApp?: boolean;
  showViewBtn?: boolean;
  badge?: "HOT" | "NEW" | "TRENDING" | "SALE" | string;
  sx?: object;
  [key: string]: any;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(price);

const BADGE_COLOR: Record<string, "error" | "success" | "info" | "warning"> = {
  HOT: "error",
  NEW: "success",
  TRENDING: "info",
  SALE: "warning",
};

const WHATSAPP_NUMBER = "254711111602";

const CARD_IMAGE_WIDTH = 400;
const CARD_IMAGE_HEIGHT = 300;

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onWishlistToggle,
  isWishlisted,
  showWhatsApp = true,
  showViewBtn = true,
  badge,
  sx = {},
  ...props
}) => {
  // For navigation use Next.js router (fallback: window.location)
  const discountPercent =
    product.discountPrice && product.price
      ? Math.round(100 - (product.discountPrice / product.price) * 100)
      : null;

  const cloudUrl =
    product.thumbnail ||
    (Array.isArray(product.images) && product.images.length > 0 && product.images[0]);
  const imgUrl = getOptimizedCloudinaryUrl(cloudUrl, { width: CARD_IMAGE_WIDTH });

  const message = `Hello, am interested in buying (${product.name}${product.model ? ", " + product.model : ""}, KES ${product.discountPrice || product.price})`;

  const onCardClick = () => {
    window.location.href = `/products/${product._id}`;
  };

  return (
    <Card
      sx={{
        borderRadius: "20px",
        background: "#fff",
        color: "primary.main",
        boxShadow: "0 4px 24px 0 rgba(30,60,114,0.08)",
        transition: "transform 0.25s cubic-bezier(.4,2,.4,1), box-shadow 0.25s",
        cursor: "pointer",
        position: "relative",
        overflow: "visible",
        border: "none",
        minHeight: 350,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        ...sx,
      }}
      elevation={0}
      {...props}
      onClick={onCardClick}
    >
      <Box sx={{ position: "relative", pt: 2, px: 2 }}>
        <CardMedia
          component="img"
          src={imgUrl}
          alt={product.name}
          loading="lazy"
          width={CARD_IMAGE_WIDTH}
          height={CARD_IMAGE_HEIGHT}
          sx={{
            objectFit: "contain",
            mx: "auto",
            maxHeight: CARD_IMAGE_HEIGHT,
            minHeight: CARD_IMAGE_HEIGHT,
            maxWidth: CARD_IMAGE_WIDTH,
            minWidth: CARD_IMAGE_WIDTH,
            borderRadius: "16px",
            background: "#f7f8fa",
          }}
        />
        {badge && (
          <Chip
            label={badge}
            color={BADGE_COLOR[badge.toUpperCase()] || "info"}
            size="small"
            sx={{ position: "absolute", top: 14, left: 14, fontWeight: 700, zIndex: 2 }}
          />
        )}
        {discountPercent && (
          <Chip
            label={`-${discountPercent}%`}
            color="error"
            size="small"
            sx={{ position: "absolute", top: 14, right: 14, fontWeight: 700, zIndex: 2 }}
          />
        )}
        <IconButton
          aria-label="add to wishlist"
          size="small"
          sx={{
            position: "absolute",
            bottom: 8,
            right: 14,
            bgcolor: "#fff",
            borderRadius: "50%",
            zIndex: 2,
            boxShadow: "0 2px 8px #2221",
            "&:hover": { bgcolor: "primary.light" },
          }}
          onClick={e => {
            e.stopPropagation();
            if (onWishlistToggle) onWishlistToggle(product._id);
          }}
        >
          {isWishlisted ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {product.brand}
        </Typography>
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: "#1e3c72" }}>
          {product.name}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Rating
            value={product.rating || 4.5}
            precision={0.1}
            readOnly
            size="small"
            icon={<Star fontSize="inherit" htmlColor="#6dd5ed" />}
            emptyIcon={<Star fontSize="inherit" htmlColor="#e0e0e0" />}
          />
          <Typography variant="body2" sx={{ ml: 0.5 }}>
            {(product.rating?.toFixed(1)) || "4.5"}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" color="primary" fontWeight={700}>
            {formatPrice(product.discountPrice || product.price)}
          </Typography>
          {product.discountPrice && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: "line-through" }}
            >
              {formatPrice(product.price)}
            </Typography>
          )}
        </Stack>
        {(product.specs?.storage || product.specs?.ram) ? (
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            {product.specs?.storage && (
              <Chip label={`Storage: ${product.specs.storage}`} size="small" variant="outlined" />
            )}
            {product.specs?.ram && (
              <Chip label={`RAM: ${product.specs.ram}`} size="small" variant="outlined" />
            )}
          </Stack>
        ) : null}
      </CardContent>
      <Box sx={{ px: 2, pb: 2, pt: 0 }}>
        {showWhatsApp && (
          <Button
            variant="contained"
            fullWidth
            startIcon={<WhatsApp />}
            sx={{
              borderRadius: "50px",
              fontWeight: 600,
              textTransform: "none",
              bgcolor: "success.main",
              "&:hover": { bgcolor: "success.dark" },
              mb: 1,
            }}
            onClick={e => {
              e.stopPropagation();
              window.open(
                `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
                "_blank"
              );
            }}
          >
            Buy on WhatsApp
          </Button>
        )}
        {showViewBtn && (
          <Button
            variant="outlined"
            fullWidth
            sx={{
              borderRadius: "50px",
              fontWeight: 700,
              color: "primary.main",
              borderColor: "#6dd5ed",
              textTransform: "none",
              fontSize: "1.07rem",
              transition: "all 0.19s cubic-bezier(.4,2,.4,1)",
              "&:hover": {
                background: "linear-gradient(96deg,#6dd5ed 10%,#1e3c72 90%)",
                color: "#fff",
                borderColor: "transparent",
                boxShadow: "0 2px 24px #1e3c72cc",
                transform: "scale(1.06)",
              },
            }}
            onClick={e => {
              e.stopPropagation();
              window.location.href = `/products/${product._id}`;
            }}
          >
            View
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default ProductCard;