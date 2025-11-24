"use client";
import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, Grid,
  TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider,
  useTheme, useMediaQuery, CircularProgress,
  Tooltip, TablePagination, Select, MenuItem, InputLabel, FormControl
} from "@mui/material";
import {
  Search, Clear, Visibility, LocalShipping,
  CheckCircle, Cancel, AccessTime
} from "@mui/icons-material";
import ErrorAlert from "../../../components/ErrorAlert";
// import API from "../../../utils/apiService"; // Uncomment for real API
// import { format } from "date-fns";            // Uncomment for real formatting

export default function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    // Replace with actual data fetching logic.
    setLoading(false);
  }, [page, rowsPerPage, searchTerm, statusFilter]);

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // API call to update, then refresh state...
  };
  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (e: any) => {
    setRowsPerPage(parseInt(e.target.value, 10));
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
  const formatPrice = (price: number) => new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES"
  }).format(price);

  if (loading && orders.length === 0) {
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
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 600 }}>
        Orders Management
      </Typography>
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (<Search sx={{ color: "action.active", mr: 1 }} />),
                endAdornment: searchTerm &&
                  (<IconButton onClick={clearSearch}><Clear fontSize="small" /></IconButton>)
              }}
            />
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>
      {/* Orders Table (use your actual data here) */}
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{
                  backgroundColor: theme.palette.grey[100],
                  "& th": { fontWeight: 600 }
                }}>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Example/empty row */}
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No orders found.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalOrders}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
      {/* Example Dialog logic omitted for brevity */}
    </Box>
  );
}