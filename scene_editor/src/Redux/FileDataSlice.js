import { createSlice } from '@reduxjs/toolkit';

const fileDataSlice = createSlice({
    name: 'fileData',
    initialState: {
        files: [], // Array of { path: "project_files/folder/file.json", data: <JSON>, error: null | { message: __ } }
        fileBeingSaved: null // null or path of file currently being saved
    },
    reducers: {
        clear: (state) => {
            state.files = [];
            state.fileBeingSaved = null;
        },
        addFileData: (state, action) => {
            const file = state.files.find(f => f.path === action.payload.path);
            if (file) {
                file.path = action.payload.path;
                file.data = action.payload.data;
                file.error = action.payload.error;
                file.metaData = action.payload.metaData;
            } else {
                state.files.push({ ...action.payload, modified: false });
            }
        },
        modifyFileData: (state, action) => {
            const { path, field, value } = action.payload
            const file = state.files.find(f => f.path === path);
            if (file) {
                let subObject = file.data;
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
            file.modified = true;
        },
        createGameObject: (state, action) => {
            const { scenePath, gameObject } = action.payload;

            const file = state.files.find(f => f.path == scenePath);
            if (file) {
                const { data } = file;

                if ('gameObjects' in data) {
                    data.gameObjects.push(gameObject);
                } else {
                    data.gameObjects = [gameObject];
                }
                file.modified = true;
            }
        },
        modifyGameObject: (state, action) => {
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

                if (!subObject) {
                    console.error('modifyGameObject() indices do not refer to an existing game object TODO: stop using indices as they dont make sense after deletions');
                    return;
                }

                // Set/update the given property within the game object
                for (let i = 0; i<field.length; i++) {
                    if (i === field.length - 1) {
                        subObject[field[i]] = value;
                    } else {
                        if (!(field[i] in subObject)) {
                            if (['position', 'scale', 'rotation'].includes(field[i])) {
                                subObject[field[i]] = {
                                    "x": field[i] === 'scale' ? 1 : 0,
                                    "y": field[i] === 'scale' ? 1 : 0,
                                    "z": field[i] === 'scale' ? 1 : 0,
                                };
                            } else {
                                subObject[field[i]] = {};
                            }
                        }
                        subObject = subObject[field[i]];
                    }
                }

                file.modified = true;
            }
        },
        deleteGameObject: (state, action) => {
            const { scenePath, gameObjectIndices } = action.payload;
            const file = state.files.find(f => f.path == scenePath);
            if (file) {
                const { data } = file;

                let parent = data;
                let subObject = data.gameObjects[gameObjectIndices[0]];
                if (gameObjectIndices.length > 1) {
                    for (let i = 1; i<gameObjectIndices.length; i++) {
                        parent = subObject;
                        subObject = subObject.gameObjects[gameObjectIndices[i]];
                    }
                }

                const gameObjectToDelete = subObject;
                parent.gameObjects = parent.gameObjects.filter(g => g !== gameObjectToDelete);
                file.modified = true;
            }
        },
        setFileBeingSaved: (state, action) => {
            state.fileBeingSaved = action.payload.filePath;
        },
        fileSaved: (state, action) => {
            const file = state.files.find(f => f.path === action.payload.filePath);
            if (file) {
                file.modified = false;
            }
            state.fileBeingSaved = null;
        },
        renameScene: (state, action) => {
            const { sceneName, newSceneName } = action.payload;
            const gameFile = state.files.find(f => f.path === 'game.json');
            if (!gameFile.data.scenes || !gameFile.data.scenes[sceneName]) {
                throw new Error(`No scene with name: ${sceneName} found in game.json`)
            }
            gameFile.data.scenes[newSceneName] = gameFile.data.scenes[sceneName];
            delete gameFile.data.scenes[sceneName];
            gameFile.modified = true;
        },
        removeScene: (state, action) => {
            const { sceneName } = action.payload;
            const gameFile = state.files.find(f => f.path === 'game.json');
            if (!gameFile.data.scenes || !gameFile.data.scenes[sceneName]) {
                throw new Error(`No scene with name: ${sceneName} found in game.json`)
            }
            delete gameFile.data.scenes[sceneName];
            gameFile.modified = true;
        },
        addModelToGameObjectType: (state, action) => {
            const { gameObjectType, model } = action.payload;
            const gameFile = state.files.find(f => f.path === 'game.json');
            const gameObjectTypeFilePath = gameFile.data.gameObjectTypes[gameObjectType];
            const gameObjectTypeFile = state.files.find(f => f.path === gameObjectTypeFilePath);
            if (!gameObjectTypeFile.data.models) {
                gameObjectTypeFile.data.models = [];
            }
            gameObjectTypeFile.data.models.push(model)
            gameObjectTypeFile.modified = true;
        },
        removeModelFromGameObjectType: (state, action) => {
            const { gameObjectType, modelIndex } = action.payload;
            const gameFile = state.files.find(f => f.path === 'game.json');
            const gameObjectTypeFilePath = gameFile.data.gameObjectTypes[gameObjectType];
            const gameObjectTypeFile = state.files.find(f => f.path === gameObjectTypeFilePath);
            gameObjectTypeFile.data.models.splice(modelIndex, 1)
            gameObjectTypeFile.modified = true;
        },
        addLightToGameObjectType: (state, action) => {
            const { gameObjectType, light } = action.payload;
            const gameFile = state.files.find(f => f.path === 'game.json');
            const gameObjectTypeFilePath = gameFile.data.gameObjectTypes[gameObjectType];
            const gameObjectTypeFile = state.files.find(f => f.path === gameObjectTypeFilePath);
            if (!gameObjectTypeFile.data.lights) {
                gameObjectTypeFile.data.lights = [];
            }
            gameObjectTypeFile.data.lights.push(light)
            gameObjectTypeFile.modified = true;
        }
    }
});

export const addFileData = (path, data, metaData) => {
    return fileDataSlice.actions.addFileData({ path, data, error: null, metaData });
};

export const reportFileError = (path, error) => {
    return fileDataSlice.actions.addFileData({ path, data: null, error: error });
};

export const modifyGameObject = (scenefilePath, gameObjectIndices, field, value) => {
    return fileDataSlice.actions.modifyGameObject({ scenefilePath, gameObjectIndices, field, value });
};

export const getFile = (path) => {
    return store => store.fileData.files.find(f => f.path === path);
}

export const getModifiedFileCount = () => {
    return store => store.fileData.files.filter(f => f.modified).length;
}

export const setFileBeingSaved = filePath => {
    return fileDataSlice.actions.setFileBeingSaved({ filePath });
}

export const getFileBeingSaved = () => {
    return store => store.fileData.fileBeingSaved;
}

export const fileSaved = filePath => {
    return fileDataSlice.actions.fileSaved({ filePath });
}

export const getModifiedFiles = () => {
    return store => store.fileData.files.filter(f => f.modified);
}

export default fileDataSlice;