import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

// Récupérer un utilisateur par ID
export const fetchMe = createAsyncThunk("user/fetchOne", async () => {
  const response = await fetchWithAuth(`${NEXT_PUBLIC_API_URL}/auth/me`);
  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status}`);
  }
  const responseBody = await response.json();
  return responseBody.data;
});

// Mettre à jour un utilisateur
export const updateUser = createAsyncThunk(
  "user/update",
  async ({ userData }) => {
    const response = await fetchWithAuth(`${NEXT_PUBLIC_API_URL}/auth/me`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour de l'utilisateur");
    }
    const responseBody = await response.json();
    return responseBody.data;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    me: {},
    status: "idle",
    error: null,
  },
  reducers: {
    clearUsers: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- fetchMe ---
      .addCase(fetchMe.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.me = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message;
      })

      // --- updateUser ---
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.me = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearUsers } = userSlice.actions;
export default userSlice.reducer;
