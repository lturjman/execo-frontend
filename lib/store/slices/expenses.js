import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export const fetchExpense = createAsyncThunk(
  "expenses/fetchOne",
  async ({ groupId, expense }) => {
    const response = await fetchWithAuth(
      `http://localhost:3000/groups/${groupId}/expenses/${expense._id}`
    );
    if (!response.ok)
      throw new Error("Erreur lors de la récupération de la dépense");
    const responseBody = await response.json();
    return responseBody.data;
  }
);

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchAll",
  async ({ groupId }) => {
    const response = await fetchWithAuth(
      `http://localhost:3000/groups/${groupId}/expenses`
    );
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des dépenses");
    const responseBody = await response.json();
    return responseBody.data;
  }
);

export const createExpense = createAsyncThunk(
  "expenses/create",
  async ({ groupId, expense }) => {
    const response = await fetchWithAuth(
      `http://localhost:3000/groups/${groupId}/expenses/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expense }),
      }
    );
    if (!response.ok)
      throw new Error("Erreur lors de la création de la expense");
    const responseBody = await response.json();
    return responseBody.data;
  }
);

export const updateExpense = createAsyncThunk(
  "expenses/update",
  async ({ groupId, expense }) => {
    const response = await fetchWithAuth(
      `http://localhost:3000/groups/${groupId}/expenses/${expense._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expense }),
      }
    );
    if (!response.ok)
      throw new Error("Erreur lors de la modification de la dépense");
    const responseBody = await response.json();
    return responseBody.data;
  }
);

export const deleteExpense = createAsyncThunk(
  "expenses/delete",
  async ({ groupId, expense }) => {
    const response = await fetchWithAuth(
      `http://localhost:3000/groups/${groupId}/expenses/${expense._id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok)
      throw new Error("Erreur lors de la suppression de la dépense");
    return expense._id;
  }
);

const expensesSlice = createSlice({
  name: "expenses",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Gestion de fetch d'une dépense
      .addCase(fetchExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpense.fulfilled, (state, action) => {
        state.loading = false;
        // Met à jour ou ajoute la dépense dans items
        const index = state.items.findIndex(
          (expense) => expense._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(fetchExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Gestion de fetch de la liste des dépenses
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Gestion de create
      .addCase(createExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Gestion de update
      .addCase(updateExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.loading = false;
        // Met à jour la dépense dans le tableau items
        const index = state.items.findIndex(
          (expense) => expense._id === action.payload._id
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //Gestion de Delete
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
        // On retire la dépense supprimée du tableau items
        state.items = state.items.filter(
          (expense) => expense._id !== action.payload
        );
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default expensesSlice.reducer;
