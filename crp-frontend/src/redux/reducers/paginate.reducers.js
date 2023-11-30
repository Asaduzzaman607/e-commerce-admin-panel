import {createSlice} from "@reduxjs/toolkit";

export const paginationObjectTemplate = {
    model: [],
    metaData: [],
    summary : []
};

export const paginationSlice = createSlice({
    name: 'pagination',

    initialState: {
        demo: paginationObjectTemplate,
    },

    reducers: {
        setPagination: (state, action) => {
            const { key, data, meta_data, summary} = action.payload;
            if (Array.isArray(data)) {
                state[key] = { model: data, metaData: meta_data, summary};
            } else {
                state[key] = { model: [], metaData: meta_data, summary };
            }
        },

        resetState() {
            return {
                demo: paginationObjectTemplate,
            };
        },

        deleteKey(state, action) {
            const { key } = action.payload;
            delete state[key];
        }
    },
});

const { reducer: paginationReducer, actions } = paginationSlice;
export const {
    setPagination,
    deleteKey
} = actions;
export default paginationReducer;
