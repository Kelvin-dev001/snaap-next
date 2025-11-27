"use client";
import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem,
  FormControl, InputLabel, Chip, useTheme, useMediaQuery,
  CircularProgress, FormControlLabel, Checkbox, Tooltip,
  TablePagination, Snackbar
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import {
  Add, Edit, Delete, Search, Clear,
  Visibility, Category, Inventory
} from "@mui/icons-material";
import ErrorAlert from "../../../components/ErrorAlert";
import API from "@/utils/api";

const MAX_IMAGES = 10;

const emptyProduct = {
  name: "",
  price: 0,
  discountPrice: "",
  currency: "KES",
  isOnSale: false,
  brand: "",
  model: "",
  category: "",
  stockQuantity: 0,
  inStock: true,
  sku: "",
  dealType: "",
  specs: {
    storage: "",
    ram: "",
    screenSize: "",
    camera: "",
    battery: "",
    processor: "",
    os: "",
    material: "",
    wattage: "",
    connectivity: "",
  },
  accessoryType: "",
  compatibleWith: [],
  images: [],
  thumbnail: "",
  videoUrl: "",
  shortDescription: "",
  fullDescription: "",
  keyFeatures: [],
  tags: [],
  relatedProducts: [],
  isFeatured: false,
  isNewRelease: false,
  releaseDate: "",
  warrantyPeriod: "",
  returnPolicyDays: 30,
  isActive: true,
};

export default function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [imagePreviews, setImagePreviews] = useState<any[]>([]);
  const [initialPreviews, setInitialPreviews] = useState<any[]>([]);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes, brandsRes] = await Promise.all([
          API.getProducts({
            page: page + 1,
            limit: rowsPerPage,
            search: searchTerm
          }),
          API.getCategories(),
          API.getBrands()
        ]);
        setProducts(productsRes.data.products || productsRes.data || []);
        setTotalProducts(productsRes.data.count || productsRes.data?.length || 0);
        setCategories(categoriesRes.data.categories || categoriesRes.data || []);
        setBrands(brandsRes.data.brands || brandsRes.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, rowsPerPage, searchTerm]);

  const handleOpenDialog = (product: any = null) => {
    setCurrentProduct(product ? {
      ...emptyProduct,
      ...product,
      specs: { ...emptyProduct.specs, ...(product.specs || {}) },
      keyFeatures: product.keyFeatures || [],
      tags: product.tags || [],
      compatibleWith: product.compatibleWith || [],
      relatedProducts: product.relatedProducts || [],
    } : { ...emptyProduct });
    setSelectedImages([]);
    setImagePreviews([]);
    if (product && product.images && product.images.length > 0) {
      setInitialPreviews(product.images);
    } else {
      setInitialPreviews([]);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentProduct(null);
    setSelectedImages([]);
    setImagePreviews([]);
    setInitialPreviews([]);
  };

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setCurrentProduct((prev: any) => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setCurrentProduct((prev: any) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSpecChange = (e: any) => {
    const { name, value } = e.target;
    setCurrentProduct((prev: any) => ({
      ...prev,
      specs: {
        ...prev.specs,
        [name]: value
      }
    }));
  };

  const handleArrayFieldChange = (name: string, value: string) => {
    setCurrentProduct((prev: any) => ({
      ...prev,
      [name]: value.split(",").map((v: string) => v.trim()).filter((v: string) => v)
    }));
  };

  const handleImagesChange = (e: any) => {
    const files = Array.from(e.target.files || []);
    if (selectedImages.length + initialPreviews.length + files.length > MAX_IMAGES) {
      alert(`You can upload up to ${MAX_IMAGES} images per product.`);
      return;
    }
    setSelectedImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...files.map((file: any) => URL.createObjectURL(file))]);
  };

  const handleRemoveImage = (idx: number) => {
    setSelectedImages((prev) => prev.filter((_: any, i: number) => i !== idx));
    setImagePreviews((prev) => prev.filter((_: any, i: number) => i !== idx));
  };

  const handleRemoveInitialImage = (idx: number) => {
    setInitialPreviews((prev) => prev.filter((_: any, i: number) => i !== idx));
  };

  const collectFormData = () => {
    const formData = new FormData();
    formData.append("name", currentProduct.name);
    formData.append("price", currentProduct.price);
    if (currentProduct.discountPrice) formData.append("discountPrice", currentProduct.discountPrice);
    formData.append("currency", currentProduct.currency || "KES");
    formData.append("isOnSale", currentProduct.isOnSale);
    formData.append("brand", currentProduct.brand);
    formData.append("model", currentProduct.model || "");
    formData.append("category", currentProduct.category);
    formData.append("sku", currentProduct.sku || "");
    formData.append("stockQuantity", currentProduct.stockQuantity || 0);
    formData.append("inStock", currentProduct.inStock);
    formData.append("accessoryType", currentProduct.accessoryType || "");
    formData.append("thumbnail", currentProduct.thumbnail || "");
    formData.append("videoUrl", currentProduct.videoUrl || "");
    formData.append("shortDescription", currentProduct.shortDescription || "");
    formData.append("fullDescription", currentProduct.fullDescription || "");
    formData.append("isFeatured", currentProduct.isFeatured);
    formData.append("isNewRelease", currentProduct.isNewRelease);
    if (currentProduct.releaseDate) formData.append("releaseDate", currentProduct.releaseDate);
    if (currentProduct.warrantyPeriod) formData.append("warrantyPeriod", currentProduct.warrantyPeriod);
    if (currentProduct.returnPolicyDays) formData.append("returnPolicyDays", currentProduct.returnPolicyDays);
    formData.append("dealType", currentProduct.dealType || "");

    if (currentProduct.keyFeatures && currentProduct.keyFeatures.length > 0)
      currentProduct.keyFeatures.forEach((k: any) => formData.append("keyFeatures[]", k));
    if (currentProduct.tags && currentProduct.tags.length > 0)
      currentProduct.tags.forEach((t: any) => formData.append("tags[]", t));
    if (currentProduct.compatibleWith && currentProduct.compatibleWith.length > 0)
      currentProduct.compatibleWith.forEach((c: any) => formData.append("compatibleWith[]", c));
    if (currentProduct.relatedProducts && currentProduct.relatedProducts.length > 0)
      currentProduct.relatedProducts.forEach((r: any) => formData.append("relatedProducts[]", r));

    if (currentProduct.specs) {
      Object.entries(currentProduct.specs).forEach(([key, val]) => {
        if (val !== undefined && val !== null && typeof val !== 'object') {
          formData.append(`specs[${key}]`, String(val));
        }
      });
    }

    if (currentProduct._id && initialPreviews.length > 0) {
      initialPreviews.forEach((imgUrl: string) => {
        formData.append("existingImages[]", imgUrl);
      });
    }

    selectedImages.forEach((img: File) => {
      formData.append("images", img);
    });

    return formData;
  };

  const handleSaveProduct = async () => {
    if (!currentProduct.name || !currentProduct.price || !currentProduct.brand || !currentProduct.category) {
      setError("Please fill in all required fields (name, price, brand, category).");
      return;
    }
    try {
      setLoading(true);
      const formData = collectFormData();
      if (currentProduct._id) {
        await API.updateProduct(currentProduct._id, formData);
        setSuccessMsg("Product updated successfully!");
      } else {
        await API.createProduct(formData);
        setSuccessMsg("Product created successfully!");
      }
      const res = await API.getProducts({
        page: page + 1,
        limit: rowsPerPage
      });
      setProducts(res.data.products || res.data || []);
      setTotalProducts(res.data.count || res.data?.length || 0);
      handleCloseDialog();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      setLoading(true);
      await API.deleteProduct(id);
      const res = await API.getProducts({
        page: page + 1,
        limit: rowsPerPage
      });
      setProducts(res.data.products || res.data || []);
      setTotalProducts(res.data.count || res.data?.length || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_: any, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setPage(0);
  };

  const handleSuccessClose = () => setSuccessMsg("");

  if (loading && products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <ErrorAlert error={error} onClose={() => setError(null)} />;
  }

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Snackbar
        open={!!successMsg}
        autoHideDuration={3000}
        onClose={handleSuccessClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert onClose={handleSuccessClose} severity="success" sx={{ width: "100%" }}>
          {successMsg}
        </MuiAlert>
      </Snackbar>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Products Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: "50px" }}
        >
          Add Product
        </Button>
      </Box>
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (<Search sx={{ color: "action.active", mr: 1 }} />),
                endAdornment: searchTerm &&
                  (<IconButton onClick={clearSearch}><Clear fontSize="small" /></IconButton>)
              }}
            />
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{
                  backgroundColor: theme.palette.grey[100],
                  "& th": { fontWeight: 600 }
                }}>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{
                          width: 40, height: 40, borderRadius: 1,
                          overflow: "hidden", mr: 2, bgcolor: "grey.200",
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <Inventory color="disabled" fontSize="small" />
                          )}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {product.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={product.category} size="small" icon={<Category fontSize="small" />} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{product.brand}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {product.currency || "KES"} {product.price.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Inventory fontSize="small" color="action" />
                        <Typography variant="body2">{product.stockQuantity}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.inStock ? "In Stock" : "Out of Stock"}
                        color={product.inStock ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="View">
                          <IconButton size="small" color="info">
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog(product)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100, 250, 1000]}
            component="div"
            count={totalProducts}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
      {/* Add/Edit Product Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {currentProduct?._id ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* ...same dialog form code as in previous context... */}
            {/* For brevity, re-use your CRUD dialog implementation from above. */}
            {/* You can keep this dialog code exactly as in your original Products.js */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ borderRadius: "50px" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveProduct}
            variant="contained"
            disabled={loading}
            sx={{ borderRadius: "50px" }}
          >
            {loading ? <CircularProgress size={24} /> : "Save Product"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}