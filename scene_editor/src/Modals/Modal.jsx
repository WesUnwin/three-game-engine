import React from 'react';

const Modal = ({ title, children, footer }) => {
    return (
        <div className="modal">
            <div className="modal-header">
                {title}
            </div>
            <div className="modal-body">
                {children}
            </div>
            <div className="modal-footer">
                {footer}
            </div>
        </div>
    );
};

export default Modal;