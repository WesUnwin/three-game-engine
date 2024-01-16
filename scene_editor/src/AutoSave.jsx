import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import fileDataSlice from './Redux/FileDataSlice';
import * as FileHelpers from './util/FileHelpers';
import store from './Redux/ReduxStore';
import { debounce } from './util/debounce';

const INTERVAL = 3000;

const writeFiles = debounce(async (dirHandle, dispatch) => {
    const filesToDelete = store.getState().fileData.files.filter(f => f.toBeDeleted);
    for (let file of filesToDelete) {
        console.log('Deleting file: ', file.path);
        dispatch(fileDataSlice.actions.setCurrentFileOperation({
            currentFileOperation: `Deleting file: ${file.path}...`
        }));
        await FileHelpers.deleteFile(dirHandle, file.path).catch(error => {
            if (error.name !== 'NotFoundError') {
                console.error(`error deleting file: ${file.path} error: ${error}`);
            }
        });
        dispatch(fileDataSlice.actions.fileDeleted({ filePath: file.path }));
        dispatch(fileDataSlice.actions.setCurrentFileOperation({
            currentFileOperation: null
        }));
        console.log('File deleted: ', file.path);
    }

    const filesToSave = store.getState().fileData.files.filter(f => f.modified);
    for (let file of filesToSave) {
        console.log('Saving file: ', file.path);
        dispatch(fileDataSlice.actions.setCurrentFileOperation({
            currentFileOperation: `Saving file: ${file.path}...`
        }));
        const content = JSON.stringify(file.data, null, 4); // indent by 4 spaces
        await FileHelpers.writeFile(dirHandle, file.path, content);
        dispatch(fileDataSlice.actions.fileSaved({ filePath: file.path }));
        dispatch(fileDataSlice.actions.setCurrentFileOperation({
            currentFileOperation: null
        }));
        console.log('File saved: ', file.path);
    }
}, 2000);

const AutoSave = ({ dirHandle, children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (dirHandle) {
            const interval = setInterval(() => {
                writeFiles(dirHandle, dispatch)
            }, INTERVAL);
    
            return () => clearInterval(interval);
        }
    }, [dirHandle, dispatch]);

    return children;
};

export default AutoSave;