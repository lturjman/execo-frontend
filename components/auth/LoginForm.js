"use client";

import { useState } from "react";
import { validateUser } from "@/utils/validateUser";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const isValid = validateUser({ email, password }, setErrors);
    if (!isValid) return;

    const res = await fetch(`${NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.msg || "Une erreur est survenue");
    }

    // // Stocker le token
    localStorage.setItem("token", data.token);

    router.push("/groups");
  };

  return (
    <div>
      <form onSubmit={handleLogin} className=" w-full flex flex-col gap-4">
        <div>
          <label htmlFor="name">Email :</label>
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
          <label htmlFor="name">Mot de passe :</label>
          <input
            type="password"
            placeholder="************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="appearance-none w-full p-2 focus:border rounded-md
    bg-zinc-100 text-zinc-800 focus:outline-none
    focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
        <Button type="submit">Se connecter</Button>
      </form>

      <Button
        className="bg-zinc-400 mt-10 w-70 mx-auto"
        onClick={() => router.push("/auth/register")}
      >
        Pas encore de compte ?
      </Button>
    </div>
  );
}
