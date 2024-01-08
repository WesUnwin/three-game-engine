import React from 'react';
import { getCurrentModal } from './Redux/CurrentModalSlice';
import { useSelector } from 'react-redux';
import AddSceneModal from './Modals/AddSceneModal.jsx';
import EditSceneModal from './Modals/EditSceneModal.jsx';
import DeleteSceneModal from './Modals/DeleteSceneModal.jsx';
import AddGameObjectModal from './Modals/AddGameObjectModal.jsx';

const modalClasses = {
    AddSceneModal,
    EditSceneModal,
    DeleteSceneModal,
    AddGameObjectModal
};

const CurrentModal = ({ dirHandle }) => {
    const currentModal = useSelector(getCurrentModal());

    if (!currentModal.type) {
        return null;
    }

    const ModalClass = modalClasses[currentModal.type];

    if (!ModalClass) {
        throw new Error(`No modal class defined for type: ${currentModal.type} see CurrentModal.jsx`);
    }

    return (
        <ModalClass {...currentModal.params} dirHandle={dirHandle} />
    );
};

export default CurrentModal;