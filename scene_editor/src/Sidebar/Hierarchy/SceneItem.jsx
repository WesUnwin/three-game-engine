import React, { useEffect } from 'react';
import TreeView from "./TreeView.jsx";
import * as FileHelpers from '../../util/FileHelpers.js'
import { useDispatch, useSelector } from 'react-redux';
import { getFile } from '../../Redux/FileDataSlice.js';
import { getSelectedItem, selectItem } from '../../Redux/SelectedItemSlice.js';
import GameObjectItem from './GameObjectItem.jsx';

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
        if (!errorMessage) {
            dispatch(selectItem(scenePath, 'sceneJSON'));
        }
    };

    return (
        <TreeView label={`${sceneName} (${scenePath})`} errorMessage={errorMessage} onClick={onClick} isSelected={isSelected} maxChildrenHeight="250px">
            {(fileData?.data?.gameObjects || []).map((gameObjectJSON, index) => (
                <GameObjectItem key={index} dirHandle={dirHandle} scenePath={scenePath} gameObjectJSON={gameObjectJSON} indices={[index]} />
            ))}
        </TreeView>
    );
};

export default SceneItem;