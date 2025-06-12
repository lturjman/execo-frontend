"use client";

import Image from "next/image";
import CreateGroup from "@/components/CreateGroup";
import GroupCard from "@/components/GroupCard";
import { useEffect, useState } from "react";

export default function Home() {
  const [groups, setGroups] = useState([]);

  const fetchGroups = () => {
    fetch(`http://localhost:3000/groups`)
      .then((response) => response.json())
      .then((response) => {
        setGroups(response.data);
      });
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      {/* Logo Execo */}
      <div className="mb-4">
        <Image
          src="/images/execoLogo01.png"
          alt="Logo Execo"
          width={100}
          height={50}
        />
      </div>

      {/* Message de bienvenue */}
      <h1 className="text-xl font-bold mb-6">Hello, User !</h1>

      <div className="grid grid-cols-2 gap-4 ">
        {groups.map((group) => (
          <GroupCard key={group._id} group={group} />
        ))}
      </div>

      <CreateGroup onGroupCreated={fetchGroups}></CreateGroup>

      {/* Bouton flottant */}
      <div className="fixed bottom-6 right-6">
        <button className="w-16 h-16 rounded-full bg-purple-400 text-white flex items-center justify-center text-2xl">
          +
        </button>
      </div>
    </div>
  );
}
