"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { redirectOnServerError, redirectOnNetworkError } from "@/utils/redirectOnServerError";
import { request } from "@/utils/fetchWithRetry";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ForgotPasswordForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError("L'email n'est pas valide");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await request(`${NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        if (redirectOnServerError(res)) return;
        setError("Une erreur est survenue, veuillez réessayer");
        return;
      }

      setSent(true);
    } catch {
      redirectOnNetworkError();
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="w-full flex flex-col gap-4 text-center">
        <p className="text-zinc-700 dark:text-zinc-200">
          Si un compte existe avec cet email, vous recevrez un lien de
          réinitialisation dans les prochaines minutes.
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Pensez à vérifier vos spams.
        </p>
        <Button
          className="w-auto mx-auto p-4"
          onClick={() => router.push("/auth/login")}
        >
          Retour à la connexion
        </Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="w-full max-w-sm flex flex-col gap-4"
    >
      <div>
        <label htmlFor="email">Email :</label>
        <input
          type="email"
          placeholder="contact@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="appearance-none w-full p-2 focus:border rounded-md
    bg-zinc-100 text-zinc-800 focus:outline-none
    focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <Button type="submit" loading={loading}>
        Envoyer le lien
      </Button>

      <button
        type="button"
        onClick={() => router.push("/auth/login")}
        className="text-sm text-purple-600 hover:underline dark:text-purple-400"
      >
        Retour à la connexion
      </button>
    </form>
  );
}
