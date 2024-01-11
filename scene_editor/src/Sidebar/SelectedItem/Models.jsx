import React from 'react';
import TreeView from '../Hierarchy/TreeView.jsx';
import { useDispatch } from 'react-redux';
import currentModalSlice from '../../Redux/CurrentModalSlice.js';
import { FaPlus } from 'react-icons/fa';

const Models = ({ models, gameObjectType }) => {
    const dispatch = useDispatch();

    const addModel = () => {
        dispatch(currentModalSlice.actions.openModal({
            type: 'AddModelModal',
            params: { gameObjectType }
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
            {models.map(model => (
                <TreeView key={model.assetPath} label={model.assetPath} />
            ))}
            {models.length === 0 ? (
                '(none)'
            ) : null}
        </TreeView>
    );
};

export default Models;