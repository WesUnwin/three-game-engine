import React from 'react';

const Panel = ({ label, children, actions, className }) => {
    return (
        <div className={"sidebar-panel" + (className ? ` ${className}` : '')}>
            <div className="sidebar-panel-header">
                <span className="sidebar-panel-label">
                    {label}
                </span>
                {(actions || []).map((action, index) => (
                    <button key={index} onClick={action.onClick}>
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