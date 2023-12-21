import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';

const TreeView = ({ label, children, initiallyExpanded, onClick, expandOnClick, errorMessage, isSelected, maxChildrenHeight }) => {
    const [expanded, setExpanded] = useState(initiallyExpanded || false);

    const onTreeViewClick = () => {
        expandOnClick ? setExpanded(!expanded) : onClick();
    };

    return (
        <div className='tree-view'>
            <div className="tree-view-header" onClick={onTreeViewClick} style={{ backgroundColor: isSelected ? 'grey' : undefined }}>
                {(children && !errorMessage) ? (
                    <span className="tree-view-expand-button" onClick={() => setExpanded(!expanded)}>
                        {expanded ? '-' : '+'}
                    </span>
                ) : (
                    <span className="tree-view-expand-placeholder" />
                )}

                <span className="tree-view-label">
                    {label}
                </span>

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