import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        showColliders: false
    },
    reducers: {
        changeSettings: (state, action) => {
            for (const prop in action.payload) {
                state[prop] = action.payload[prop]
            }
        }
    }
});

export const getSettings = () => {
    return store => store.settings;
}

export default settingsSlice;