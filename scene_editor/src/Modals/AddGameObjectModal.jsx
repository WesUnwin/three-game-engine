import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { useDispatch, useSelector } from 'react-redux';
import fileDataSlice, { getFile } from '../Redux/FileDataSlice.js';
import currentModalSlice from '../Redux/CurrentModalSlice.js';

const AddGameObjectModal = ({ sceneName }) => {
    const dispatch = useDispatch();

    const gameFile = useSelector(getFile('game.json'));
    const gameObjectTypes = Object.keys(gameFile.data.gameObjectTypes || {});

    const [name, setName] = useState('');
    const [type, setType] = useState(gameObjectTypes[0] || null);

    const closeModal = () => {
        dispatch(currentModalSlice.actions.closeModal());
    };

    const onSubmit = () => {
        const scenePath = gameFile.data.scenes[sceneName];
        const gameObject = {
           name,
           type
        };

        window.postMessage({
            eventName: 'addGameObjectToMainArea',
            scenePath,
            gameObject
        });

        dispatch(fileDataSlice.actions.createGameObject({ scenePath, gameObject }));
        closeModal();
    };

    return (
        <Modal
            title={`Add Game Object to Scene: ${sceneName}`}
            onSubmit={onSubmit}
            footer={
                <>
                    <button type="button" onClick={closeModal}>
                        Cancel
                    </button>

                    <button type="submit" onClick={onSubmit}>
                        Create Game Object
                    </button>
                </>
            }
        >           
            <div className="row">
                <label>Name:</label>
                &nbsp;
                <input type="text" placeholder="(optional)" value={name} onChange={event => setName(event.target.value)} />
            </div>
            <br />

            <div className="row">
                <label>Type:</label>
                &nbsp;
                <select value={type} onChange={event => setType(event.target.value)}>
                   {gameObjectTypes.map(gameObjectType => (
                      <option key={gameObjectType} value={gameObjectType}>
                        {gameObjectType}
                      </option>
                   ))}
                </select>
            </div>
        </Modal>
    );
}

export default AddGameObjectModal;