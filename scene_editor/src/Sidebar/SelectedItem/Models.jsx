import React from 'react';
import TreeView from '../Hierarchy/TreeView.jsx';
import { useDispatch } from 'react-redux';
import currentModalSlice from '../../Redux/CurrentModalSlice.js';
import { FaPlus, FaTrash } from 'react-icons/fa';
import fileDataSlice from '../../Redux/FileDataSlice.js';

const Models = ({ models, gameObjectType }) => {
    const dispatch = useDispatch();

    const addModel = () => {
        dispatch(currentModalSlice.actions.openModal({
            type: 'AddModelModal',
            params: { gameObjectType }
        }));
    };

    const removeModel = modelIndex => {
        dispatch(fileDataSlice.actions.removeModelFromGameObjectType({
            gameObjectType,
            modelIndex
        }));
    };

    return (
        <TreeView
            label="Models:"
            expandOnClick={true}
            initiallyExpanded={true}
            actions={[
                { icon: <FaPlus />, onClick: addModel }
            ]}
        >
            {models.map((model, index) => (
                <TreeView
                    key={model.assetPath}
                    label={model.assetPath}
                    actions={[
                        { icon: <FaTrash />, onClick: () => removeModel(index) }
                    ]}
                />
            ))}
            {models.length === 0 ? (
                '(none)'
            ) : null}
        </TreeView>
    );
};

export default Models;