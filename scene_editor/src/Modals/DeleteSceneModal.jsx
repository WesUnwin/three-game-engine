import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { useDispatch, useSelector } from 'react-redux';
import fileDataSlice, { getFile } from '../Redux/FileDataSlice.js';
import currentModalSlice from '../Redux/CurrentModalSlice.js';
import { deleteFile } from '../util/FileHelpers.js';

const DeleteSceneModal = ({ sceneName, dirHandle }) => {
    const dispatch = useDispatch();
    const [deleteSceneFile, setDeleteSceneFile] = useState(true);

    const gameFileData = useSelector(getFile('game.json'));

    const closeModal = () => {
        dispatch(currentModalSlice.actions.closeModal());
    };

    const onDelete = () => {
        if (deleteSceneFile) {
            const gameJSON = gameFileData.data;
            const sceneFilePath = gameJSON.scenes[sceneName];
            deleteFile(dirHandle, sceneFilePath);
        }
        dispatch(fileDataSlice.actions.removeScene({ sceneName }));
        closeModal();
    };

    return (
        <Modal
            title={`Delete Scene: ${sceneName}`}
            onSubmit={onDelete}
            footer={
                <>
                    <button type="button" onClick={closeModal}>
                        Cancel
                    </button>

                    <button type="submit" onClick={onDelete}>
                        Delete Scene
                    </button>
                </>
            }
        >
            <p>The reference to this scene in your game.json file will be removed.</p>
            
            <div className="row">
                <input type="checkbox" checked={deleteSceneFile} onChange={() => setDeleteSceneFile(!deleteSceneFile)} />
                <p>Also delete the scene's JSON file.</p>
            </div>
        </Modal>
    );
}

export default DeleteSceneModal;