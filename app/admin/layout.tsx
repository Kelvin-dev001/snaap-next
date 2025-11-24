"use client";
import React from "react";
import { Box, CssBaseline } from "@mui/material";
import AdminHeader from "../../components/AdminHeader";
import Sidebar from "../../components/Sidebar";
import { DRAWER_WIDTH } from "../../constants/layout";

// Next.js app router provides { children } automatically to layout files
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((open) => !open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AdminHeader onDrawerToggle={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          marginTop: "64px", // Make sure this matches your header height
        }}
      >
        {children}
      </Box>
    </Box>
  );
}