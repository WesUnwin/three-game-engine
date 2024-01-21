import React, { useEffect } from 'react';
import TreeView from "./TreeView.jsx";
import * as FileHelpers from '../../util/FileHelpers.js'
import { useDispatch, useSelector } from 'react-redux';
import { getFile } from '../../Redux/FileDataSlice.js';
import { getSelectedItem, selectItem } from '../../Redux/SelectedItemSlice.js';
import GameObjectItem from './GameObjectItem.jsx';
import { FaPlus, FaTrash } from 'react-icons/fa';
import currentModalSlice from '../../Redux/CurrentModalSlice.js'

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
            dispatch(selectItem(scenePath, 'sceneJSON', { name: sceneName }));
        }
    };

    const deleteScene = () => {
        dispatch(currentModalSlice.actions.openModal({ type: 'DeleteSceneModal', params: { sceneName } }));
    };

    const addGameObject = () => {
        dispatch(currentModalSlice.actions.openModal({ type: 'AddGameObjectModal', params: { sceneName } }));
    };

    const gameObjects = fileData?.data?.gameObjects || [];

    return (
        <TreeView
            label={sceneName}
            errorMessage={errorMessage}
            onClick={onClick}
            isSelected={isSelected}
            maxChildrenHeight="250px"
            actions={[
                { icon: <FaTrash />, onClick: deleteScene },
                { icon: <FaPlus />, onClick: addGameObject }
            ]}
        >
            {gameObjects.length === 0 ? (
                '(no game objects)'
            ) : gameObjects.map((gameObjectJSON, index) => (
                <GameObjectItem key={index} scenePath={scenePath} gameObjectJSON={gameObjectJSON} indices={[index]} />
            ))}
        </TreeView>
    );
};

export default SceneItem;