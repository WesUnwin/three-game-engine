import React from 'react';
import currentModalSlice, { getCurrentModal } from './Redux/CurrentModalSlice';
import { useSelector } from 'react-redux';
import AddSceneModal from './Modals/AddSceneModal.jsx';

const modalClasses = {
    AddSceneModal: AddSceneModal
};

const CurrentModal = () => {
    const currentModal = useSelector(getCurrentModal());

    if (!currentModal.type) {
        return null;
    }

    const ModalClass = modalClasses[currentModal.type];

    return (
        <ModalClass {...currentModal.params} />
    );
};

export default CurrentModal;