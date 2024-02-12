import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { useDispatch, useSelector } from 'react-redux';
import currentModalSlice from '../Redux/CurrentModalSlice.js';
import fileDataSlice, { getFile } from '../Redux/FileDataSlice.js';

const AddSoundModal = ({ gameObjectType, scenePath, gameObjectIndices, dirHandle, existingSounds }) => {
  const dispatch = useDispatch();

  const gameFile = useSelector(getFile('game.json'));
  const gameObjectTypeFilePath = gameFile.data.gameObjectTypes[gameObjectType];

  const [name, setName] = useState(`sound_${existingSounds.length}`);
  const [soundFilePath, setSoundFilePath] = useState(null);

  const closeModal = () => {
      dispatch(currentModalSlice.actions.closeModal());
  };

  const selectSoundFile = async event => {
    event.preventDefault();
    event.stopPropagation();

    const fileHandle = await window.showOpenFilePicker({
        multiple: false,
        types: [
            {
                description: 'Sound File',
                accept: {
                    "audio/x-wav": ['.wav'],
                    "audio/mpeg": ['.mp3'],
                    "application/ogg": ['.ogg'],
                    "audio/x-aiff": ['.aifc'],
                    "audio/x-aiff": ['.aiff'],
                }
            }
        ]
    })

    const path = await dirHandle.resolve(fileHandle[0]);
    if (path === null) {
        alert('The selected file must exist somewhere within the project folder');
        return;
    }
    setSoundFilePath(path.join('/'));
  };

  const nameIsBlank = /^\s*$/.test(name)
  const disabled = nameIsBlank || !soundFilePath;

  const onSubmit = async () => {
    if (disabled) {
        return;
    }

    const newSound = {
      name,
      assetPath: soundFilePath
    };

    const updatedSounds = existingSounds.concat([newSound]);

    if (gameObjectType) {
        dispatch(fileDataSlice.actions.modifyFileData({
            path: gameObjectTypeFilePath,
            field: ['sounds'],
            value: updatedSounds
        }));

        window.postMessage({
            eventName: 'modifyGameObjectTypeInMainArea',
            gameObjectType
        });
    } else {
      dispatch(fileDataSlice.actions.modifyGameObject({
        scenefilePath: scenePath,
        gameObjectIndices,
        field: ['sounds'],
        value: updatedSounds
      }));

      window.postMessage({
        eventName: 'modifyGameObjectInMainArea',
        scenePath,
        indices: gameObjectIndices,
        field: ['sounds'],
        value: updatedSounds
      });
    }

    closeModal();
  };

  let title = 'Add Sound';
  if (gameObjectType) {
    title = `Add Sound to GameObject Type: ${gameObjectType}`
  } else if (gameObjectIndices) {
    title = `Add Sound to GameObject`
  }

  return (
    <Modal
      title={title}
      onSubmit={onSubmit}
      footer={
        <>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>

          <button type="submit" onClick={onSubmit} disabled={disabled}>
            Add Sound
          </button>
        </>
      }
    >
      <div className='row'>
        <label>
          Name:
        </label>
        &nbsp;
        <input type="text" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <br />
      <div className='row'>
        <label>
          Path to sound file:
        </label>
        &nbsp;
        <input type="text" value={soundFilePath} disabled={true} />
        &nbsp;
        <button onClick={selectSoundFile}>
            Select sound file
        </button>
      </div>
    </Modal>
  );
}

export default AddSoundModal;