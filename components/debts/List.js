"use client";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";

import { fetchPaybacks } from "@/lib/store/slices/paybacks";
import { amountToCurrency } from "@/utils/amountToCurrency";
import Button from "@/components/Button";
import RefundModal from "@/components/debts/RefundModal";

export default function DebtsList() {
  const params = useParams();
  const id = params.groupId;

  const expenses = useSelector((state) => state.expenses.items);
  const paybacks = useSelector((state) => state.paybacks.items);
  const paybacksLoading = useSelector((state) => state.paybacks.loading);

  const dispatch = useDispatch();

  const [selectedPayback, setSelectedPayback] = useState(null);

  useEffect(() => {
    dispatch(fetchPaybacks({ groupId: id }));
  }, [dispatch, id, expenses]);

  return (
    <div>
      <section className="space-y-2">
        {paybacksLoading ? (
          <div className="text-center text-zinc-500 italic">
            Chargement des remboursements…
          </div>
        ) : paybacks.length === 0 ? (
          <div className="text-center text-zinc-500 italic dark:text-zinc-400">
            Aucun remboursement
          </div>
        ) : (
          paybacks.map((payback, index) => (
            <div
              key={index}
              className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-4 flex flex-wrap items-center justify-between gap-2 dark:bg-zinc-800"
            >
              <div className="flex flex-1 flex-wrap items-center justify-center space-x-2">
                <span className="font-semibold">{payback.from.name}</span>
                <span>doit</span>
                <span className="font-semibold">
                  {amountToCurrency(payback.amount)}
                </span>
                <span>à</span>
                <span className="font-semibold">{payback.to.name}</span>
              </div>

              <Button
                rounded="true"
                onClick={() => setSelectedPayback(payback)}
              >
                <ArrowsRightLeftIcon className="size-5 text-white" />
              </Button>
            </div>
          ))
        )}
      </section>

      <RefundModal
        groupId={id}
        payback={selectedPayback}
        open={Boolean(selectedPayback)}
        onClose={() => setSelectedPayback(null)}
      />
    </div>
  );
}
