"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Button from "@/components/Button";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { fetchMe } from "@/lib/store/slices/users";
import { fetchGroups } from "@/lib/store/slices/groups";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function JoinGroup() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [step, setStep] = useState("code");
  const [groupName, setGroupName] = useState("");
  const [code, setCode] = useState("");
  const [availableMembers, setAvailableMembers] = useState([]);
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizedCode = code.trim().toUpperCase();

  const lookup = async (codeToCheck) => {
    const response = await fetchWithAuth(
      `${NEXT_PUBLIC_API_URL}/join-group/${codeToCheck}/available-members`,
    );
    if (!response.ok) return { ok: false, status: response.status };
    const body = await response.json();
    return {
      ok: true,
      groupName: body.groupName,
      availableMembers: body.availableMembers || [],
    };
  };

  useEffect(() => {
    if (normalizedCode.length !== 8) {
      setGroupName("");
      return;
    }
    let cancelled = false;
    (async () => {
      const result = await lookup(normalizedCode);
      if (cancelled) return;
      if (result.ok) setGroupName(result.groupName);
      else setGroupName("");
    })();
    return () => {
      cancelled = true;
    };
  }, [normalizedCode]);

  const handleLookup = async () => {
    if (normalizedCode.length !== 8) {
      setError("Le code doit contenir 8 caractères.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await lookup(normalizedCode);
      if (!result.ok) {
        setError(
          result.status === 404
            ? "Aucun groupe ne correspond à ce code."
            : "Une erreur est survenue. Réessayez.",
        );
        return;
      }
      setAvailableMembers(result.availableMembers);
      setGroupName(result.groupName);
      setStep(result.availableMembers.length ? "members" : "nickname");
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const handleLink = async (memberId) => {
    setError("");
    setLoading(true);
    try {
      const response = await fetchWithAuth(
        `${NEXT_PUBLIC_API_URL}/join-group/${normalizedCode}/link-member/${memberId}`,
        { method: "PUT" },
      );
      if (!response.ok) {
        setError(
          response.status === 422
            ? "Ce membre vient d'être attribué à un autre compte."
            : "Une erreur est survenue. Réessayez.",
        );
        return;
      }
      await dispatch(fetchGroups());
      router.push("/groups");
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMember = async () => {
    if (!nickname.trim()) {
      setError("Veuillez entrer votre nom.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const meAction = await dispatch(fetchMe());
      const userId = meAction.payload?._id;
      const response = await fetchWithAuth(
        `${NEXT_PUBLIC_API_URL}/join-group/${normalizedCode}/create-member`,
        {
          method: "POST",
          body: JSON.stringify({
            member: { nickname: nickname.trim(), user: userId },
          }),
        },
      );
      if (!response.ok) {
        setError("Une erreur est survenue. Réessayez.");
        return;
      }
      await dispatch(fetchGroups());
      router.push("/groups");
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-700 rounded-xl shadow-md p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-6">
        {groupName
          ? `Rejoindre le groupe "${groupName}"`
          : "Rejoindre un groupe existant"}
      </h1>

      {step === "code" && (
        <>
          <label htmlFor="code" className="block">
            Code du groupe
          </label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ex. ABC123XY"
            className="uppercase appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
          />
          <p className="text-sm text-zinc-500 dark:text-zinc-300">
            Demandez le code à un membre du groupe pour le rejoindre.
          </p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button onClick={handleLookup} disabled={loading}>
            {loading ? "Vérification..." : "Continuer"}
          </Button>
        </>
      )}

      {step === "members" && (
        <>
          <h2 className="font-bold text-lg">Choisissez votre profil :</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-300">
            Plusieurs membres du groupe ne sont pas encore attribués. Choisissez
            celui qui vous correspond.
          </p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="space-y-4">
            {availableMembers.map((member) => (
              <Button
                key={member._id}
                onClick={() => handleLink(member._id)}
                disabled={loading}
              >
                {member.nickname}
              </Button>
            ))}
          </div>
          <Button
            onClick={() => setStep("nickname")}
            className="border-2 border-zinc-500 bg-opacity-0 text-zinc-500 hover:bg-zinc-100 active:bg-zinc-600 active:text-white"
          >
            Je ne suis pas dans la liste
          </Button>
          <Button
            onClick={() => {
              setStep("code");
              setGroupName("");
            }}
            className="bg-zinc-400 hover:bg-zinc-500 active:bg-zinc-600 mt-10"
          >
            Retour
          </Button>
        </>
      )}

      {step === "nickname" && (
        <>
          <h2 className="font-bold text-lg">Créez votre profil :</h2>
          <label htmlFor="nickname" className="block">
            Votre nom
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="John Doe"
            className="appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button onClick={handleCreateMember} disabled={loading}>
            {loading ? "Adhésion..." : "Rejoindre le groupe"}
          </Button>
          <Button
            onClick={() => {
              if (availableMembers.length) {
                setStep("members");
              } else {
                setStep("code");
                setGroupName("");
              }
            }}
            className="bg-zinc-400 hover:bg-zinc-500 active:bg-zinc-600"
          >
            Retour
          </Button>
        </>
      )}
    </div>
  );
}
