"use client";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useParams } from "next/navigation";

import { fetchPaybacks } from "@/lib/store/slices/paybacks";

export default function debtsList() {
  const params = useParams();
  const id = params.id;

  const paybacks = useSelector((state) => state.paybacks.items);
  const paybacksLoading = useSelector((state) => state.paybacks.loading);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPaybacks({ groupId: id }));
  }, [dispatch, id]);

  return (
    <div>
      <section className="space-y-2">
        {paybacksLoading ? (
          <div className="text-center text-gray-500 italic">
            Chargement des remboursements…
          </div>
        ) : paybacks.length === 0 ? (
          <div className="text-center text-gray-500 italic">
            Aucun remboursement
          </div>
        ) : (
          paybacks.map((payback, index) => (
            <div
              key={index}
              className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-4 flex justify-center space-x-2"
            >
              <span className="font-semibold">{payback.from.name}</span>
              <span>doit</span>
              <span className="font-semibold">
                {(payback.amount / 100).toFixed(2)}€
              </span>
              <span>à</span>
              <span className="font-semibold">{payback.to.name}</span>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
