"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroup } from "@/lib/store/slices/groups";
import Button from "../Button";

export default function GroupShare({ groupId }) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.groups.loading);
  const group = useSelector((state) =>
    state.groups.items?.find((group) => group._id === groupId),
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(group?.code);
    setCopied(true);
  };

  useEffect(() => {
    dispatch(fetchGroup(groupId));
  }, [dispatch, groupId]);

  if (loading && !group) return <div>Chargement...</div>;

  return (
    <div className="space-y-6 p-2 text-center">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          Groupe : {group?.name}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Partagez ce code avec vos amis pour qu'ils rejoignent le groupe.
        </p>
      </div>

      <div>
        <p className="mb-3 text-md font-bold text-zinc-700 ">Code du groupe</p>

        <div className="flex justify-center gap-2 ">
          {group?.code?.split("").map((char, index) => (
            <div
              key={index}
              className="flex h-14 w-12 items-center justify-center rounded-xl bg-zinc-100 text-xl font-bold uppercase text-zinc-900 "
            >
              {char}
            </div>
          ))}
        </div>

        <Button onClick={handleCopy} className="mt-7">
          Copier le code
        </Button>

        {copied && (
          <p className="mt-3 text-sm font-medium text-zinc-800">
            ✅ Le code a bien été copié
          </p>
        )}
      </div>
    </div>
  );
}
