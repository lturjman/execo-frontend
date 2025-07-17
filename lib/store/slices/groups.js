import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export const fetchGroup = createAsyncThunk("groups/fetchOne", async (id) => {
  const response = await fetchWithAuth(`http://localhost:3000/groups/${id}`);
  if (!response.ok) throw new Error("Erreur lors de la récupération du groupe");
  const responseBody = await response.json();
  return responseBody.data;
});

export const fetchGroups = createAsyncThunk("groups/fetchAll", async () => {
  const response = await fetchWithAuth(`http://localhost:3000/groups`);
  if (!response.ok)
    throw new Error("Erreur lors de la récupération des groupes");
  const responseBody = await response.json();
  return responseBody.data;
});

export const createGroup = createAsyncThunk(
  "groups/create",
  async (groupData) => {
    const response = await fetchWithAuth("http://localhost:3000/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group: groupData }),
    });
    if (!response.ok) throw new Error("Erreur lors de la création du groupe");
    const responseBody = await response.json();
    return responseBody.data;
  }
);

export const updateGroup = createAsyncThunk("groups/update", async (group) => {
  const response = await fetchWithAuth(
    `http://localhost:3000/groups/${group._id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group }),
    }
  );
  if (!response.ok) throw new Error("Erreur lors de la modification du groupe");
  const responseBody = await response.json();
  return responseBody.data;
});

export const deleteGroup = createAsyncThunk("groups/delete", async (id) => {
  const response = await fetchWithAuth(`http://localhost:3000/groups/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erreur lors de la suppression du groupe");
  return id;
});

const groupsSlice = createSlice({
  name: "groups",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Gestion de fetch d'un groupe
      .addCase(fetchGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroup.fulfilled, (state, action) => {
        state.loading = false;
        // Met à jour ou ajoute le groupe dans items
        const index = state.items.findIndex(
          (group) => group._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(fetchGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Gestion de fetch de la liste des groupes
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Gestion de create
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Gestion de update
      .addCase(updateGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.loading = false;
        // Met à jour le groupe dans le tableau items
        const index = state.items.findIndex(
          (group) => group._id === action.payload._id
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //Gestion de Delete
      .addCase(deleteGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.loading = false;
        // On retire le groupe supprimé du tableau items
        state.items = state.items.filter(
          (group) => group._id !== action.payload
        );
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default groupsSlice.reducer;
