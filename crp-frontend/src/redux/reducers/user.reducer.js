import { createSlice } from "@reduxjs/toolkit";

export const initialUser = {
    userName: '',
    email: '',
    isLoggedIn: false,
    token: '',
}

export const userSlice = createSlice({
    name: 'user',
    initialState: initialUser,
    reducers: {
        setUser: (state, action) => {
            const {  success,data  } = action.payload;
            return {
                ...state,
                 isLoggedIn: !!success,
                 data:data,
                 token:data.access_token,
                 userName:data.user.name,
                 email:data.user.email,
            }
        },

        removeUser: () => {
            return initialUser;
        }
    }
})

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;