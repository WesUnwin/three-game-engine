import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { useDispatch } from 'react-redux';
import currentModalSlice from '../Redux/CurrentModalSlice.js';
import fileDataSlice from '../Redux/FileDataSlice.js';

const reactComponentForComponentType = {
  'model': null
};

const AddComponentModal = ({ gameObjectType, scenePath, gameObjectIndices, dirHandle, existingComponents }) => {
  const dispatch = useDispatch();

  const [componentType, setComponentType] = useState(Object.keys(reactComponentForComponentType)[0]);
  const [componentJSON, setComponentJSON] = useState({});

  const closeModal = () => {
      dispatch(currentModalSlice.actions.closeModal());
  };

  const onSubmit = async () => {
    if (gameObjectType) {
      dispatch(fileDataSlice.actions.addComponentToGameObjectType({
        gameObjectType,
        component: componentJSON
      }));
  
      window.postMessage({
        eventName: 'modifyGameObjectTypeInMainArea',
        gameObjectType
      });
    } else {
      const updatedComponents = existingComponents.concat([componentJSON]);

      dispatch(fileDataSlice.actions.modifyGameObject({
        scenefilePath: scenePath,
        gameObjectIndices,
        field: ['components'],
        value: updatedComponents
      }));

      window.postMessage({
        eventName: 'modifyGameObjectInMainArea',
        scenePath,
        indices: gameObjectIndices,
        field: ['components'],
        value: updatedComponents
      });
    }

    closeModal();
  };

  const ReactComponent = reactComponentForComponentType[componentType];

  return (
    <Modal
      title="Add Component"
      onSubmit={onSubmit}
      footer={
        <>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>

          <button type="submit" onClick={onSubmit} disabled={true}>
            Add Component
          </button>
        </>
      }
    >
      <div className='row'>
        <select value={componentJSON?.type} onChange={event => setComponentType(event.target.value)}>
          {Object.keys(reactComponentForComponentType).map(componentType => (
            <option key={componentType} value={componentType}>
              {componentType}
            </option>
          ))}
        </select>
      </div>
      <div className="row">
        {ReactComponent &&
          <ReactComponent
            componentJSON={componentJSON}
            setComponentJSON={setComponentJSON}
          />
        }        
      </div>
    </Modal>
  );
}

export default AddComponentModal;