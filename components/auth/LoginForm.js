"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      newErrors.email = "L'email n'est pas valide";
      valid = false;
    }
    if (!password) {
      newErrors.password = "Le mot de passe n'est pas valide";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch(`${NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({
          email: "L'email n'est pas valide",
          password: "Le mot de passe n'est pas valide",
        });
        return;
      }

      localStorage.setItem("token", data.token);

      router.push("/groups");
    } catch {
      setErrors({
        email: "Une erreur est survenue, veuillez réessayer",
        password: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        noValidate
        onSubmit={handleLogin}
        className="w-full flex flex-col gap-4"
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
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password">Mot de passe :</label>
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
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
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

        <Button type="submit" loading={loading}>
          Se connecter
        </Button>
      </form>

      <Button
        className="bg-zinc-400 hover:bg-zinc-500 active:bg-zinc-600 mt-10 w-70 mx-auto"
        onClick={() => router.push("/auth/register")}
      >
        Pas encore de compte ?
      </Button>
    </div>
  );
}
