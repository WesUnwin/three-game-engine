import React, { useEffect } from 'react';
import TreeView from "./TreeView.jsx";
import * as FileHelpers from '../../util/FileHelpers.js'
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedItem, selectItem } from '../../Redux/SelectedItemSlice.js';
import currentModalSlice from '../../Redux/CurrentModalSlice.js'
import { FaTrash } from 'react-icons/fa';

const GameObjectTypeItem = ({ dirHandle, gameObjectType, filePath }) => {
    const dispatch = useDispatch();

    const selectedItem = useSelector(getSelectedItem());

    const isSelected = selectedItem &&
                       selectedItem.type === 'gameObjectTypeJSON' &&
                       selectedItem.params.type === gameObjectType;

    useEffect(() => {
        FileHelpers.loadFile(dirHandle, filePath, dispatch, { type: 'gameObjectTypeJSON' })
    }, [filePath]);

    const onClick = () => {
        dispatch(selectItem('game.json', 'gameObjectTypeJSON', { type: gameObjectType }));
    };

    const onDelete = () => {
        dispatch(currentModalSlice.actions.openModal({ type: 'DeleteGameObjectTypeModal', params: { gameObjectType } }));
    };

    return (
        <TreeView
            label={gameObjectType}
            onClick={onClick}
            isSelected={isSelected}
            actions={[
                { icon: <FaTrash />, onClick: onDelete }
            ]}
        />
    );
};

export default GameObjectTypeItem;