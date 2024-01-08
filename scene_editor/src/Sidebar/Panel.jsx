import React from 'react';

const Panel = ({ label, children, actions }) => {
    return (
        <div className="sidebar-panel">
            <div className="sidebar-panel-header">
                <span className="sidebar-panel-label">
                    {label}
                </span>
                {(actions || []).map(action => (
                    <button onClick={action.onClick}>
                        {action.label || action.icon}
                    </button>
                ))}
            </div>
            <div className="sidebar-panel-content">
                {children}            
            </div>
        </div>
    );
};

export default Panel;