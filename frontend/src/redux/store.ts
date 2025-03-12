import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { pbsWiApi } from './rtkQuery/pbsWiApi';

const rootReducer = combineReducers({
  [pbsWiApi.reducerPath]: pbsWiApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
    .concat(pbsWiApi.middleware)
});


export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;