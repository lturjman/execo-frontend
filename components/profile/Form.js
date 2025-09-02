"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "@/lib/store/slices/users";

export default function ProfileForm() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.items[0]);
  const status = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);

  const [editableUser, setEditableUser] = useState(user || {});

  useEffect(() => {
    dispatch(fetchUser());
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm">
      <input
        type="text"
        value={editableUser.username}
        onChange={(e) =>
          setEditableUser({ ...editableUser, username: e.target.value })
        }
        // placeholder="Nom d'utilisateur"
        className="border rounded p-2"
      />
      <input
        type="email"
        value={editableUser.email}
        onChange={(e) =>
          setEditableUser({ ...editableUser, email: e.target.value })
        }
        // placeholder="Email"
        className="border rounded p-2"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-green-600 text-white p-2 rounded"
      >
        {status === "loading" ? "Mise à jour..." : "Mettre à jour"}
      </button>
      {/* {status === "succeeded" && (
        <p className="text-green-600">Profil mis à jour ✅</p>
      )} */}
    </form>
  );
}
