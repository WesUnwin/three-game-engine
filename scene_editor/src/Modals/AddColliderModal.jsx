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

const AddColliderModal = ({ gameObjectType, scenePath, gameObjectIndices, rigidBody }) => {
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

        if (gameObjectType) {
          const existingColliders = gameObjectTypeFile.data.rigidBody.colliders || [];
          const updatedColliders = existingColliders.concat([newCollider]);

          dispatch(fileDataSlice.actions.modifyFileData({
              path: gameObjectTypeFilePath,
              field: ['rigidBody', 'colliders'],
              value: updatedColliders
          }));

          window.postMessage({
            eventName: 'modifyGameObjectTypeInMainArea',
            gameObjectType
          });
        } else {
          const updatedRigidBody = JSON.parse(JSON.stringify(rigidBody));
          if (!Array.isArray(updatedRigidBody.colliders)) {
            updatedRigidBody.colliders = [];
          }
          updatedRigidBody.colliders.push(newCollider);

          dispatch(fileDataSlice.actions.modifyGameObject({
            scenefilePath: scenePath,
            gameObjectIndices,
            field: ['rigidBody'],
            value: updatedRigidBody
          }));

          window.postMessage({
            eventName: 'modifyGameObjectInMainArea',
            scenePath,
            indices: gameObjectIndices,
            field: ['rigidBody'],
            value: updatedRigidBody
          });
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