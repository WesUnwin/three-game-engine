import React from 'react';
import FileWritingStatus from './FileWritingStatus.jsx';
import ShowColliders from './ShowColliders.jsx';
import ShowGrid from './ShowGrid.jsx';

const StatusBar = () => {
    return (
        <div className="status-bar">
            <ShowGrid />
            <ShowColliders />
            <FileWritingStatus />
        </div>
    );
};

export default StatusBar;