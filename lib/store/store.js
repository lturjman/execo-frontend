import { combineReducers, configureStore } from '@reduxjs/toolkit'
import groups from './slices/groups'
import members from './slices/members'
import expenses from './slices/expenses'
import paybacks from './slices/paybacks'
import users from './slices/users'
import notes from './slices/notes'
import lists from './slices/lists'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const reducers = combineReducers({
  groups,
  members,
  expenses,
  paybacks,
  users,
  notes,
  lists
})

const persistConfig = { key: 'Execo', storage }

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
})
const persistor = persistStore(store)

export { store, persistor }
export default store
