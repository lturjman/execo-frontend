import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { NumericFormat } from "react-number-format";
import { Decimal } from "decimal.js";
import { useSelector, useDispatch } from "react-redux";
import { fetchMembers } from "../lib/store/slices/members";

export default function ExpenseForm({
  expense,
  handleSubmit,
  submitLabel = "Valider",
}) {
  const dispatch = useDispatch();
  const [editableExpense, setEditableExpense] = useState({
    ...expense,
    amount: Decimal.div(expense.amount, 100).toString(),
    member:
      (expense.credits && expense.credits[0].member?._id) || expense.member,
  });
  const members = useSelector((state) => state.members.items);

  const submitForm = (event) => {
    event.preventDefault();
    handleSubmit(editableExpense);
  };

  useEffect(() => {
    if (expense.group) {
      dispatch(fetchMembers({ groupId: expense.group }));
    }
  }, [dispatch, expense.group]);

  return (
    <form onSubmit={submitForm}>
      <label htmlFor="name">Intitulé de la dépense</label>
      <input
        type="text"
        name="name"
        value={editableExpense.name}
        className="w-full p-2 mb-4 rounded bg-gray-100"
        placeholder="Course, Loyer, ..."
        onChange={(e) =>
          setEditableExpense({ ...editableExpense, name: e.target.value })
        }
      />

      <label htmlFor="amount">Montant</label>
      <NumericFormat
        value={editableExpense.amount}
        decimalScale={2}
        decimalSeparator=","
        thousandSeparator=" "
        fixedDecimalScale
        suffix=" €"
        onValueChange={({ floatValue }) =>
          setEditableExpense({ ...editableExpense, amount: floatValue })
        }
        className="w-full p-2 mb-4 rounded bg-gray-100"
        name="amount"
      />

      <label htmlFor="member">De :</label>
      <select
        value={editableExpense.member}
        name="member"
        onChange={(e) =>
          setEditableExpense({ ...editableExpense, member: e.target.value })
        }
        className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-purple-400 focus:border-purple-400 block w-full p-2"
      >
        <option value="">-- Choisir un membre --</option>
        {members.map((member) => (
          <option key={member._id} value={member._id}>
            {member.name}
          </option>
        ))}
      </select>

      <Button className="my-4">{submitLabel}</Button>
    </form>
  );
}
