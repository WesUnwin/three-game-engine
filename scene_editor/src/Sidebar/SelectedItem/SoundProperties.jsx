import React from 'react';
import Property from './Property.jsx';
import TreeView from '../Hierarchy/TreeView.jsx';
import PropertyList from './PropertyList.jsx';
import NumberInput from './NumberInput.jsx';
import ColorInput from './ColorInput.jsx';
import { FaTrash } from 'react-icons/fa';

const commonProperties = [
  { name: 'assetPath', type: 'text', default: '', disabled: true },
  { name: 'loop', type: 'boolean', default: false },
  { name: 'autoplay', type: 'boolean', default: false },
  { name: 'volume', type: 'number', default: 1.0 },
  { name: 'playbackRate', type: 'number', default: 1 }
];

const positionalAudioProperties = [
  { name: 'refDistance', type: 'number', default: 1 },
  { name: 'rolloffFactor', type: 'number', default: 1 },
  { name: 'distanceModel', type: 'text', default: 'linear' },
  { name: 'maxDistance', type: 'number', default: 10000 }
];

const GameObjectSoundProperties = ({ audioType, sound, onChange, onDelete }) => {
  const onChangeProperty = (field, value) => {
    onChange({ ...sound, [field]: value });
  };

  const audioTypeProperties = {
    Audio: commonProperties,
    PositionalAudio: commonProperties.concat(positionalAudioProperties)
  }

  const properties = audioTypeProperties[audioType];

  if (!properties) {
    throw new Error(`SoundProperties: invalid audioType: ${audioType}`);
  }

  return (
    <TreeView
      label={sound.name}
      expandOnClick={true}
      actions={[
        { icon: <FaTrash />, onClick: onDelete },  
      ]}
    >
        <PropertyList>
            {properties.map(prop => {
                const value = prop.name in sound ? sound[prop.name] : prop.default

                return (
                    <Property key={prop.name} label={`${prop.name}:`}>
                    {prop.type === 'number' ? (
                        <NumberInput
                            value={value}
                            onChange={val => onChangeProperty([prop.name], val)}
                        />
                    ) : prop.type === 'boolean' ? (
                        <input
                            type="checkbox"
                            checked={value}
                            onChange={() => onChangeProperty([prop.name], !value)}
                        />
                    ) : prop.type === 'color' ? (
                        <ColorInput
                            value={value}
                            onChange={val => onChangeProperty([prop.name], val)}
                        />
                    ) : prop.type === 'text' ? (
                        <input
                            type="text"
                            value={value}
                            placeholder={prop.placeholder}
                            onChange={event => onChangeProperty([prop.name], event.target.value)}
                            disabled={typeof prop.disabled === 'boolean' ? prop.disabled : false}
                        />
                    ) : (
                        'INVALID PROP TYPE'
                    )}
                    </Property>
                );
            })}
        </PropertyList>
    </TreeView>
  )
}

export default GameObjectSoundProperties;