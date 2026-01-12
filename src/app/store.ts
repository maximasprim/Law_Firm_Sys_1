import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '@/features/Registration/registrationSlice';
import { casesApi } from '@/features/Cases/casesApi';
import { registrationApi } from '@/features/Registration/registrationApi';
import { passwordResetApi } from '@/features/PasswordReset/ResetApi';
import { documentsApi } from '@/features/Documents/documentsApi';
import { clientsApi } from '@/features/Clients/clientApi';
import { appointmentsApi } from '@/features/Appointments/appointmentsApi';

const rootReducer = combineReducers({
    auth: authReducer,
    [casesApi.reducerPath]: casesApi.reducer,
    [registrationApi.reducerPath]: registrationApi.reducer,
    [passwordResetApi.reducerPath]: passwordResetApi.reducer,
    [documentsApi.reducerPath]: documentsApi.reducer,
    [clientsApi.reducerPath]: clientsApi.reducer,
    [appointmentsApi.reducerPath]: appointmentsApi.reducer,
});

const persistConfig = {
    key: 'root',

    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        (getDefaultMiddleware() as any ).concat(casesApi.middleware).concat(registrationApi.middleware)
    .concat(passwordResetApi.middleware).concat(documentsApi.middleware).concat(clientsApi.middleware)
    .concat(appointmentsApi.middleware),
}) as any;

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;