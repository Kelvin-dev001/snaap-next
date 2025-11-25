"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import API from "@/utils/api";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, Avatar
} from "@mui/material";

type Category = {
  _id?: string;
  name?: string;
  description?: string;
  icon?: string;
};

interface CategoryFormProps {
  category?: Category | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSuccess, onCancel }) => {
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [icon, setIcon] = useState<string>(category?.icon || "");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleIconChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setIconFile(file || null);
    if (file) setIcon(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (iconFile) {
        formData.append("icon", iconFile);
      } else if (icon) {
        formData.append("icon", icon);
      }
      if (category && category._id) {
        await API.updateCategoryMultipart(category._id, formData);
      } else {
        await API.createCategoryMultipart(formData);
      }
      onSuccess();
    } catch (err: any) {
      alert("Error saving category: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <DialogContent>
          <Stack spacing={2}>
            <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth required autoFocus />
            <TextField label="Description" value={description} onChange={e => setDescription(e.target.value)} fullWidth multiline minRows={2} />
            <Stack direction="row" spacing={2} alignItems="center">
              <Button variant="outlined" component="label">
                Upload Icon
                <input type="file" accept="image/*" hidden onChange={handleIconChange} />
              </Button>
              {icon && <Avatar src={icon} sx={{ width: 48, height: 48 }} />}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="secondary" disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>{category ? "Update" : "Add"}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CategoryForm;