import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { useDispatch } from 'react-redux';
import fileDataSlice from '../Redux/FileDataSlice.js';
import currentModalSlice from '../Redux/CurrentModalSlice.js';
import selectedItemsSlice from '../Redux/SelectedItemSlice.js';

const DeleteSceneModal = ({ sceneName }) => {
    const dispatch = useDispatch();
    const [deleteSceneFile, setDeleteSceneFile] = useState(true);

    const closeModal = () => {
        dispatch(currentModalSlice.actions.closeModal());
    };

    const onDelete = async () => {
        dispatch(selectedItemsSlice.actions.unSelectItem());
        dispatch(fileDataSlice.actions.removeScene({ sceneName, deleteFile: deleteSceneFile }));
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