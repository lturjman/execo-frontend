"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { redirectOnServerError, redirectOnNetworkError } from "@/utils/redirectOnServerError";
import { request } from "@/utils/fetchWithRetry";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ password: "", confirm: "", token: "" });
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="w-full flex flex-col gap-4 text-center">
        <p className="text-red-500">
          Lien invalide. Veuillez refaire une demande.
        </p>
        <Button onClick={() => router.push("/auth/forgot-password")}>
          Demander un nouveau lien
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = { password: "", confirm: "", token: "" };
    let valid = true;

    if (!password || password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
      valid = false;
    }
    if (password !== confirm) {
      newErrors.confirm = "Les mots de passe ne correspondent pas";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    setLoading(true);

    try {
      const res = await request(`${NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (redirectOnServerError(res)) return;
        setErrors({
          password: "",
          confirm: "",
          token: data?.msg || "Une erreur est survenue",
        });
        return;
      }

      router.push("/auth/login");
    } catch {
      redirectOnNetworkError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="w-full max-w-sm flex flex-col gap-4"
    >
      {errors.token && (
        <p className="text-red-500 text-sm text-center">{errors.token}</p>
      )}

      <div>
        <label htmlFor="password">Nouveau mot de passe :</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="appearance-none w-full p-2 pr-10 focus:border rounded-md
    bg-zinc-100 text-zinc-800 focus:outline-none
    focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
          />
          <button
            type="button"
            aria-label={
              showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
            }
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center pr-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            {showPassword ? (
              <EyeSlashIcon className="size-5" />
            ) : (
              <EyeIcon className="size-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirm">Confirmer le mot de passe :</label>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="************"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="appearance-none w-full p-2 focus:border rounded-md
    bg-zinc-100 text-zinc-800 focus:outline-none
    focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
        />
        {errors.confirm && (
          <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>
        )}
      </div>

      <Button type="submit" loading={loading}>
        Réinitialiser le mot de passe
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
