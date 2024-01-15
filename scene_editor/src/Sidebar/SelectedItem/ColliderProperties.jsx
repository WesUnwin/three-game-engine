import React from 'react';
import Property from './Property.jsx';
import TreeView from '../Hierarchy/TreeView.jsx';
import PropertyList from './PropertyList.jsx';
import NumberInput from './NumberInput.jsx';
import { FaTrash } from 'react-icons/fa';
import colliderProperties from '../../RapierColliderProps.js';

const commonProperties = [
  { name: 'density', type: 'number', default: 1.0 },
  { name: 'friction', type: 'number', default: 0.5 },
  { name: 'sensor', type: 'boolean', default: false }
];

const ColliderProperties = ({ collider, onChange, onDelete }) => {
  const isValidType = collider.type in colliderProperties;

  const onChangeProperty = (field, value) => {
    onChange({ ...collider, [field]: value });
  };

  return (
    <TreeView
      label={isValidType ? collider.type : `(collider of invalid type: "${collider.type}")`}
      expandOnClick={true}
      actions={[
        { icon: <FaTrash />, onClick: onDelete },  
      ]}
    >
      {isValidType && (
        <PropertyList>
          {commonProperties.concat(colliderProperties[collider.type]).map(prop => {
            const value = prop.name in collider ? collider[prop.name] : prop.default;

            return (
              <Property label={`${prop.name}:`}>
                {prop.type === 'number'? (
                  <NumberInput
                    value={value}
                    onChange={val => onChangeProperty([prop.name], val)}
                  />
                ) : prop.type === 'boolean' ? (
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={event => onChangeProperty([prop.name], event.target.value)}
                  />
                ) : (
                  `INVALID PROP TYPE: "${prop.type}"`
                )}
              </Property>
            );
          })}
        </PropertyList>
      )}
    </TreeView>
  )
}

export default ColliderProperties;