import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { useDispatch } from 'react-redux';
import fileDataSlice from '../Redux/FileDataSlice.js';
import currentModalSlice from '../Redux/CurrentModalSlice.js';

const lightTypes = [
  'AmbientLight',
  'DirectionalLight',
  'HemisphereLight',
  'PointLight',
  'RectAreaLight',
  'SpotLight'
];

const AddLightModal = ({  gameObjectType, sceneName, gameObjectIndices }) => {
    const dispatch = useDispatch();

    const [type, setType] = useState('AmbientLight');
  
    const closeModal = () => {
        dispatch(currentModalSlice.actions.closeModal());
    };

    const onSubmit = () => {
        const light = { type };

        if (gameObjectType) {
          dispatch(fileDataSlice.actions.addLightToGameObjectType({ gameObjectType, light }));
        } else {
          // TODO: support adding/editing lights directly assigned to individual GameObjects
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