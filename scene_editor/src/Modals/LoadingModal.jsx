import React from 'react';
import Modal from './Modal.jsx';

const LoadingModal = ({ text }) => {
    return (
        <Modal title="Loading...">
            <p>{text}</p>
        </Modal>
    );
};

export default LoadingModal;