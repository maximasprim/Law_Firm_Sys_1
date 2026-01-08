import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { casesApi } from '@/features/Cases/casesApi';

const rootReducer = combineReducers({
    // auth: authReducer,
    [casesApi.reducerPath]: casesApi.reducer,
});

const persistConfig = {
    key: 'root',

    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        (getDefaultMiddleware() as any ).concat(casesApi.middleware),
}) as any;

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;