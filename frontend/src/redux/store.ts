import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { customApi } from './rtkQuery/customApi';
import { pbsWiApi } from './rtkQuery/pbsWiApi';
import { personalizeApi } from './rtkQuery/personalizeApi';

const rootReducer = combineReducers({
  [customApi.reducerPath]: customApi.reducer,
  [pbsWiApi.reducerPath]: pbsWiApi.reducer,
  [personalizeApi.reducerPath]: personalizeApi.reducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(customApi.middleware)
      .concat(pbsWiApi.middleware)
      .concat(personalizeApi.middleware)
});


export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;