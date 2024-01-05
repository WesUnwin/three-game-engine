import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { useDispatch } from 'react-redux';
import fileDataSlice from '../Redux/FileDataSlice.js';
import currentModalSlice from '../Redux/CurrentModalSlice.js';

const EditSceneModal = ({ sceneName }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState(sceneName);

    const onChange = event => {
        setName(event.target.value);
    };

    const closeModal = () => {
        dispatch(currentModalSlice.actions.closeModal());
    };

    const onSave = () => {
        dispatch(fileDataSlice.actions.renameScene({ sceneName, newSceneName: name }));
        closeModal();
    };

    const nameIsValid = name.trim().length > 0 && name !== sceneName;

    return (
        <Modal
            title={`Edit Scene: ${sceneName}`}
            onSubmit={onSave}
            footer={
                <>
                    <button type="button" onClick={closeModal}>
                        Cancel
                    </button>

                    <button type="submit" onClick={onSave} disabled={!nameIsValid}>
                        Save
                    </button>
                </>
            }
        >
            <div className='row'>
                <label>
                    Scene name:
                </label>
                &nbsp;
                <input type="text" value={name} onChange={onChange} />
            </div>
        </Modal>
    );
}

export default EditSceneModal;