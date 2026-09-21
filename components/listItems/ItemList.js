"use client";

import { useState } from "react";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/solid";
import { useDispatch } from "react-redux";
import { reorderItems } from "@/lib/store/slices/lists";
import ItemCreate from "./Create";
import ItemUpdate from "./Update";
import ItemRemove from "./Remove";

export default function ItemList({
  groupId,
  listId,
  items,
  colors,
  listEndRef,
  editingItemId,
  editItemText,
  onEditItemTextChange,
  onStartEditItem,
  onCancelEditItem,
}) {
  const dispatch = useDispatch();
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [dragOverItemId, setDragOverItemId] = useState(null);
  const totalCount = items.length;
  const checkedCount = items.filter((i) => i.checked).length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;
  const sortedItems = [...items].sort(
    (a, b) => Number(a.checked) - Number(b.checked),
  );

  function handleDragStart(e, item) {
    setDraggedItemId(item._id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", item._id);
  }

  function handleDragOver(e, item) {
    const dragged = items.find((i) => i._id === draggedItemId);
    if (
      !dragged ||
      dragged._id === item._id ||
      dragged.checked !== item.checked
    ) {
      return;
    }
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverItemId(item._id);
  }

  function handleDrop(e, item) {
    e.preventDefault();
    const dragged = items.find((i) => i._id === draggedItemId);
    if (
      !dragged ||
      dragged._id === item._id ||
      dragged.checked !== item.checked
    ) {
      handleDragEnd();
      return;
    }
    const reordered = [...sortedItems];
    const from = reordered.findIndex((i) => i._id === dragged._id);
    const to = reordered.findIndex((i) => i._id === item._id);
    if (from !== -1 && to !== -1) {
      const [moved] = reordered.splice(from, 1);
      reordered.splice(to, 0, moved);
      dispatch(
        reorderItems({
          groupId,
          listId,
          itemIds: reordered.map((i) => i._id),
        }),
      );
    }
    handleDragEnd();
  }

  function handleDragEnd() {
    setDraggedItemId(null);
    setDragOverItemId(null);
  }

  return (
    <>
      {totalCount > 0 && (
        <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 mb-1">
          <div
            className={`h-full rounded-full transition-all duration-300 ${colors.progress}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <p className="text-xs mb-3 text-purple-600 dark:text-purple-400">
        {checkedCount}/{totalCount}
      </p>

      <div
        className={`flex flex-col gap-1.5 mb-3${items.length > 10 ? " max-h-64 overflow-y-auto pr-1" : ""}`}
      >
        {items.length === 0 && (
          <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-2">
            Aucun élément.
          </p>
        )}
        {sortedItems.map((item) => (
          <div
            key={item._id}
            onClick={() => {
              setSelectedItemId((current) =>
                current === item._id ? null : item._id,
              );
            }}
            onDragOver={(e) => handleDragOver(e, item)}
            onDragLeave={(e) => {
              if (e.currentTarget.contains(e.relatedTarget)) return;
              setDragOverItemId((current) =>
                current === item._id ? null : current,
              );
            }}
            onDrop={(e) => handleDrop(e, item)}
            className={`flex items-center gap-2 group rounded transition-opacity ${
              dragOverItemId === item._id ? "ring-1 ring-purple-400" : ""
            } ${draggedItemId === item._id ? "opacity-40" : ""}`}
          >
            <button
              type="button"
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDragEnd={handleDragEnd}
              onClick={(e) => e.stopPropagation()}
              title="Déplacer"
              className="shrink-0 cursor-grab active:cursor-grabbing text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              <ArrowsPointingOutIcon className="size-4" />
            </button>
            <ItemUpdate
              groupId={groupId}
              listId={listId}
              item={item}
              isEditing={editingItemId === item._id}
              editText={editItemText}
              onEditTextChange={onEditItemTextChange}
              onStartEdit={(item) => {
                setSelectedItemId(null);
                onStartEditItem(item);
              }}
              onCancelEdit={onCancelEditItem}
              colors={colors}
            />
            <ItemRemove
              groupId={groupId}
              listId={listId}
              itemId={item._id}
              visible={
                selectedItemId === item._id || editingItemId === item._id
              }
            />
          </div>
        ))}
        <div ref={listEndRef} />
      </div>

      <ItemCreate groupId={groupId} listId={listId} colors={colors} />
    </>
  );
}
