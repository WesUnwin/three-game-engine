import { createSlice } from '@reduxjs/toolkit';

const fileDataSlice = createSlice({
    name: 'fileData',
    initialState: {
        files: [] // Array of { path: "project_files/folder/file.json", data: <JSON>, error: null | { message: __ } }
    },
    reducers: {
        updateFile: (state, action) => {
            const file = state.files.find(f => f.path === action.payload.path);
            if (file) {
                file.path = action.payload.path;
                file.data = action.payload.data;
                file.error = action.payload.error;
                file.metaData = action.payload.metaData;
            } else {
                state.files.push(action.payload);
            }
        }
    }
});

export const addFileData = (path, data, metaData) => {
    return fileDataSlice.actions.updateFile({ path, data, error: null, metaData });
};

export const reportFileError = (path, error) => {
    return fileDataSlice.actions.updateFile({ path, data: null, error: error });
};

export const getFile = (path) => {
    return store => store.fileData.files.find(f => f.path === path);
}

export default fileDataSlice;