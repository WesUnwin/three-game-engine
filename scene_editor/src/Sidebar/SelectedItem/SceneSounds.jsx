import React from 'react';
import TreeView from '../Hierarchy/TreeView.jsx';
import { FaPlus } from 'react-icons/fa';
import SoundProperties from './SoundProperties.jsx';

const SceneSounds = ({ sounds, onChange, onAdd }) => {
    const onChangeSound = (soundIndex, updatedLight) => {
        const updatedSounds = [...sounds];
        updatedSounds[soundIndex] = updatedLight;
        onChange(updatedSounds);
    };

    const removeSound = index => {
        const updatedSounds = [...sounds];
        updatedSounds.splice(index, 1);
        onChange(updatedSounds);
    };

    return (
        <TreeView
            label="Sounds:"
            expandOnClick={true}
            initiallyExpanded={true}
            actions={[
                { icon: <FaPlus />, onClick: onAdd }
            ]}
        >
            {sounds.map((sound, index) => (
                <SoundProperties
                    key={index}
                    audioType="Audio"
                    sound={sound}
                    onChange={updatedSound => onChangeSound(index, updatedSound)}
                    onDelete={() => removeSound(index)}
                />
            ))}
            {sounds.length === 0 ? (
                '(none)'
            ) : null}
        </TreeView>
    );
};

export default SceneSounds;