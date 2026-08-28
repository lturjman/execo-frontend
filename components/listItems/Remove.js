"use client";

import { TrashIcon } from "@heroicons/react/24/solid";
import { useDispatch } from "react-redux";
import { deleteItem } from "@/lib/store/slices/lists";

export default function ItemRemove({ groupId, listId, itemId }) {
  const dispatch = useDispatch();

  function handleDeleteItem() {
    dispatch(deleteItem({ groupId, listId, itemId }));
  }

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
      <button
        type="button"
        onClick={handleDeleteItem}
        className="cursor-pointer text-red-400 hover:text-red-600 "
      >
        <TrashIcon className="size-4" />
      </button>
    </div>
  );
}
