import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAgendas = createAsyncThunk(
  "agendas/fetchAll",
  async ({ groupId }) => {
    const response = await fetchWithAuth(
      `${NEXT_PUBLIC_API_URL}/groups/${groupId}/agenda`,
    );
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération de l'agenda");
    }
    const responseBody = await response.json();
    return responseBody.data;
  },
);

export const createAgenda = createAsyncThunk(
  "agendas/create",
  async ({ groupId, event }) => {
    const response = await fetchWithAuth(
      `${NEXT_PUBLIC_API_URL}/groups/${groupId}/agenda`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      },
    );
    if (!response.ok) {
      throw new Error("Erreur lors de la création de l'événement");
    }
    const responseBody = await response.json();
    return responseBody.data;
  },
);

export const updateAgenda = createAsyncThunk(
  "agendas/update",
  async ({ groupId, event }) => {
    const response = await fetchWithAuth(
      `${NEXT_PUBLIC_API_URL}/groups/${groupId}/agenda/${event._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      },
    );
    if (!response.ok) {
      throw new Error("Erreur lors de la modification de l'événement");
    }
    const responseBody = await response.json();
    return responseBody.data;
  },
);

export const deleteAgenda = createAsyncThunk(
  "agendas/delete",
  async ({ groupId, eventId }) => {
    const response = await fetchWithAuth(
      `${NEXT_PUBLIC_API_URL}/groups/${groupId}/agenda/${eventId}`,
      { method: "DELETE" },
    );
    if (!response.ok) {
      throw new Error("Erreur lors de la suppression de l'événement");
    }
    return eventId;
  },
);

const agendasSlice = createSlice({
  name: "agendas",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgendas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgendas.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAgendas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createAgenda.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAgenda.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (event) => event._id === action.payload._id,
        );
        if (index === -1) state.items.push(action.payload);
      })
      .addCase(createAgenda.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateAgenda.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAgenda.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (event) => event._id === action.payload._id,
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateAgenda.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteAgenda.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAgenda.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((event) => event._id !== action.payload);
      })
      .addCase(deleteAgenda.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default agendasSlice.reducer;