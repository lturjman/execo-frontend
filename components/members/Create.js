"use client";
import { useDispatch } from "react-redux";
import { createMember } from "@/lib/store/slices/members";
import { NumericFormat } from "react-number-format";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { validateMember } from "../../utils/validateMember";

export default function CreateMember({ onMemberCreated, onClose, groupId }) {
  const router = useRouter();

  const dispatch = useDispatch();

  const [member, setMember] = useState({
    name: "",
    monthlyRevenue: null,
    monthlyCharges: null,
    share: 0,
  });

  const [errors, setErrors] = useState({});

  const handleCreateMember = async () => {
    if (validateMember(member, setErrors)) {
      const action = await dispatch(createMember({ groupId, member }));

      if (createMember.fulfilled.match(action)) {
        if (onMemberCreated) onMemberCreated();
      }
    }
  };
  return (
    <div className=" space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="block font-bold text-xl"> Nouveau membre :</h2>
      </div>
      <label htmlFor="name">Nom du membre</label>
      <input
        type="text"
        name="name"
        className="appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
        placeholder="John Doe"
        onChange={(e) => setMember({ ...member, name: e.target.value })}
      />
      {errors.name && (
        <p className="text-red-500 text-sm mb-2">{errors.name}</p>
      )}

      <label htmlFor="monthlyRevenue">Revenus mensuels</label>
      <NumericFormat
        value={member?.monthlyRevenue}
        decimalScale={2}
        decimalSeparator=","
        allowedDecimalSeparators={[".", ","]}
        thousandSeparator=" "
        fixedDecimalScale
        suffix=" €"
        inputMode="decimal"
        placeholder="0,00 €"
        allowNegative={false}
        onValueChange={(values) =>
          setMember({ ...member, monthlyRevenue: values.floatValue ?? null })
        }
        className="appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
        name="monthlyRevenue"
      />
      {errors.monthlyRevenue && (
        <p className="text-red-500 text-sm mb-2">{errors.monthlyRevenue}</p>
      )}

      <label htmlFor="monthlyCharges">Charges personnelles fixes</label>
      <NumericFormat
        value={member?.monthlyCharges}
        decimalScale={2}
        decimalSeparator=","
        allowedDecimalSeparators={[".", ","]}
        thousandSeparator=" "
        fixedDecimalScale
        suffix=" €"
        inputMode="decimal"
        placeholder="0,00 €"
        allowNegative={false}
        onValueChange={(values) =>
          setMember({ ...member, monthlyCharges: values.floatValue ?? null })
        }
        className="appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
        name="monthlyCharges"
      />
      {errors.monthlyCharges && (
        <p className="text-red-500 text-sm mb-2">{errors.monthlyCharges}</p>
      )}

      <Button onClick={handleCreateMember} className="mt-4">
        Ajouter au groupe
      </Button>
      <Button
        onClick={onClose}
        className="bg-zinc-400 hover:bg-zinc-500 active:bg-zinc-600"
      >
        Annuler
      </Button>
    </div>
  );
}
