import React from 'react';
import TreeView from '../Hierarchy/TreeView.jsx';
import { FaPlus, FaTrash } from 'react-icons/fa';

const Models = ({ models, addModel, removeModel }) => {
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
                    onClick={() => {}}
                />
            ))}
            {models.length === 0 ? (
                '(none)'
            ) : null}
        </TreeView>
    );
};

export default Models;