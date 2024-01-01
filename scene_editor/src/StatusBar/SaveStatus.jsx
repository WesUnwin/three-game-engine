import React from 'react';
import { useSelector } from 'react-redux';
import { getFileBeingSaved, getModifiedFileCount } from '../Redux/FileDataSlice';

const SaveStatus = () => {
    const fileBeingSaved = useSelector(getFileBeingSaved());
    const modifiedFileCount = useSelector(getModifiedFileCount());

    return (
        <div className="save-status">
            {fileBeingSaved ? (
                `Saving ${fileBeingSaved}...`
            ) : modifiedFileCount === 0 ? (
                'All changes saved'
            ) : (
                `${modifiedFileCount} file(s) modified`
            )}
        </div>
    );
};

export default SaveStatus;