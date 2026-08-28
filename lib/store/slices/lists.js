import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchLists = createAsyncThunk(
  "lists/fetchAll",
  async ({ groupId }) => {
    const response = await fetchWithAuth(
      `${NEXT_PUBLIC_API_URL}/groups/${groupId}/lists`,
    );
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des listes");
    const responseBody = await response.json();
    return responseBody.data;
  },
);

export const createList = createAsyncThunk(
  "lists/create",
  async ({ groupId, list }) => {
    const response = await fetchWithAuth(
      `${NEXT_PUBLIC_API_URL}/groups/${groupId}/lists`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(list),
      },
    );
    if (!response.ok) throw new Error("Erreur lors de la création de la liste");
    const responseBody = await response.json();
    return responseBody.data;
  },
);

export const updateList = createAsyncThunk(
  "lists/update",
  async ({ groupId, list }) => {
    const response = await fetchWithAuth(
      `${NEXT_PUBLIC_API_URL}/groups/${groupId}/lists/${list._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(list),
      },
    );
    if (!response.ok)
      throw new Error("Erreur lors de la modification de la liste");
    const responseBody = await response.json();
    return responseBody.data;
  },
);

export const deleteList = createAsyncThunk(
  "lists/delete",
  async ({ groupId, listId }) => {
    const response = await fetchWithAuth(
      `${NEXT_PUBLIC_API_URL}/groups/${groupId}/lists/${listId}`,
      { method: "DELETE" },
    );
    if (!response.ok)
      throw new Error("Erreur lors de la suppression de la liste");
    return listId;
  },
);

export const addItem = createAsyncThunk(
  "lists/addItem",
  async ({ groupId, listId, text }) => {
    const response = await fetchWithAuth(
      `${NEXT_PUBLIC_API_URL}/groups/${groupId}/lists/${listId}/items`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      },
    );
    if (!response.ok) throw new Error("Erreur lors de l'ajout de l'item");
    const responseBody = await response.json();
    return { listId, item: responseBody.data };
  },
);

export const updateItem = createAsyncThunk(
  "lists/updateItem",
  async ({ groupId, listId, item }) => {
    const response = await fetchWithAuth(
      `${NEXT_PUBLIC_API_URL}/groups/${groupId}/lists/${listId}/items/${item._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      },
    );
    if (!response.ok)
      throw new Error("Erreur lors de la modification de l'item");
    const responseBody = await response.json();
    return { listId, item: responseBody.data };
  },
);

export const deleteItem = createAsyncThunk(
  "lists/deleteItem",
  async ({ groupId, listId, itemId }) => {
    const response = await fetchWithAuth(
      `${NEXT_PUBLIC_API_URL}/groups/${groupId}/lists/${listId}/items/${itemId}`,
      { method: "DELETE" },
    );
    if (!response.ok)
      throw new Error("Erreur lors de la suppression de l'item");
    return { listId, itemId };
  },
);

const listsSlice = createSlice({
  name: "lists",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createList.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (l) => l._id === action.payload._id,
        );
        if (index === -1) state.items.push(action.payload);
      })
      .addCase(createList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateList.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (l) => l._id === action.payload._id,
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteList.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((l) => l._id !== action.payload);
      })
      .addCase(deleteList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.loading = false;
        const list = state.items.find((l) => l._id === action.payload.listId);
        if (list) list.items.push(action.payload.item);
      })
      .addCase(addItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;
        const list = state.items.find((l) => l._id === action.payload.listId);
        if (list) {
          const index = list.items.findIndex(
            (i) => i._id === action.payload.item._id,
          );
          if (index !== -1) list.items[index] = action.payload.item;
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading = false;
        const list = state.items.find((l) => l._id === action.payload.listId);
        if (list)
          list.items = list.items.filter(
            (i) => i._id !== action.payload.itemId,
          );
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default listsSlice.reducer;
