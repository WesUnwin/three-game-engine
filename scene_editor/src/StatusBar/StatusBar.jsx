import React from 'react';
import FileWritingStatus from './FileWritingStatus.jsx';

const StatusBar = () => {
    return (
        <div className="status-bar">
            <FileWritingStatus />
        </div>
    );
};

export default StatusBar;