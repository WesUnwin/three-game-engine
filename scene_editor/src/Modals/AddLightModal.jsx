import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { useDispatch, useSelector } from 'react-redux';
import fileDataSlice, { getFile } from '../Redux/FileDataSlice.js';
import currentModalSlice from '../Redux/CurrentModalSlice.js';

const lightTypes = [
  'AmbientLight',
  'DirectionalLight',
  'HemisphereLight',
  'PointLight',
  'RectAreaLight',
  'SpotLight'
];

const AddLightModal = ({ gameObjectType, scenePath, gameObjectIndices, existingLights }) => {
    const dispatch = useDispatch();

    const [type, setType] = useState('AmbientLight');

    const gameFile = useSelector(getFile('game.json'));
    const gameObjectTypeFilePath = gameFile.data.gameObjectTypes[gameObjectType];
    const gameObjectTypeFile = useSelector(getFile(gameObjectTypeFilePath || null));

    const closeModal = () => {
        dispatch(currentModalSlice.actions.closeModal());
    };

    const onSubmit = () => {
        const newLight = { type };

        if (gameObjectType) {
          const updatedLights = (gameObjectTypeFile.data.lights || []).concat([newLight]);

          dispatch(fileDataSlice.actions.modifyFileData({
              path: gameObjectTypeFilePath,
              field: ['lights'],
              value: updatedLights
          }));

          window.postMessage({
            eventName: 'modifyGameObjectTypeInMainArea',
            gameObjectType
          });
        } else {
          const updatedLights = existingLights.concat([newLight]);

          dispatch(fileDataSlice.actions.modifyGameObject({
            scenefilePath: scenePath,
            gameObjectIndices,
            field: ['lights'],
            value: updatedLights
          }));
    
          window.postMessage({
            eventName: 'modifyGameObjectInMainArea',
            scenePath,
            indices: gameObjectIndices,
            field: ['lights'],
            value: updatedLights
          });
        }

        closeModal();
    };
  
    return (
        <Modal
          title={`Add light to ${gameObjectType ? `GameObject Type: ${gameObjectType}` : `GameObject`}`}
          onSubmit={onSubmit}
          footer={
            <>
              <button type="button" onClick={closeModal}>
                  Cancel
              </button>

              <button type="submit" onClick={onSubmit}>
                  Add Light
              </button>
            </>
          }
        >
          <div className="row">
              <label>Light Type:</label>
              &nbsp;
              <select value={type} onChange={event => setType(event.target.value)}>
                {lightTypes.map(lightType => (
                  <option key={lightType} value={lightType}>
                    {lightType}
                  </option>
                ))}
              </select>
          </div>
        </Modal>
    );
}

export default AddLightModal;