"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearUsers } from "@/lib/store/slices/users";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LogoutForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const error = "Une erreur est survenue lors de la déconnexion";

  const handleLogout = async (e) => {
    dispatch(clearUsers());
    e.preventDefault();

    const res = await fetch(`${NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      error;
      return;
    }

    localStorage.removeItem("token");

    router.push("/auth/login");
  };

  return (
    <div>
      <Button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-400 text-white rounded-full hover:bg-red-500 active:bg-red-600"
      >
        Déconnexion
      </Button>
    </div>
  );
}
