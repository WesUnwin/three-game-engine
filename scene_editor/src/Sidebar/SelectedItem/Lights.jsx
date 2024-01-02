import React from 'react';
import TreeView from '../Hierarchy/TreeView.jsx';

const Lights = ({ lights }) => {
    const getLightLabel = light => {
        let label = '';
        for (let p in light) {
            label += `${p}: ${light[p]} `;
        }
        return label;
    }

    return (
        <TreeView label="Lights:" expandOnClick={true} initiallyExpanded={true}>
            {lights.map((light, index) => (
                <TreeView key={index} label={getLightLabel(light)} />
            ))}
            {lights.length === 0 ? (
                '(none)'
            ) : null}
        </TreeView>
    );
};

export default Lights;