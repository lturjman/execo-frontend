"use client";

import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoToRegister = () => {
    setLoading(true);
    router.push("/auth/register");
  };

  return (
    <Button
      onClick={handleGoToRegister}
      loading={loading}
      className="p-5 text-xl text-zinc-800 bg-white hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white"
    >
      {loading ? "Redirection..." : "Créer un compte"}
    </Button>
  );
}
