import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchPaybacks = createAsyncThunk(
  "paybacks/fetchPaybacks",
  async ({ groupId }) => {
    const res = await fetchWithAuth(
      `${NEXT_PUBLIC_API_URL}/groups/${groupId}/paybacks`
    );
    const json = await res.json();

    if (!res.ok) {
      throw new Error(
        json.error || "Erreur lors du chargement des remboursements"
      );
    }

    return json.data.paybacks || [];
  }
);

const paybacksSlice = createSlice({
  name: "paybacks",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaybacks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPaybacks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPaybacks.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default paybacksSlice.reducer;
