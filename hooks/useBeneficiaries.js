import { useEffect, useRef, useState } from "react";
import { Decimal } from "decimal.js";
import { rescaleTo100, rescaleOthers } from "@/utils/expenseFormHelpers";

export function useBeneficiaries(members, expense) {
  const [percentages, setPercentages] = useState({});
  const [checkedIds, setCheckedIds] = useState(() =>
    Array.isArray(members) && members.length > 0
      ? members.map((m) => m._id)
      : [],
  );
  const allWereUncheckedRef = useRef(false);

  useEffect(() => {
    if (members.length === 0) return;
    const totalShare = members.reduce((sum, m) => sum + (m.share || 0), 0);

    const pcts = {};
    members.forEach((m) => {
      pcts[m._id] =
        totalShare > 0
          ? new Decimal(m.share || 0).div(totalShare).mul(100).toNumber()
          : 0;
    });

    setPercentages(pcts);
    setCheckedIds(members.map((m) => m._id));
  }, [members, expense]);

  const checkedMembers = members.filter((m) => checkedIds.includes(m._id));

  const toggleBeneficiary = (member) => {
    const isChecked = checkedIds.includes(member._id);

    if (isChecked) {
      const wasLastChecked = checkedIds.length === 1;

      setPercentages((prev) => {
        const newPcts = { ...prev };
        const removedPct = newPcts[member._id] || 0;
        newPcts[member._id] = 0;

        if (wasLastChecked) {
          members.forEach((m) => {
            newPcts[m._id] = 0;
          });
        } else {
          const remainingChecked = checkedIds.filter((id) => id !== member._id);
          const remainingTotal = remainingChecked.reduce(
            (sum, id) => sum + (prev[id] || 0),
            0,
          );

          if (remainingTotal > 0) {
            remainingChecked.forEach((id) => {
              newPcts[id] =
                (prev[id] || 0) +
                (removedPct * (prev[id] || 0)) / remainingTotal;
            });
          } else if (remainingChecked.length > 0) {
            const equal = removedPct / remainingChecked.length;
            remainingChecked.forEach((id) => {
              newPcts[id] = equal;
            });
          }
        }

        return newPcts;
      });
      setCheckedIds((prev) => {
        const newChecked = prev.filter((id) => id !== member._id);
        if (newChecked.length === 0) {
          allWereUncheckedRef.current = true;
        }
        return newChecked;
      });
    } else {
      if (allWereUncheckedRef.current) {
        allWereUncheckedRef.current = false;
        const newPcts = {};
        members.forEach((m) => {
          newPcts[m._id] = 0;
        });
        newPcts[member._id] = 100;
        setPercentages(newPcts);
      } else {
        setPercentages((prev) => {
          const newCheckedIds = [...checkedIds, member._id];
          const newPcts = { ...prev };

          newCheckedIds.forEach((id) => {
            const m = members.find((mem) => mem._id === id);
            if (m) newPcts[id] = new Decimal(m.share).mul(100).toNumber();
          });

          members.forEach((m) => {
            if (!newCheckedIds.includes(m._id)) newPcts[m._id] = 0;
          });

          return rescaleTo100(newPcts, newCheckedIds);
        });
      }
      setCheckedIds((prev) => [...prev, member._id]);
    }
  };

  const handlePercentageChange = (memberId, value) => {
    setPercentages((prev) => {
      const newPcts = { ...prev, [memberId]: value };
      return rescaleOthers(newPcts, memberId, checkedIds);
    });
  };

  const handleAmountChange = (memberId, newAmount, totalAmount) => {
    if (!totalAmount || totalAmount <= 0) return;

    setPercentages((prev) => {
      const newPcts = { ...prev };
      newPcts[memberId] = (newAmount / totalAmount) * 100;
      return rescaleOthers(newPcts, memberId, checkedIds);
    });
  };

  return {
    percentages,
    checkedIds,
    checkedMembers,
    toggleBeneficiary,
    handlePercentageChange,
    handleAmountChange,
  };
}
