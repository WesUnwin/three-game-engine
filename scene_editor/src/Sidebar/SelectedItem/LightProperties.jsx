import React from 'react';
import Property from './Property.jsx';
import TreeView from '../Hierarchy/TreeView.jsx';
import PropertyList from './PropertyList.jsx';
import NumberInput from './NumberInput.jsx';
import ColorInput from './ColorInput.jsx';
import { FaTrash } from 'react-icons/fa';

const commonProperties = [
  { name: 'name', type: 'text', default: '', placeholder: '(optional)' }
];

const lightProperties = {
  AmbientLight: [
    { name: 'intensity', type: 'number', default: 1.0 },
    { name: 'color', type: 'color', default: 'FFFFFF' }
  ],
  DirectionalLight: [
    { name: 'intensity', type: 'number', default: 1.0 },
    { name: 'color', type: 'color', default: 'FFFFFF' }
  ],
  HemisphereLight: [
    { name: 'intensity', type: 'number', default: 1.0 },
    { name: 'skyColor', type: 'color', default: 1.0 },
    { name: 'groundColor', type: 'color', default: 1.0 }
  ],
  PointLight: [
    { name: 'intensity', type: 'number', default: 1.0 },
    { name: 'color', type: 'color', default: 'FFFFFF' },
    { name: 'distance', type: 'number', default: 0 },
    { name: 'decay', type: 'number', default: 2 },
  ],
  RectAreaLight: [
    { name: 'intensity', type: 'number', default: 1.0 },
    { name: 'color', type: 'color', default: 'FFFFFF' },
    { name: 'width', type: 'number', default: 10 },
    { name: 'height', type: 'number', default: 10 }
  ],
  SpotLight: [
    { name: 'intensity', type: 'number', default: 1.0 },
    { name: 'color', type: 'color', default: 'FFFFFF' },
    { name: 'distance', type: 'number', default: 0 },
    { name: 'angle', type: 'number', default: 0 },
    { name: 'penumbra', type: 'number', default: 0 },
    { name: 'decay', type: 'number', default: 0 },
  ]
};

const LightProperties = ({ light, onChange, onDelete }) => {
  const isValidType = light.type in lightProperties;

  const onChangeProperty = (field, value) => {
    onChange({ ...light, [field]: value });
  };

  return (
    <TreeView
      label={isValidType ? light.type : `(Light of invalid type: "${light.type}")`}
      expandOnClick={true}
      actions={[
        { icon: <FaTrash />, onClick: onDelete },  
      ]}
    >
      {isValidType && (
        <PropertyList>
          {commonProperties.concat(lightProperties[light.type]).map(prop => {
            const value = prop.name in light ? light[prop.name] : prop.default

            return (
              <Property label={`${prop.name}:`}>
                {prop.type === 'number'? (
                  <NumberInput
                    value={value}
                    onChange={val => onChangeProperty([prop.name], val)}
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
                  />
                ) : (
                  'INVALID PROP TYPE'
                )}
              </Property>
            );
          })}
        </PropertyList>
      )}
    </TreeView>
  )
}

export default LightProperties;