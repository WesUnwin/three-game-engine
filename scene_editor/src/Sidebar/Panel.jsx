import React from 'react';

const Panel = ({ label, children }) => {
    return (
        <div className="sidebar-panel">
            <h5>{label}</h5>
            <div className="sidebar-panel-content">
                {children}            
            </div>
        </div>
    );
};

export default Panel;