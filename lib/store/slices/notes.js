import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchWithAuth } from '@/utils/fetchWithAuth'
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

export const fetchNotes = createAsyncThunk(
  'notes/fetchAll',
  async ({ groupId }) => {
    const response = await fetchWithAuth(
      `${NEXT_PUBLIC_API_URL}/groups/${groupId}/notes`
    )
    if (!response.ok) { throw new Error('Erreur lors de la récupération des notes') }
    const responseBody = await response.json()
    return responseBody.data
  }
)

export const createNote = createAsyncThunk(
  'notes/create',
  async ({ groupId, note }) => {
    const response = await fetchWithAuth(
      `${NEXT_PUBLIC_API_URL}/groups/${groupId}/notes`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note)
      }
    )
    if (!response.ok) throw new Error('Erreur lors de la création de la note')
    const responseBody = await response.json()
    return responseBody.data
  }
)

export const updateNote = createAsyncThunk(
  'notes/update',
  async ({ groupId, note }) => {
    const response = await fetchWithAuth(
      `${NEXT_PUBLIC_API_URL}/groups/${groupId}/notes/${note._id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note)
      }
    )
    if (!response.ok) { throw new Error('Erreur lors de la modification de la note') }
    const responseBody = await response.json()
    return responseBody.data
  }
)

export const deleteNote = createAsyncThunk(
  'notes/delete',
  async ({ groupId, noteId }) => {
    const response = await fetchWithAuth(
      `${NEXT_PUBLIC_API_URL}/groups/${groupId}/notes/${noteId}`,
      {
        method: 'DELETE'
      }
    )
    if (!response.ok) { throw new Error('Erreur lors de la suppression de la note') }
    return noteId
  }
)

const notesSlice = createSlice({
  name: 'notes',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(createNote.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false
        const index = state.items.findIndex(
          (note) => note._id === action.payload._id
        )
        if (index === -1) state.items.push(action.payload)
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(updateNote.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = false
        const index = state.items.findIndex(
          (note) => note._id === action.payload._id
        )
        if (index !== -1) state.items[index] = action.payload
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(deleteNote.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter((note) => note._id !== action.payload)
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

export default notesSlice.reducer
