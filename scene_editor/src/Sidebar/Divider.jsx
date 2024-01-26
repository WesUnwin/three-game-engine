import React from 'react';

const Divider = ({ label }) => {
    return (
        <div className="divider">
            <div className="divider-line" />
            <div className="divider-label">
                {label}
            </div>
            <div className="divider-line" />
        </div>
    );
};

export default Divider;