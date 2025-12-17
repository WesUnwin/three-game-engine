import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { useDispatch } from 'react-redux';
import currentModalSlice from '../Redux/CurrentModalSlice.js';
import { commonProperties, colliderProperties } from '../RapierColliderProps.js';

const colliderTypes = [
  'ball',
  'capsule',
  'cone',
  'cuboid',
  'cylinder',
  'roundCone',
  'roundCylinder'
];

const AddColliderModal = () => {
    const dispatch = useDispatch();

    const [type, setType] = useState('cuboid');

    const closeModal = () => {
        dispatch(currentModalSlice.actions.closeModal());
    };

    const onSubmit = () => {
        const newCollider = {
          type
        };
        commonProperties.concat(colliderProperties[type]).forEach(prop => {
          newCollider[prop.name] = prop.default;
        });

        window.onAddCollider(newCollider);

        closeModal();
    };
  
    return (
        <Modal
          title={`Add Collider to RigidBody`}
          onSubmit={onSubmit}
          footer={
            <>
              <button type="button" onClick={closeModal}>
                  Cancel
              </button>

              <button type="submit" onClick={onSubmit}>
                  Add Collider
              </button>
            </>
          }
        >
          <div className="row">
              <label>Collider Type:</label>
              &nbsp;
              <select value={type} onChange={event => setType(event.target.value)}>
                {colliderTypes.map(colliderType => (
                  <option key={colliderType} value={colliderType}>
                    {colliderType}
                  </option>
                ))}
              </select>
          </div>
        </Modal>
    );
}

export default AddColliderModal;