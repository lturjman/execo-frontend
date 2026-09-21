"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RedirectOnToken() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    fetch(`${NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        router.replace(res.ok ? "/groups" : "/auth/login");
      })
      .catch(() => router.replace("/auth/login"));
  }, [router]);

  return null;
}