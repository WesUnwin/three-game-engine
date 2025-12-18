import React from 'react';
import TreeView from '../../Hierarchy/TreeView.jsx';
import PropertyGroup from '../PropertyGroup.jsx';
import ColliderProperties from '../ColliderProperties.jsx';
import { FaPlus, FaTrash } from 'react-icons/fa';
import currentModalSlice from '../../../Redux/CurrentModalSlice.js';
import { useDispatch } from 'react-redux';

const rigidBodyTypes = [
  'fixed',
  'dynamic',
  'kinematicPositionBased',
  'kinematicVelocityBased'
];

const RigidBodyComponent = ({ componentJSON, onChange, onRemove}) => {
  const dispatch = useDispatch();

  const colliders = componentJSON?.colliders || [];

  const changeProperty = (field, value) => {
    const newComponentJSON = JSON.parse(JSON.stringify(componentJSON));

    let subObject = newComponentJSON;
    for (let i = 0; i<field.length; i++) {
      if (i === field.length - 1) {
        subObject[field[i]] = value;
      } else {
        if (!(field[i] in subObject)) {
          subObject[field[i]] = {};
        }
        subObject = subObject[field[i]];
      }
    }

    onChange(newComponentJSON);
  };

  const onRigidBodyTypeChange = event => {
    changeProperty(['type'], event.target.value);
  };

  const addCollider = () => {
    window.onAddCollider = (newCollider) => {
      const updatedColliders = [...colliders];
      updatedColliders.push(newCollider);
      changeProperty(['colliders'], updatedColliders);
    };

    dispatch(currentModalSlice.actions.openModal({
      type: 'AddColliderModal'
    }));
  };

  const onChangeCollider = (colliderIndex, updatedCollider) => {
    const updatedColliders = [...colliders];
    updatedColliders[colliderIndex] = updatedCollider;
    changeProperty(['colliders'], updatedColliders);
  };

  const deleteCollider = colliderIndex => {
    const updatedColliders = [...colliders];
    updatedColliders.splice(colliderIndex, 1);
    changeProperty(['colliders'], updatedColliders);
  };

  return (
      <TreeView
        label="RigidBody:"
        expandOnClick={true}
        initiallyExpanded={true}
        actions={[
          { icon: <FaTrash />, onClick: onRemove }
        ]}
      >
        <div style={{ marginLeft: '10px' }}>
          <div className="row">
            <span>Type: &nbsp;</span>
            <select value={componentJSON.rigidBodyType || 'fixed'} onChange={onRigidBodyTypeChange}>
              {rigidBodyTypes.map(bodyType => (
                <option
                  key={bodyType}
                  value={bodyType}
                  onChange={() => { /* Needed to prevent a react warning, even though select element onChange is set */ }}
                >
                  {bodyType}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="row" style={{ justifyContent: 'space-around' }}>
              <PropertyGroup label="Enabled Translations:">
                {['x', 'y', 'z'].map(axis => {
                  let isChecked = true;
                  if (('enabledTranslations' in componentJSON) && (axis in componentJSON.enabledTranslations)) {
                      isChecked = componentJSON.enabledTranslations[axis];
                  }
                  return (
                      <span key={axis}>
                          <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => changeProperty(['enabledTranslations', axis], !isChecked)}
                          />
                          {axis} &nbsp;
                      </span>
                  );
                })}
              </PropertyGroup>
              <PropertyGroup label="Enabled Rotations:">
                {['x', 'y', 'z'].map(axis => {
                  let isChecked = true;
                  if (('enabledRotations' in componentJSON) && (axis in componentJSON.enabledRotations)) {
                    isChecked = componentJSON.enabledRotations[axis];
                  }
                  return (
                    <span key={axis}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => changeProperty(['enabledRotations', axis], !isChecked)}
                      />
                      {axis} &nbsp;
                    </span>
                  );
                })}
              </PropertyGroup>
            </div>

            <TreeView
              label="Colliders:"
              expandOnClick={true}
              initiallyExpanded={true}
              actions={[
                { icon: <FaPlus />, onClick: addCollider }
              ]}
            >
              {colliders.map((collider, index) => (
                <ColliderProperties
                  key={index}
                  collider={collider}
                  onChange={updatedCollider => onChangeCollider(index, updatedCollider)}
                  onDelete={() => deleteCollider(index)}
                />
              ))}
              {colliders.length === 0 ? (
                '(none)'
              ) : null}
            </TreeView>
          </div>
        </div>
      </TreeView>
    );
};

export default RigidBodyComponent;