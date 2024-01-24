import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { useDispatch } from 'react-redux';
import currentModalSlice from '../Redux/CurrentModalSlice.js';
import fileDataSlice from '../Redux/FileDataSlice.js';

const AddModelModal = ({ gameObjectType, dirHandle }) => {
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
    dispatch(fileDataSlice.actions.addModelToGameObjectType({
      gameObjectType,
      model: {
        assetPath: modelFilePath
      }
    }));

    window.postMessage({
      eventName: 'modifyGameObjectTypeInMainArea',
      gameObjectType
    });
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