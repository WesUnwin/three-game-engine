import React, { useEffect } from 'react';
import TreeView from "./TreeView.jsx";
import * as FileHelpers from '../../util/FileHelpers.js'
import { useDispatch, useSelector } from 'react-redux';
import { getFile } from '../../Redux/FileDataSlice.js';
import { getSelectedItem, selectItem } from '../../Redux/SelectedItemSlice.js';

const SceneItem = ({ dirHandle, sceneName, scenePath }) => {
    const dispatch = useDispatch();

    const fileData = useSelector(getFile(scenePath));

    const selectedItem = useSelector(getSelectedItem());
    const isSelected = selectedItem?.type === 'sceneJSON' && selectedItem?.filePath === scenePath;

    useEffect(() => {
        FileHelpers.loadFile(dirHandle, scenePath, dispatch, { type: 'sceneJSON' })
    }, [scenePath]);

    const errorMessage = fileData?.error?.message;

    const onClick = () => {
        dispatch(selectItem(scenePath, 'sceneJSON'));
    };

    return (
        <TreeView label={`${sceneName} (${scenePath})`} errorMessage={errorMessage} onClick={onClick} isSelected={isSelected} />
    );
};

export default SceneItem;