import React from 'react';
import TreeView from '../Hierarchy/TreeView.jsx';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import currentModalSlice from '../../Redux/CurrentModalSlice.js';
import fileDataSlice from '../../Redux/FileDataSlice.js';

const Lights = ({ lights, gameObjectType, scenePath, gameObjectIndices }) => {
    const dispatch = useDispatch();

    const getLightLabel = light => {
        let label = '';
        for (let p in light) {
            label += `${p}: ${light[p]} `;
        }
        return label;
    }

    const openAddLightModal = () => {
        const params = {
            gameObjectType,
            scenePath,
            gameObjectIndices
        };
        dispatch(currentModalSlice.actions.openModal({ type: 'AddLightModal', params }));
    };

    const deleteLight = lightIndex => {
        if (gameObjectType) {
            dispatch(fileDataSlice.actions.removeLightFromGameObjectType({ gameObjectType, lightIndex }));
        }
    };

    return (
        <TreeView
            label="Lights:"
            expandOnClick={true}
            initiallyExpanded={true}
            actions={[
                { icon: <FaPlus />, onClick: openAddLightModal }
            ]}
        >
            {lights.map((light, index) => (
                <TreeView
                    key={index}
                    label={getLightLabel(light)}
                    actions={[
                        { icon: <FaTrash />, onClick: () => deleteLight(index) },  
                    ]}
                />
            ))}
            {lights.length === 0 ? (
                '(none)'
            ) : null}
        </TreeView>
    );
};

export default Lights;