"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/auth/register", {
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
        </div>

        <Button type="submit">Créer un compte</Button>
      </form>
      <Button
        className="bg-gray-400 mt-10 w-70"
        onClick={() => router.push("/auth/login")}
      >
        Déjà un compte ?
      </Button>
    </div>
  );
}
