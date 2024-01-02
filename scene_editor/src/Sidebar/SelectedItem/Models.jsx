import React from 'react';
import TreeView from '../Hierarchy/TreeView.jsx';

const Models = ({ models }) => {
    return (
        <TreeView label="Models:" expandOnClick={true} initiallyExpanded={true}>
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