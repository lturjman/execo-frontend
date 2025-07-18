"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

const BACKEND_URL = process.env.BACKEND_URL;

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");

  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    const isValid = validateUser({ username, email, password }, setErrors);
    if (!isValid) return;

    const res = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.msg || "Une erreur est survenue");
    }

    // Stocker le token
    localStorage.setItem("token", data.token);

    router.push("/groups");
  };
  return (
    <div>
      <form onSubmit={handleRegister} className=" w-full flex flex-col gap-4">
        <div>
          <label htmlFor="name">Nom d'utilisateur :</label>
          <input
            type="username"
            placeholder="JohnDoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="appearance-none w-full p-2 focus:border rounded-md
             bg-gray-100 text-gray-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        <div>
          <label htmlFor="name">Email :</label>
          <input
            type="email"
            placeholder="contact@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="appearance-none w-full p-2 focus:border rounded-md
             bg-gray-100 text-gray-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400"
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
             bg-gray-100 text-gray-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <Button type="submit">Créer un compte</Button>
      </form>
      <Button
        className="bg-gray-400 mt-10 w-70 mx-auto"
        onClick={() => router.push("/auth/login")}
      >
        Déjà un compte ?
      </Button>
    </div>
  );
}
