import React from 'react';
import { useSelector } from 'react-redux';
import { getCurrentFileOperation, getModifiedFileCount, getFilesToBeDeletedCount } from '../Redux/FileDataSlice';

const FileWritingStatus = () => {
    const currentFileOperation = useSelector(getCurrentFileOperation());
    const modifiedFileCount = useSelector(getModifiedFileCount());
    const filesToBeDeletedCount = useSelector(getFilesToBeDeletedCount());

    return (
        <div className="status-bar-item">
            {currentFileOperation ? (
                currentFileOperation
            ) : (modifiedFileCount === 0 && filesToBeDeletedCount == 0) ? (
                'All changes saved'
            ) : (
                `${modifiedFileCount} file(s) modified, ${filesToBeDeletedCount} file(s) to be deleted...`
            )}
        </div>
    );
};

export default FileWritingStatus;