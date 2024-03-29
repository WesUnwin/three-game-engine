import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';

const TreeView = ({ icon, label, children, initiallyExpanded, onClick, expandOnClick, errorMessage, isSelected, maxChildrenHeight, onContextMenu, actions }) => {
    const [expanded, setExpanded] = useState(initiallyExpanded || false);

    const onTreeViewClick = event => {
        event.stopPropagation();
        expandOnClick ? setExpanded(!expanded) : onClick();
    };

    return (
        <div className='tree-view'>
            <div className="tree-view-header" onClick={onTreeViewClick} style={{ backgroundColor: isSelected ? 'grey' : undefined }} onContextMenu={onContextMenu}>
                {(children && !errorMessage) ? (
                    <span className="tree-view-expand-button" onClick={() => setExpanded(!expanded)}>
                        {expanded ? '-' : '+'}
                    </span>
                ) : (
                    <span className="tree-view-expand-placeholder" />
                )}

                <span className="tree-view-label">
                    {icon && <>{icon} &nbsp;</>} {label}
                </span>

                {actions ? (
                    <>
                        {actions.map((action, index) => (
                            <span key={index} onClick={event => { event.stopPropagation(); action.onClick() }}>
                                {action.icon}
                            </span>
                        ))}                    
                    </>
                ) : null}

                {errorMessage ? (
                    <div className="error-badge" data-tooltip-id="error-tooltip" data-tooltip-content={errorMessage}>
                        {'!'} <Tooltip id="error-tooltip" />
                    </div>
                ) : null}
            </div>            

            {children && expanded &&
                <div className="tree-view-children" style={{ maxHeight: maxChildrenHeight }}>
                    {children || children?.length ? children : '(none)'}
                </div>
            }  
        </div>
    );
};

export default TreeView;