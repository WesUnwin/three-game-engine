import { createSlice } from '@reduxjs/toolkit';

const currentModalSlice = createSlice({
    name: 'currentModal',
    initialState: {
        type: null,
        params: {}
    },
    reducers: {
        openModal: (state, action) => {
            state.type = action.payload.type;
            state.params = action.payload.params;
        },
        closeModal: state => {
            state.type = null;
            state.params = {};
        }
    }
});

export const getCurrentModal = () => {
    return store => store.currentModal;
};

export default currentModalSlice;