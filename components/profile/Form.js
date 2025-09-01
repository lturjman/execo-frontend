"use client";
import { useState } from "react";

export default function ProfileForm({ user }) {
  // const [email, setEmail] = useState(user.email);
  // const [username, setUsername] = useState(user.username);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {/* <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={username} onChange={(e) => setUsername(e.target.value)} /> */}
      <button type="submit">Mettre à jour</button>
    </form>
  );
}
