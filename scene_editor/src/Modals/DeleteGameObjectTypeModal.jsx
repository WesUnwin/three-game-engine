import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { useDispatch } from 'react-redux';
import fileDataSlice from '../Redux/FileDataSlice.js';
import currentModalSlice from '../Redux/CurrentModalSlice.js';

const DeleteGameObjectTypeModal = ({ gameObjectType }) => {
    const dispatch = useDispatch();
    const [deleteSceneFile, setDeleteSceneFile] = useState(true);

    const closeModal = () => {
        dispatch(currentModalSlice.actions.closeModal());
    };

    const onDelete = async () => {
      dispatch(fileDataSlice.actions.deleteGameObjectType({ gameObjectType }));
      closeModal();
    };

    return (
        <Modal
            title={`Delete GameObject Type: ${gameObjectType}`}
            onSubmit={onDelete}
            footer={
                <>
                    <button type="button" onClick={closeModal}>
                        Cancel
                    </button>

                    <button type="submit" onClick={onDelete}>
                        Delete GameObject Type
                    </button>
                </>
            }
        >
          <p>This will delete this GameObject Type, its JSON file and all GameObjects of this type throughout all your scenes. Continue?</p>
        </Modal>
    );
}

export default DeleteGameObjectTypeModal;