import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userAuthApi } from "../services/userAuthApi";
import authReducer from "../features/authSlice";
import userReducer from "../features/userSlice";
import { expenseApi } from "../services/expenseApi";
import { dashboardApi } from '../services/dashboardApi'; 

export const store = configureStore({
    reducer: {
        [userAuthApi.reducerPath]: userAuthApi.reducer,
        [expenseApi.reducerPath]: expenseApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        auth: authReducer,
        user_info: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(userAuthApi.middleware)
            .concat(expenseApi.middleware)
            .concat(dashboardApi.middleware),
});

setupListeners(store.dispatch);
