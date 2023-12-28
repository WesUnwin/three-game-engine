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
        },
        updateGameObject: (state, action) => {
            const { scenefilePath, gameObjectIndices, field, value } = action.payload;

            const file = state.files.find(f => f.path == scenefilePath);
            if (file) {
                const { data } = file;
               
                // Point subObject at the correct game object within the scene JSON
                let subObject = data.gameObjects[gameObjectIndices[0]];
                if (gameObjectIndices.length > 1) {
                    for (let i = 1; i<gameObjectIndices.length; i++) {
                        subObject = subObject.gameObjects[gameObjectIndices[i]];
                    }
                }

                // Set/update the given property within the game object
                for (let i = 0; i<field.length; i++) {
                    if (i === field.length - 1) {
                        subObject[field[i]] = value;
                    } else {
                        if (!(field[i] in subObject)) {
                            subObject[field[i]] = {};
                        }
                        subObject = subObject[field[i]];
                    }
                }
            }
        },
        mergeFileData: (state, action) => {
            const file = state.files.find(f => f.path === action.payload.path);
            if (file) {
                file.data = Object.assign({}, file.data, action.payload.data);
            }
        }
    }
});

export const addFileData = (path, data, metaData) => {
    return fileDataSlice.actions.updateFile({ path, data, error: null, metaData });
};

export const mergeFileData = (path, data) => {
    return fileDataSlice.actions.mergeFileData({ path, data });
};

export const updateGameObject = (scenefilePath, gameObjectIndices, field, value) => {
    return fileDataSlice.actions.updateGameObject({ scenefilePath, gameObjectIndices, field, value });
};

export const reportFileError = (path, error) => {
    return fileDataSlice.actions.updateFile({ path, data: null, error: error });
};

export const getFile = (path) => {
    return store => store.fileData.files.find(f => f.path === path);
}

export default fileDataSlice;