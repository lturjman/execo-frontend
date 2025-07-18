import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export const fetchMember = createAsyncThunk(
  "members/fetchOne",
  async ({ groupId, member }) => {
    const response = await fetchWithAuth(
      `http://localhost:3000/groups/${groupId}/members/${member._id}`
    );
    if (!response.ok)
      throw new Error("Erreur lors de la récupération du membre");
    const responseBody = await response.json();
    return responseBody.data;
  }
);

export const fetchMembers = createAsyncThunk(
  "members/fetchAll",
  async ({ groupId }) => {
    const response = await fetchWithAuth(
      `http://localhost:3000/groups/${groupId}/members`
    );
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des membres");
    const responseBody = await response.json();
    return responseBody.data;
  }
);

export const createMember = createAsyncThunk(
  "members/create",
  async ({ groupId, member }) => {
    const response = await fetchWithAuth(
      `http://localhost:3000/groups/${groupId}/members/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member }),
      }
    );
    if (!response.ok) throw new Error("Erreur lors de la création du membre");
    const responseBody = await response.json();
    return responseBody.data;
  }
);

export const updateMember = createAsyncThunk(
  "members/update",
  async ({ groupId, member }) => {
    const response = await fetchWithAuth(
      `http://localhost:3000/groups/${groupId}/members/${member._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member }),
      }
    );
    if (!response.ok)
      throw new Error("Erreur lors de la modification du membre");
    const responseBody = await response.json();
    return responseBody.data;
  }
);

export const deleteMember = createAsyncThunk(
  "members/delete",
  async ({ groupId, member }) => {
    const response = await fetchWithAuth(
      `http://localhost:3000/groups/${groupId}/members/${member._id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok)
      throw new Error("Erreur lors de la suppression du membre");
    return member._id;
  }
);

const membersSlice = createSlice({
  name: "members",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Gestion de fetch d'un membre
      .addCase(fetchMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMember.fulfilled, (state, action) => {
        state.loading = false;
        // Met à jour ou ajoute le membre dans items
        const index = state.items.findIndex(
          (member) => member._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(fetchMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Gestion de fetch de la liste des membres
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Gestion de create
      .addCase(createMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMember.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Gestion de update
      .addCase(updateMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        state.loading = false;
        // Met à jour le membre dans le tableau items
        const index = state.items.findIndex(
          (member) => member._id === action.payload._id
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //Gestion de Delete
      .addCase(deleteMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.loading = false;
        // On retire le membre supprimé du tableau items
        state.items = state.items.filter(
          (member) => member._id !== action.payload
        );
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default membersSlice.reducer;
