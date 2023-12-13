import React, { useState } from 'react';

const TreeView = ({ label, children, initiallyExpanded, onClick, expandOnClick, errorMessage, isSelected }) => {
    const [expanded, setExpanded] = useState(initiallyExpanded || false);

    const onTreeViewClick = () => {
        expandOnClick ? setExpanded(!expanded) : onClick();
    };

    return (
        <div>
            <div onClick={onTreeViewClick} style={{ backgroundColor: isSelected ? 'grey' : undefined }}>
                {children &&
                    <span onClick={() => setExpanded(!expanded)}>
                        {expanded ? '-' : '+'}
                    </span>
                }

                <span>
                    {label}
                </span>

                {errorMessage ? (
                    <span style={{color: 'red', marginLeft: '10px'}}>
                        {'<=='} {errorMessage}
                    </span>
                ) : null}
            </div>            

            {children && expanded &&
                <div style={{ marginLeft: '20px' }}>
                    {children || children?.length ? children : '(none)'}
                </div>
            }            
        </div>
    );
};

export default TreeView;