"use client";
import React, { useEffect, useState } from "react";
import {
  Box, Typography, Card, CardContent, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, IconButton, Tooltip, CircularProgress, Snackbar,
  Alert, TablePagination,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import API from "@/utils/api"; // <--- adjust if your API client lives elsewhere

const PAGE_SIZE = 10;

interface Review {
  _id: string;
  name: string;
  whatsapp?: string;
  product?: { name?: string } | string | null;
  rating: number;
  comment: string;
  createdAt: string;
  isApproved?: boolean;
}

const AdminReviewsTable: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error"; }>({ open: false, message: "", severity: "success" });
  const [page, setPage] = useState(0);

  const fetchReviews = async (pageNum = 0) => {
    setLoading(true);
    try {
      const res = await API.getAllReviews({ limit: PAGE_SIZE, skip: pageNum * PAGE_SIZE });
      setReviews(res.data.reviews || []);
      setTotalReviews(res.data.total || res.data.reviews?.length || 0);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "Failed to fetch reviews",
        severity: "error"
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews(page);
    // eslint-disable-next-line
  }, [page]);

  const handleApprove = async (reviewId: string) => {
    setActionLoading(reviewId);
    try {
      await API.approveReview(reviewId);
      setSnackbar({ open: true, message: "Review approved!", severity: "success" });
      fetchReviews(page);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "Failed to approve review",
        severity: "error"
      });
    }
    setActionLoading(null);
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    setActionLoading(reviewId);
    try {
      await API.deleteReview(reviewId);
      setSnackbar({ open: true, message: "Review deleted.", severity: "success" });
      if (reviews.length === 1 && page > 0) setPage(page - 1);
      else fetchReviews(page);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "Failed to delete review",
        severity: "error"
      });
    }
    setActionLoading(null);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Card sx={{ borderRadius: 2, mt: 4 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Customer Reviews (Moderation)
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
            <CircularProgress />
          </Box>
        ) : reviews.length === 0 ? (
          <Typography>No reviews found.</Typography>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>WhatsApp</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Comment</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review._id}>
                      <TableCell>{review.name}</TableCell>
                      <TableCell>{review.whatsapp || "-"}</TableCell>
                      <TableCell>
                        {typeof review.product === "object" ? review.product?.name : String(review.product).slice(0, 6) + "..."}
                      </TableCell>
                      <TableCell>{review.rating}</TableCell>
                      <TableCell style={{ maxWidth: 200, whiteSpace: "pre-line" }}>
                        {review.comment}
                      </TableCell>
                      <TableCell>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {review.isApproved ? (
                          <Typography color="success.main" fontWeight={600}>
                            Approved
                          </Typography>
                        ) : (
                          <Typography color="warning.main" fontWeight={600}>
                            Pending
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {!review.isApproved && (
                          <Tooltip title="Approve">
                            <span>
                              <IconButton
                                color="success"
                                disabled={actionLoading === review._id}
                                onClick={() => handleApprove(review._id)}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete">
                          <span>
                            <IconButton
                              color="error"
                              disabled={actionLoading === review._id}
                              onClick={() => handleDelete(review._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={totalReviews}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={PAGE_SIZE}
              rowsPerPageOptions={[PAGE_SIZE]}
            />
          </>
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default AdminReviewsTable;