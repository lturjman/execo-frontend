"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

import { fetchMembers } from "@/lib/store/slices/members";
import { fetchMe } from "@/lib/store/slices/users";
import { fetchNotes } from "@/lib/store/slices/notes";

import NoteCreate from "./Create";
import NoteUpdate from "./Update";
import NoteRemove from "./Remove";
import { MEMBER_COLORS } from "./NoteColors";

const SEEN_NOTE_IDS_KEY = "execo:seen-note-ids";

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

  const [editingId, setEditingId] = useState(null);
  const [editMessage, setEditMessage] = useState("");
  const [deleteNoteId, setDeleteNoteId] = useState(null);
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

  function startEdit(note) {
    setEditingId(note._id);
    setEditMessage(note.message);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditMessage("");
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
          Post-it
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
                {notes.map((note) => {
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
                            onClick={() => setDeleteNoteId(note._id)}
                            title="Supprimer"
                            className="cursor-pointer opacity-70 hover:opacity-100"
                          >
                            <TrashIcon className={`size-4 ${color.icon}`} />
                          </button>
                        )}
                      </div>

                      <NoteUpdate
                        groupId={groupId}
                        note={note}
                        isEditing={isEditing}
                        editMessage={editMessage}
                        onEditMessageChange={setEditMessage}
                        onCancelEdit={cancelEdit}
                        onClick={() => isMine && !isEditing && startEdit(note)}
                        colors={color}
                      />

                      {isMine && deleteNoteId === note._id && (
                        <NoteRemove
                          groupId={groupId}
                          note={note}
                          open
                          onClose={() => setDeleteNoteId(null)}
                        />
                      )}

                      <div className="flex items-center justify-end mt-3">
                        <span className={`text-xs ${color.time}`}>
                          {note.updatedAt !== note.createdAt
                            ? `Modifié le ${new Date(
                                note.updatedAt,
                              ).toLocaleString("fr-FR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}`
                            : new Date(note.createdAt).toLocaleString("fr-FR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <NoteCreate groupId={groupId} currentMember={currentMember} />
        </>
      )}
    </div>
  );
}
