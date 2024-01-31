import React from 'react';
import FileWritingStatus from './FileWritingStatus.jsx';
import ShowColliders from './ShowColliders.jsx';

const StatusBar = () => {
    return (
        <div className="status-bar">
            <ShowColliders />
            <FileWritingStatus />
        </div>
    );
};

export default StatusBar;