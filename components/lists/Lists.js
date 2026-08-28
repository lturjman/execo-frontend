"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

import { fetchMembers } from "@/lib/store/slices/members";
import { fetchMe } from "@/lib/store/slices/users";
import {
  fetchLists,
  createList,
  updateList,
  deleteList,
  addItem,
  updateItem,
  deleteItem,
} from "@/lib/store/slices/lists";

const POLLING_INTERVAL = 3000;

const LIST_COLORS = {
  card: "bg-purple-50 border-purple-200 dark:bg-purple-900/50 dark:border-purple-800",
  icon: "text-purple-700 dark:text-purple-300",
  tab: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700",
  tabActive:
    "bg-purple-600 text-white dark:bg-purple-500 border-purple-600 dark:border-purple-500",
  check: "text-purple-600 dark:text-purple-400",
  progress: "bg-purple-500 dark:bg-purple-400",
};

export default function Lists({ groupId }) {
  const dispatch = useDispatch();

  const lists = useSelector((state) => state.lists.items);
  const members = useSelector((state) => state.members.items);
  const me = useSelector((state) => state.users.me);

  const [isOpen, setIsOpen] = useState(false);
  const [activeListId, setActiveListId] = useState(null);

  const [newListTitle, setNewListTitle] = useState("");
  const [showNewListInput, setShowNewListInput] = useState(false);

  const [menuListId, setMenuListId] = useState(null);
  const [confirmDeleteListId, setConfirmDeleteListId] = useState(null);

  const [editingListId, setEditingListId] = useState(null);
  const [editListTitle, setEditListTitle] = useState("");

  const [newItemText, setNewItemText] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const [editItemText, setEditItemText] = useState("");

  const menuRef = useRef(null);
  const listEndRef = useRef(null);
  const prevItemCountRef = useRef(0);

  const currentMember = members.find(
    (member) => (member.user?._id || member.user) === me._id,
  );

  const activeList = lists.find((l) => l._id === activeListId);

  useEffect(() => {
    dispatch(fetchMe());
    dispatch(fetchMembers({ groupId }));
    dispatch(fetchLists({ groupId }));

    const interval = setInterval(() => {
      dispatch(fetchLists({ groupId }));
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [dispatch, groupId]);

  useEffect(() => {
    if (!activeListId && lists.length > 0) {
      setActiveListId(lists[0]._id);
    }
  }, [lists, activeListId]);

  useEffect(() => {
    const currentCount = activeList?.items.length || 0;
    if (currentCount > prevItemCountRef.current && listEndRef.current) {
      listEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    prevItemCountRef.current = currentCount;
  }, [activeList?.items.length]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuListId(null);
      }
    }
    if (menuListId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuListId]);

  // --- List CRUD ---

  async function handleCreateList(e) {
    e.preventDefault();
    if (!newListTitle.trim() || !currentMember) return;
    const action = await dispatch(
      createList({
        groupId,
        list: { title: newListTitle.trim(), member: currentMember._id },
      }),
    );
    if (action.payload?._id) {
      setActiveListId(action.payload._id);
    }
    setNewListTitle("");
    setShowNewListInput(false);
  }

  function startEditList(list) {
    setEditingListId(list._id);
    setEditListTitle(list.title);
    setMenuListId(null);
  }

  function cancelEditList() {
    setEditingListId(null);
    setEditListTitle("");
  }

  async function handleUpdateList(e) {
    e.preventDefault();
    if (!editListTitle.trim()) return;
    await dispatch(
      updateList({
        groupId,
        list: { _id: editingListId, title: editListTitle.trim() },
      }),
    );
    cancelEditList();
  }

  function handleDeleteList(list) {
    setConfirmDeleteListId(null);
    setMenuListId(null);
    dispatch(deleteList({ groupId, listId: list._id }));
    if (activeListId === list._id) {
      setActiveListId(null);
    }
  }

  // --- Item CRUD ---

  async function handleAddItem(e) {
    e.preventDefault();
    if (!newItemText.trim() || !activeListId) return;
    await dispatch(
      addItem({ groupId, listId: activeListId, text: newItemText.trim() }),
    );
    setNewItemText("");
  }

  function handleToggleItem(listId, item) {
    dispatch(
      updateItem({
        groupId,
        listId,
        item: { _id: item._id, checked: !item.checked },
      }),
    );
  }

  function startEditItem(item) {
    setEditingItemId(item._id);
    setEditItemText(item.text);
  }

  function cancelEditItem() {
    setEditingItemId(null);
    setEditItemText("");
  }

  async function handleUpdateItem(e, listId, item) {
    e.preventDefault();
    if (!editItemText.trim()) return;
    await dispatch(
      updateItem({
        groupId,
        listId,
        item: { _id: item._id, text: editItemText.trim() },
      }),
    );
    cancelEditItem();
  }

  function handleDeleteItem(listId, itemId) {
    dispatch(deleteItem({ groupId, listId, itemId }));
  }

  const checkedCount = activeList
    ? activeList.items.filter((i) => i.checked).length
    : 0;
  const totalCount = activeList ? activeList.items.length : 0;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-4 flex flex-col">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="w-full flex items-center gap-2 cursor-pointer text-left"
      >
        <span className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 grow">
          Listes
        </span>
        {isOpen ? (
          <ChevronUpIcon className="size-5 text-zinc-500 dark:text-zinc-400" />
        ) : (
          <ChevronDownIcon className="size-5 text-zinc-500 dark:text-zinc-400" />
        )}
      </button>

      {isOpen && (
        <div className="mt-4">
          {lists.length === 0 && !showNewListInput ? (
            <div className="text-center py-6">
              <p className="text-base text-zinc-500 dark:text-zinc-400 mb-3">
                Aucune liste pour le moment.
              </p>
              <button
                type="button"
                onClick={() => setShowNewListInput(true)}
                className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full bg-purple-600 text-white cursor-pointer hover:bg-purple-700 transition-colors"
              >
                <PlusIcon className="size-4" />
                Créer une liste
              </button>
            </div>
          ) : null}

          {lists.length > 0 && (
            <div className="flex gap-1.5 mb-4 overflow-x-auto no-scrollbar">
              {lists.map((list) => {
                const isActive = activeListId === list._id;

                return (
                  <button
                    key={list._id}
                    type="button"
                    onClick={() => {
                      setActiveListId(list._id);
                      setMenuListId(null);
                      setEditingItemId(null);
                    }}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors cursor-pointer shrink-0 ${
                      isActive ? LIST_COLORS.tabActive : LIST_COLORS.tab
                    }`}
                  >
                    {list.title}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setShowNewListInput((v) => !v)}
                className="text-xs font-medium px-3 py-1.5 rounded-full border border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500 cursor-pointer transition-colors shrink-0"
              >
                <PlusIcon className="size-3 inline -mt-0.5" />
              </button>
            </div>
          )}

          {showNewListInput && (
            <form onSubmit={handleCreateList} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="Titre de la nouvelle liste..."
                autoFocus
                className="px-4 grow p-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                type="submit"
                disabled={!newListTitle.trim()}
                className="px-3 py-2 text-sm rounded-lg bg-purple-600 text-white cursor-pointer hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                Créer
              </button>
            </form>
          )}

          {activeList && (
            <div
              ref={menuRef}
              className={`relative border-2 rounded-lg p-4 ${LIST_COLORS.card}`}
            >
              <div className="flex items-center justify-between mb-1">
                {editingListId === activeList._id ? (
                  <form
                    onSubmit={handleUpdateList}
                    className="flex items-center gap-1 grow min-w-0"
                  >
                    <input
                      type="text"
                      value={editListTitle}
                      onChange={(e) => setEditListTitle(e.target.value)}
                      onBlur={handleUpdateList}
                      autoFocus
                      className="grow min-w-0 px-1 py-0.5 text-sm font-bold rounded bg-white/80 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-400"
                    />
                  </form>
                ) : (
                  <p
                    onClick={() => startEditList(activeList)}
                    className="text-sm font-bold truncate cursor-pointer hover:opacity-70"
                  >
                    {activeList.title}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() =>
                    setMenuListId((prev) =>
                      prev === activeList._id ? null : activeList._id,
                    )
                  }
                  className="shrink-0 cursor-pointer opacity-70 hover:opacity-100"
                >
                  <XMarkIcon className={`size-4 ${LIST_COLORS.icon}`} />
                </button>
              </div>

              {totalCount > 0 && (
                <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 mb-1">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${LIST_COLORS.progress}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              <p className="text-xs mb-3 text-purple-600 dark:text-purple-400">
                {checkedCount}/{totalCount}
              </p>

              <div
                className={`flex flex-col gap-1.5 mb-3${activeList.items.length > 10 ? " max-h-64 overflow-y-auto pr-1" : ""}`}
              >
                {activeList.items.length === 0 && (
                  <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-2">
                    Aucun item.
                  </p>
                )}
                {activeList.items.map((item) => (
                  <div key={item._id} className="flex items-center gap-2 group">
                    <button
                      type="button"
                      onClick={() => handleToggleItem(activeList._id, item)}
                      className={`shrink-0 size-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                        item.checked
                          ? `${LIST_COLORS.check} border-current bg-current/10`
                          : "border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500"
                      }`}
                    >
                      {item.checked && (
                        <CheckIcon className="size-3 text-current" />
                      )}
                    </button>

                    {editingItemId === item._id ? (
                      <form
                        onSubmit={(e) =>
                          handleUpdateItem(e, activeList._id, item)
                        }
                        className="flex items-center gap-1 grow"
                      >
                        <input
                          type="text"
                          value={editItemText}
                          onChange={(e) => setEditItemText(e.target.value)}
                          autoFocus
                          className="grow min-w-0 px-2 py-1 text-sm rounded bg-white/80 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-400"
                        />
                        <button
                          type="submit"
                          disabled={!editItemText.trim()}
                          className="cursor-pointer opacity-80 hover:opacity-100 disabled:opacity-30"
                        >
                          <CheckIcon className={`size-4 ${LIST_COLORS.icon}`} />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditItem}
                          className="cursor-pointer opacity-80 hover:opacity-100"
                        >
                          <XMarkIcon className={`size-4 ${LIST_COLORS.icon}`} />
                        </button>
                      </form>
                    ) : (
                      <>
                        <span
                          className={`grow text-sm break-words ${
                            item.checked
                              ? "line-through text-zinc-400 dark:text-zinc-500"
                              : "text-zinc-800 dark:text-zinc-200"
                          }`}
                        >
                          {item.text}
                        </span>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditItem(item)}
                            className="cursor-pointer"
                          >
                            <PencilIcon
                              className={`size-4 ${LIST_COLORS.icon}`}
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteItem(activeList._id, item._id)
                            }
                            className="cursor-pointer text-red-400 hover:text-red-600"
                          >
                            <TrashIcon className="size-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                <div ref={listEndRef} />
              </div>

              <form
                onSubmit={handleAddItem}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  placeholder="Ajouter un item..."
                  className="px-3 grow py-1.5 text-sm rounded-full bg-white/60 dark:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
                <button
                  type="submit"
                  disabled={!newItemText.trim()}
                  className="cursor-pointer opacity-80 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                >
                  <PlusIcon className={`size-5 ${LIST_COLORS.icon}`} />
                </button>
              </form>

              {menuListId === activeList._id && (
                <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-600 flex justify-center">
                  {confirmDeleteListId === activeList._id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteList(activeList)}
                        className="text-sm bg-red-500 text-white rounded px-3 py-1.5 cursor-pointer hover:bg-red-600"
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={() => setConfirmDeleteListId(null)}
                        className="text-sm bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded px-3 py-1.5 cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-500"
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteListId(activeList._id)}
                      className="text-sm bg-red-500 text-white rounded px-3 py-1.5 cursor-pointer hover:bg-red-600"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
