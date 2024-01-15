import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { useDispatch, useSelector } from 'react-redux';
import fileDataSlice, { getFile } from '../Redux/FileDataSlice.js';
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

const AddColliderModal = ({ gameObjectType, sceneName, gameObjectIndices }) => {
    const dispatch = useDispatch();

    const [type, setType] = useState('cuboid');

    const gameFile = useSelector(getFile('game.json'));
    const gameObjectTypeFilePath = gameFile.data.gameObjectTypes[gameObjectType];
    const gameObjectTypeFile = useSelector(getFile(gameObjectTypeFilePath || null));

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
        const existingColliders = gameObjectTypeFile.data.rigidBody.colliders || [];
        const updatedColliders = existingColliders.concat([newCollider]);

        if (gameObjectType) {
          dispatch(fileDataSlice.actions.modifyFileData({
              path: gameObjectTypeFilePath,
              field: ['rigidBody', 'colliders'],
              value: updatedColliders
          }));
        } else {
          // TODO: support adding/editing lights directly assigned to individual GameObjects
        }

        closeModal();
    };
  
    return (
        <Modal
          title={`Add Collider to ${gameObjectType ? `GameObject Type: ${gameObjectType}` : `GameObject`}`}
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