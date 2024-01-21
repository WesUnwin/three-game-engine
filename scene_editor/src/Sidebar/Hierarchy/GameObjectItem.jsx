import React from 'react';
import TreeView from "./TreeView.jsx";
import { useDispatch, useSelector } from 'react-redux';
import selectedItemSlice, { getSelectedItem, selectItem } from '../../Redux/SelectedItemSlice.js';
import fileDataSlice from '../../Redux/FileDataSlice.js';
import { FaTrash } from 'react-icons/fa';

const GameObjectItem = ({ scenePath, indices, gameObjectJSON }) => {
    const dispatch = useDispatch();

    const selectedItem = useSelector(getSelectedItem());

    const compareIndices = (indicesOne, indicesTwo) => {
        if (indicesOne.length === indicesTwo.length) {
            const indicesAreSame = !indicesOne.some((idx, i) => idx !== indicesTwo[i]);
            return indicesAreSame;
        } else {
            return false;
        }
    };

    const isSelected = selectedItem &&
                       selectedItem.type === 'gameObject' &&
                       compareIndices(selectedItem.params.indices, indices);

    const onClick = () => {
        // indices is an array of numbers that identify which game object in the sceneJSON,
        // eg. [0][1] means within the 0th top-level gameObject, get the 2nd (index: 1) child GameObject
        dispatch(selectItem(scenePath, 'gameObject', { indices }));
    };

    const onDeleteClick = () => {
        dispatch(selectedItemSlice.actions.unSelectItem()); // clear as the indices of any selected game object might have changed due to deleting a game object

        const gameObjectIndices = indices;

        dispatch(fileDataSlice.actions.deleteGameObject({
            scenePath,
            gameObjectIndices
        }));

        window.postMessage({
            eventName: 'deleteGameObjectInMainArea',
            scenePath,
            gameObjectIndices
        });
    };

    let label = 'GameObject';
    if (gameObjectJSON.type && gameObjectJSON.name) {
        label = `${gameObjectJSON.name} [${gameObjectJSON.type}]`;
    } else if (gameObjectJSON.type) {
        label = gameObjectJSON.type;
    } else if (gameObjectJSON.name) {
        label = gameObjectJSON.name;
    }

    return (
        <TreeView
            label={<strong>{label}</strong>}
            onClick={onClick}
            isSelected={isSelected}
            actions={[
                { icon: <FaTrash />, onClick: onDeleteClick }
            ]}
        />
    );
};

export default GameObjectItem;