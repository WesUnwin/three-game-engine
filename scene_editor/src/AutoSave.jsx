import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setFileBeingSaved, fileSaved } from './Redux/FileDataSlice';
import * as FileHelpers from './util/FileHelpers';
import store from './Redux/ReduxStore';
import { debounce } from './util/debounce';

const INTERVAL = 3000;

const saveFiles = debounce(async (dirHandle, dispatch) => {
    const filesToSave = store.getState().fileData.files.filter(f => f.modified);
    for (let file of filesToSave) {
        console.log('Saving file: ', file.path);
        dispatch(setFileBeingSaved(file.path));
        await FileHelpers.writeFile(dirHandle, file.path, JSON.stringify(file.data));
        dispatch(fileSaved(file.path));
        console.log('File saved: ', file.path);
    }
}, 2000);

const AutoSave = ({ dirHandle, children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (dirHandle) {
            const interval = setInterval(() => {
                saveFiles(dirHandle, dispatch)
            }, INTERVAL);
    
            return () => clearInterval(interval);
        }
    }, [dirHandle, dispatch]);

    return children;
};

export default AutoSave;