import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { useDispatch } from 'react-redux';
import currentModalSlice from '../Redux/CurrentModalSlice.js';
import fileDataSlice from '../Redux/FileDataSlice.js';

const AddModelModal = ({ gameObjectType, scenePath, gameObjectIndices, dirHandle, existingModels }) => {
  const dispatch = useDispatch();

  const [modelFilePath, setModelFilePath] = useState(null);

  const closeModal = () => {
      dispatch(currentModalSlice.actions.closeModal());
  };

  const selectModelFile = async event => {
    event.preventDefault();
    event.stopPropagation();

    const fileHandle = await window.showOpenFilePicker({
        multiple: false,
        types: [
            {
                description: 'GLTF/GLB Model File',
                accept: {
                    "model/gltf+json": ['.gltf'],
                    "model/gltf-binary": ['.glb']
                }
            }
        ]
    })

    const path = await dirHandle.resolve(fileHandle[0]);
    if (path === null) {
        alert('The selected file must exist somewhere within the project folder');
        return;
    }
    setModelFilePath(path.join('/'));
  };

  const onSubmit = async () => {
    const newModel = {
      assetPath: modelFilePath
    };

    if (gameObjectType) {
      dispatch(fileDataSlice.actions.addModelToGameObjectType({
        gameObjectType,
        model: newModel
      }));
  
      window.postMessage({
        eventName: 'modifyGameObjectTypeInMainArea',
        gameObjectType
      });
    } else {
      const updatedModels = existingModels.concat([newModel]);

      dispatch(fileDataSlice.actions.modifyGameObject({
        scenefilePath: scenePath,
        gameObjectIndices,
        field: ['models'],
        value: updatedModels
      }));

      window.postMessage({
        eventName: 'modifyGameObjectInMainArea',
        scenePath,
        indices: gameObjectIndices,
        field: ['models'],
        value: updatedModels
      });
    }

    closeModal();
  };

  return (
    <Modal
      title="Add Scene"
      onSubmit={onSubmit}
      footer={
        <>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>

          <button type="submit" onClick={onSubmit} disabled={!modelFilePath}>
            Add Model
          </button>
        </>
      }
    >
      <div className='row'>
        <label>
          Path to .gltf/.glb file:
        </label>
        &nbsp;
        <input type="text" value={modelFilePath} disabled={true} />
        &nbsp;
        <button onClick={selectModelFile}>
            Select Model file
        </button>
      </div>
    </Modal>
  );
}

export default AddModelModal;