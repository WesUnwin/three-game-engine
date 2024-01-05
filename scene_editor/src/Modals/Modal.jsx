import React from 'react';

const Modal = ({ title, children, footer, onSubmit }) => {
    const onFormSubmit = event => {
        event.preventDefault();
        if (onSubmit) {
            onSubmit();
        }
    };

    return (
        <div className="modal">
            <form onSubmit={onFormSubmit}>
                <div className="modal-header">
                    {title}
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    {footer}
                </div>
            </form>
        </div>
    );
};

export default Modal;