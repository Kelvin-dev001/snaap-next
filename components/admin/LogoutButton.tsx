"use client";
import React from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import API, { removeToken } from "@/utils/api";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await API.logout();
    } catch {}
    localStorage.removeItem("isAdmin");
    removeToken();
    router.push("/admin/login");
  };

  return (
    <Button
      variant="outlined"
      color="secondary"
      onClick={handleLogout}
      sx={{ borderRadius: 2, ml: 2 }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;