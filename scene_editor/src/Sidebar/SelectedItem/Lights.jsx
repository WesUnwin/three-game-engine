import React from 'react';
import TreeView from '../Hierarchy/TreeView.jsx';
import { FaPlus } from 'react-icons/fa';
import LightProperties from './LightProperties.jsx';

const Lights = ({ lights, onChange, onAdd }) => {
    const onChangeLight = (lightIndex, updatedLight) => {
        const updatedLights = [...lights];
        updatedLights[lightIndex] = updatedLight;
        onChange(updatedLights);
    };

    const deleteLight = lightIndex => {
        const updatedLights = [...lights];
        updatedLights.splice(lightIndex, 1);
        onChange(updatedLights);
    };

    return (
        <TreeView
            label="Lights:"
            expandOnClick={true}
            initiallyExpanded={true}
            actions={[
                { icon: <FaPlus />, onClick: onAdd }
            ]}
        >
            {lights.map((light, index) => (
                <LightProperties
                    key={index}
                    light={light}
                    onChange={updatedLight => onChangeLight(index, updatedLight)}
                    onDelete={() => deleteLight(index)}
                />
            ))}
            {lights.length === 0 ? (
                '(none)'
            ) : null}
        </TreeView>
    );
};

export default Lights;