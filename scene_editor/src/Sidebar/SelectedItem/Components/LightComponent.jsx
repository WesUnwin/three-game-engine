import React from 'react';
import TreeView from '../../Hierarchy/TreeView.jsx';
import { FaTrash } from 'react-icons/fa';
import Property from '../Property.jsx';
import PropertyList from '../PropertyList.jsx';
import NumberInput from '../NumberInput.jsx';
import ColorInput from '../ColorInput.jsx';

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

const LightComponent = ({ componentJSON, onRemove }) => {
  const isValidType = componentJSON.lightType in lightProperties;

  const onChangeProperty = (field, value) => {
    //onChange({ ...light, [field]: value });
    debugger
  };

  return (
    <TreeView
      label={isValidType ? componentJSON.lightType : `(Light of invalid type: "${componentJSON.lightType}")`}
      expandOnClick={true}
      actions={[
        { icon: <FaTrash />, onClick: onRemove },  
      ]}
    >
      {isValidType && (
        <PropertyList>
          {commonProperties.concat(lightProperties[componentJSON.lightType]).map(prop => {
            const value = prop.name in componentJSON ? componentJSON[prop.name] : prop.default

            return (
              <Property key={prop.name} label={`${prop.name}:`}>
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
};

export default LightComponent;