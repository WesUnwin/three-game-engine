import { createSlice } from '@reduxjs/toolkit';

const projectFilesSlice = createSlice({
    name: 'projectFiles',
    initialState: {
    },
    reducers: {
        setState: (state, action) => {
            for (const prop in action.payload) {
                state[prop] = action.payload[prop]
            }
        }
    }
});

export default projectFilesSlice;