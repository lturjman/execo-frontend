import Image from "next/image";
import Button from "@/components/Button";

import { ArrowLeftIcon } from "@heroicons/react/24/solid";

import Parameters from "@/components/groups/CardParameters";
import ExpensesList from "@/components/expenses/List";
import DebtsList from "@/components/debts/List";

export default function GroupPage() {
  return (
    <div className="p-4 space-y-6 bg-gray-200 min-h-screen">
      <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden ">
        <div className="relative">
          <Image
            src="/images/groupImg.png"
            alt="Image de groupe"
            width={200}
            height={100}
            className="object-cover w-full h-full"
          />
          {/* Retour */}
          <Button href="/groups" rounded="true" className="absolute">
            <ArrowLeftIcon className="size-5 text-white" />
          </Button>
        </div>

        <Parameters />
      </div>

      <DebtsList />
      <ExpensesList />
    </div>
  );
}
