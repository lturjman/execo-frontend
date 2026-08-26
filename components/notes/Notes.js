"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

import Button from "@/components/Button";
import { fetchMembers } from "@/lib/store/slices/members";
import { fetchMe } from "@/lib/store/slices/users";
import {
  createNote,
  deleteNote,
  fetchNotes,
  updateNote,
} from "@/lib/store/slices/notes";

const POLLING_INTERVAL = 3000;
const SEEN_NOTE_IDS_KEY = "execo:seen-note-ids";

const MEMBER_COLORS = [
  {
    card: "bg-purple-50 border-purple-200 dark:bg-purple-900/50 dark:border-purple-800",
    name: "text-purple-900 dark:text-purple-100",
    icon: "text-purple-700 dark:text-purple-300",
    time: "text-purple-600 dark:text-purple-400",
  },
  {
    card: "bg-blue-50 border-blue-200 dark:bg-blue-900/50 dark:border-blue-800",
    name: "text-blue-900 dark:text-blue-100",
    icon: "text-blue-700 dark:text-blue-300",
    time: "text-blue-600 dark:text-blue-400",
  },
  {
    card: "bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800",
    name: "text-green-900 dark:text-green-100",
    icon: "text-green-700 dark:text-green-300",
    time: "text-green-600 dark:text-green-400",
  },
  {
    card: "bg-amber-50 border-amber-200 dark:bg-amber-900/50 dark:border-amber-800",
    name: "text-amber-900 dark:text-amber-100",
    icon: "text-amber-700 dark:text-amber-300",
    time: "text-amber-600 dark:text-amber-400",
  },
  {
    card: "bg-rose-50 border-rose-200 dark:bg-rose-900/50 dark:border-rose-800",
    name: "text-rose-900 dark:text-rose-100",
    icon: "text-rose-700 dark:text-rose-300",
    time: "text-rose-600 dark:text-rose-400",
  },
  {
    card: "bg-cyan-50 border-cyan-200 dark:bg-cyan-900/50 dark:border-cyan-800",
    name: "text-cyan-900 dark:text-cyan-100",
    icon: "text-cyan-700 dark:text-cyan-300",
    time: "text-cyan-600 dark:text-cyan-400",
  },
  {
    card: "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/50 dark:border-indigo-800",
    name: "text-indigo-900 dark:text-indigo-100",
    icon: "text-indigo-700 dark:text-indigo-300",
    time: "text-indigo-600 dark:text-indigo-400",
  },
  {
    card: "bg-teal-50 border-teal-200 dark:bg-teal-900/50 dark:border-teal-800",
    name: "text-teal-900 dark:text-teal-100",
    icon: "text-teal-700 dark:text-teal-300",
    time: "text-teal-600 dark:text-teal-400",
  },
];

function getMemberColor(members, memberId) {
  const index = members.findIndex((m) => m._id === memberId);
  return MEMBER_COLORS[index === -1 ? 0 : index % MEMBER_COLORS.length];
}

function readStoredSeenNoteIds() {
  try {
    const raw = window.localStorage.getItem(SEEN_NOTE_IDS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    return null;
  }
}

function writeStoredSeenNoteIds(ids) {
  try {
    window.localStorage.setItem(
      SEEN_NOTE_IDS_KEY,
      JSON.stringify(ids.slice(-1000)),
    );
  } catch (error) {
    return null;
  }
}

export default function Notes({ groupId }) {
  const dispatch = useDispatch();

  const notes = useSelector((state) => state.notes.items);
  const notesLoading = useSelector((state) => state.notes.loading);
  const members = useSelector((state) => state.members.items);
  const me = useSelector((state) => state.users.me);

  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editMessage, setEditMessage] = useState("");
  const [menuNoteId, setMenuNoteId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [seenNoteIds, setSeenNoteIds] = useState(() => new Set());
  const [storedSeenLoaded, setStoredSeenLoaded] = useState(false);
  const hasSeenHistory = useRef(false);
  const listRef = useRef(null);

  const currentMember = members.find(
    (member) => (member.user?._id || member.user) === me._id,
  );

  const unreadCount = notes.filter((note) => !seenNoteIds.has(note._id)).length;

  useEffect(() => {
    dispatch(fetchMe());
    dispatch(fetchMembers({ groupId }));
    dispatch(fetchNotes({ groupId }));

    const interval = setInterval(() => {
      dispatch(fetchNotes({ groupId }));
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [dispatch, groupId]);

  useEffect(() => {
    const stored = readStoredSeenNoteIds();
    if (stored) {
      hasSeenHistory.current = true;
      setSeenNoteIds(new Set(stored));
    }
    setStoredSeenLoaded(true);
  }, []);

  useEffect(() => {
    if (!storedSeenLoaded || notesLoading) return;

    if (!hasSeenHistory.current) {
      hasSeenHistory.current = true;
      setSeenNoteIds((prev) => {
        const next = new Set(prev);
        notes.forEach((note) => next.add(note._id));
        return next.size === prev.size ? prev : next;
      });
      return;
    }

    if (isOpen) {
      setSeenNoteIds((prev) => {
        const next = new Set(prev);
        notes.forEach((note) => next.add(note._id));
        return next.size === prev.size ? prev : next;
      });
    }
  }, [isOpen, notes, notesLoading, storedSeenLoaded]);

  useEffect(() => {
    if (!storedSeenLoaded) return;
    writeStoredSeenNoteIds(Array.from(seenNoteIds));
  }, [seenNoteIds, storedSeenLoaded]);

  useEffect(() => {
    if (!isOpen) return;
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [notes.length, isOpen]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!message.trim() || !currentMember) return;

    await dispatch(
      createNote({
        groupId,
        note: { message: message.trim(), member: currentMember._id },
      }),
    );
    setMessage("");
  }

  function toggleMenu(note) {
    setMenuNoteId((current) => (current === note._id ? null : note._id));
  }

  function startEdit(note) {
    setMenuNoteId(null);
    setEditingId(note._id);
    setEditMessage(note.message);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditMessage("");
  }

  async function handleUpdate(event) {
    event.preventDefault();
    if (!editMessage.trim()) return;

    await dispatch(
      updateNote({
        groupId,
        note: { _id: editingId, message: editMessage.trim() },
      }),
    );
    cancelEdit();
  }

  function handleDelete(note) {
    setMenuNoteId(null);
    dispatch(deleteNote({ groupId, noteId: note._id }));
  }

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-4 flex flex-col">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="w-full flex items-center gap-2 cursor-pointer text-left"
      >
        {unreadCount > 0 && (
          <span className="flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-purple-400 text-white text-xs font-semibold">
            {unreadCount}
          </span>
        )}
        <span className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 grow">
          Notes du groupe
        </span>
        {isOpen ? (
          <ChevronUpIcon className="size-5 text-zinc-500 dark:text-zinc-400" />
        ) : (
          <ChevronDownIcon className="size-5 text-zinc-500 dark:text-zinc-400" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            ref={listRef}
            className="overflow-y-auto max-h-80 md:max-h-[28rem] flex-1 mt-4"
          >
            {notes.length === 0 ? (
              <p className="text-base text-zinc-500 dark:text-zinc-400 text-center py-6">
                Aucune note pour le moment.
              </p>
            ) : (
              <div className="flex flex-col items-center gap-2">
                {notes.map((note, index) => {
                  const isMine =
                    currentMember && note.member === currentMember._id;
                  const author = members.find(
                    (member) => member._id === note.member,
                  );
                  const isEditing = editingId === note._id;
                  const color = getMemberColor(members, note.member);

                  return (
                    <div
                      key={note._id}
                      className={`relative w-full max-w-sm border-2 rounded-lg p-4 shadow-sm ${color.card}`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p
                          className={`text-sm font-bold truncate ${color.name}`}
                        >
                          {author ? author.nickname : "Membre"}
                        </p>
                        {isMine && !isEditing && (
                          <button
                            onClick={() => toggleMenu(note)}
                            title="Options"
                            className="cursor-pointer opacity-70 hover:opacity-100"
                          >
                            <EllipsisVerticalIcon
                              className={`size-5 ${color.icon}`}
                            />
                          </button>
                        )}
                      </div>

                      {isEditing ? (
                        <form
                          onSubmit={handleUpdate}
                          className="flex items-center gap-1"
                        >
                          <input
                            type="text"
                            value={editMessage}
                            onChange={(e) => setEditMessage(e.target.value)}
                            autoFocus
                            className="appearance-none grow min-w-0 p-1 px-2 text-sm rounded bg-white/80 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-400"
                          />
                          <button
                            type="submit"
                            title="Enregistrer"
                            className="cursor-pointer opacity-80 hover:opacity-100"
                          >
                            <CheckIcon className={`size-5 ${color.icon}`} />
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            title="Annuler"
                            className="cursor-pointer opacity-80 hover:opacity-100"
                          >
                            <XMarkIcon className={`size-5 ${color.icon}`} />
                          </button>
                        </form>
                      ) : (
                        <p className="text-sm text-zinc-800 dark:text-zinc-100 break-words whitespace-pre-wrap leading-relaxed">
                          {note.message}
                        </p>
                      )}

                      {isMine && menuNoteId === note._id && (
                        <div className="absolute bottom-3 right-3 flex gap-2">
                          <button
                            onClick={() => startEdit(note)}
                            className="flex items-center gap-1 text-sm bg-white/90 dark:bg-zinc-700/90 text-zinc-800 dark:text-zinc-200 rounded px-3 py-1.5 cursor-pointer hover:bg-white dark:hover:bg-zinc-700"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(note)}
                            className="flex items-center gap-1 text-sm bg-red-500 text-white rounded px-3 py-1.5 cursor-pointer hover:bg-red-600"
                          >
                            Supprimer
                          </button>
                        </div>
                      )}

                      <div className="flex items-center justify-end mt-3">
                        <span className={`text-xs ${color.time}`}>
                          {new Date(note.createdAt).toLocaleTimeString(
                            "fr-FR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-4 flex items-center gap-2"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ajouter un pense-bête..."
              className="px-4 appearance-none grow p-2.5 focus:border rounded-full
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
            />
            <Button rounded="true">
              <CheckIcon className="size-5 text-white" />
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
