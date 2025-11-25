"use client";
import React, { useEffect, useState } from "react";
import API from "@/utils/api";
import {
  Box, Paper, Typography, Button, List, ListItem, ListItemText, IconButton, Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CategoryForm from "./CategoryForm";

type Category = {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
};

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await API.getCategories();
    setCategories(Array.isArray(res.data) ? res.data : (res.data?.categories || []));
  };

  const handleEdit = (category: Category) => {
    setEditCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await API.deleteCategory(id);
    fetchCategories();
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={700}>
            Categories
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditCategory(null);
              setShowForm(true);
            }}
          >
            Add Category
          </Button>
        </Stack>
        {showForm && (
          <CategoryForm
            category={editCategory}
            onSuccess={() => {
              fetchCategories();
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        )}
        <List>
          {categories.map((cat) => (
            <ListItem
              key={cat._id}
              secondaryAction={
                <Stack direction="row" spacing={1}>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(cat)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" color="error" onClick={() => handleDelete(cat._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              }
              sx={{
                mb: 1,
                border: "1px solid #eee",
                borderRadius: 1,
                bgcolor: "#fafafa",
              }}
            >
              <ListItemText
                primary={cat.name}
                secondary={cat.description}
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default CategoryList;