import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: "",
    name: "",
    email: "",
    contact_number: "",
    game_ids: {},
    role_type: "BASIC",
};

export const userSlice = createSlice({
    name: "user_info",
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.contact_number = action.payload.contact_number;
            state.game_ids = action.payload.game_ids;
            state.role_type = action.payload.role_type;
        },
        unSetUserInfo: (state, action) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.contact_number = action.payload.contact_number;
            state.game_ids = action.payload.game_ids;
            state.role_type = action.payload.role_type;
        },
    },
});

export const { setUserInfo, unSetUserInfo } = userSlice.actions;

export default userSlice.reducer;
