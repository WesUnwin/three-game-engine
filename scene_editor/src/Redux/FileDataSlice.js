import { createSlice } from '@reduxjs/toolkit';

const fileDataSlice = createSlice({
    name: 'fileData',
    initialState: {
        files: [], // Array of { path: "project_files/folder/file.json", data: <JSON>, error: null | { message: __ } }
        currentFileOperation: null // null | string describing the current file writing/deletion going on
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
        setCurrentFileOperation: (state, action) => {
            state.currentFileOperation = action.payload.currentFileOperation;
        },
        fileSaved: (state, action) => {
            const file = state.files.find(f => f.path === action.payload.filePath);
            if (file) {
                file.modified = false;
            }
        },
        fileDeleted: (state, action) => {
            state.files = state.files.filter(f => f.path !== action.payload.filePath);
        },
        renameScene: (state, action) => {
            const { sceneName, newSceneName } = action.payload;
            const gameFile = state.files.find(f => f.path === 'game.json');
            if (!gameFile.data.scenes || !gameFile.data.scenes[sceneName]) {
                throw new Error(`No scene with name: ${sceneName} found in game.json`)
            }
            gameFile.data.scenes[newSceneName] = gameFile.data.scenes[sceneName];
            if (gameFile.data.initialScene === sceneName) {
                gameFile.data.initialScene = newSceneName;
            }
            delete gameFile.data.scenes[sceneName];
            gameFile.modified = true;
        },
        removeScene: (state, action) => {
            const { sceneName, deleteFile } = action.payload;
            const gameFile = state.files.find(f => f.path === 'game.json');
            if (!gameFile.data.scenes || !gameFile.data.scenes[sceneName]) {
                throw new Error(`No scene with name: ${sceneName} found in game.json`)
            }

            if (deleteFile) {
                const sceneFilePath = gameFile.data.scenes[sceneName];
                state.files.filter(f => f.path === sceneFilePath).forEach(f => f.toBeDeleted = true);
            }

            if (gameFile.data.initialScene === sceneName) {
                const otherScenes = Object.keys(gameFile.data.scenes || {}).filter(sName => sName !== sceneName);
                gameFile.data.initialScene = otherScenes.length ? otherScenes[0] : null
            }

            delete gameFile.data.scenes[sceneName];
            gameFile.modified = true;
        },
        addComponentToGameObjectType: (state, action) => {
            const { gameObjectType, component } = action.payload;
            const gameFile = state.files.find(f => f.path === 'game.json');
            const gameObjectTypeFilePath = gameFile.data.gameObjectTypes[gameObjectType];
            const gameObjectTypeFile = state.files.find(f => f.path === gameObjectTypeFilePath);
            if (!gameObjectTypeFile.data.components) {
                gameObjectTypeFile.data.components = [];
            }
            gameObjectTypeFile.data.components.push(component);
            gameObjectTypeFile.modified = true;
        },
        removeComponentFromGameObjectType: (state, action) => {
            const { gameObjectType, componentIndex } = action.payload;
            const gameFile = state.files.find(f => f.path === 'game.json');
            const gameObjectTypeFilePath = gameFile.data.gameObjectTypes[gameObjectType];
            const gameObjectTypeFile = state.files.find(f => f.path === gameObjectTypeFilePath);
            gameObjectTypeFile.data.components.splice(componentIndex, 1)
            gameObjectTypeFile.modified = true;
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
        deleteGameObjectType: (state, action) => {
            const { gameObjectType } = action.payload;
            const gameFile = state.files.find(f => f.path === 'game.json');

            const recursivelyDeleteGameObject = (parentObject, gameObjectType) => {
                let deletionsMade = false;
                (parentObject.gameObjects || []).forEach(childObject => {
                    deletionsMade = recursivelyDeleteGameObject(childObject, gameObjectType);
                });
                if (parentObject.gameObjects) {
                    const objCount = parentObject.gameObjects.length;
                    parentObject.gameObjects = parentObject.gameObjects.filter(g => g.type !== gameObjectType);
                    if (objCount !== parentObject.gameObjects.length) {
                        deletionsMade = true;
                    } 
                }
                return deletionsMade;
            };

            for (const sceneFilePath of Object.values(gameFile.data.scenes)) {
                const sceneFile = state.files.find(f => f.path === sceneFilePath);
                const dataCopy = JSON.parse(JSON.stringify(sceneFile.data));
                const deletionsMade = recursivelyDeleteGameObject(dataCopy, gameObjectType);
                sceneFile.modified = deletionsMade;
                sceneFile.data = dataCopy;
            }

            const gameObjectTypeFilePath = gameFile.data.gameObjectTypes[gameObjectType];
            state.files.filter(f => f.path === gameObjectTypeFilePath).forEach(gameObjectTypeFile => {
                gameObjectTypeFile.toBeDeleted = true;
            });

            delete gameFile.data.gameObjectTypes[gameObjectType];
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

export const getFilesToBeDeletedCount = () => {
    return store => store.fileData.files.filter(f => f.toBeDeleted).length;
}

export const getCurrentFileOperation = () => {
    return store => store.fileData.currentFileOperation;
}

export const getModifiedFiles = () => {
    return store => store.fileData.files.filter(f => f.modified);
}

export default fileDataSlice;