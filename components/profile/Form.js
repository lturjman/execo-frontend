"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "@/lib/store/slices/users";
import Button from "../Button";

export default function ProfileForm() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.me);
  const status = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);

  const [editableUser, setEditableUser] = useState(user || {});

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (user) setEditableUser(user);
  }, [user]);

  if (status === "loading" && !user) return <p>Chargement...</p>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!editableUser.id) return;
    dispatch(updateUser({ id: editableUser.id, userData: editableUser }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        value={editableUser.username}
        onChange={(e) =>
          setEditableUser({ ...editableUser, username: e.target.value })
        }
        // placeholder="Nom d'utilisateur"
        className="appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
      />
      <input
        type="email"
        value={editableUser.email}
        onChange={(e) =>
          setEditableUser({ ...editableUser, email: e.target.value })
        }
        // placeholder="Email"
        className="appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
      />
      <Button
        type="submit"
        disabled={status === "loading"}
        className="px-4 py-2 rounded-full hover:bg-purple-500"
      >
        {status === "loading" ? "Mise à jour..." : "Mettre à jour"}
      </Button>
    </form>
  );
}
