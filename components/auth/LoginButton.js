'use client'

import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoToLogin = () => {
    setLoading(true);
    router.push("/auth/login");
  };

  return (
    <Button
      onClick={handleGoToLogin}
      loading={loading}
      className="p-5 text-xl bg-zinc-800 hover:bg-zinc-700 dark:bg-white hover:dark:bg-zinc-100 dark:text-zinc-800"
    >
      {loading ? "Redirection..." : "Se connecter"}
    </Button>
  );
}
