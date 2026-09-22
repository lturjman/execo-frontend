"use client";

import { useDispatch, useSelector } from "react-redux";
import { deleteAgenda } from "@/lib/store/slices/agendas";
import ValidationModal from "@/components/ValidationModal";

export default function AgendaRemove({ groupId, event, open, onClose }) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.agendas.loading);

  function handleDelete() {
    dispatch(deleteAgenda({ groupId, eventId: event._id }));
    onClose();
  }

  return (
    <ValidationModal
      open={open}
      onClose={onClose}
      onConfirm={handleDelete}
      loading={loading}
      title="Supprimer cet événement ?"
      description="Pour rappel, cette action est irréversible."
    />
  );
}