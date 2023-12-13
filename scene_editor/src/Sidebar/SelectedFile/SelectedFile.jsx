import React from 'react';
import Panel from '../Panel.jsx';
import { useSelector } from 'react-redux';
import { getSelectedItem } from '../../Redux/SelectedItemSlice.js';
import { getFile } from '../../Redux/FileDataSlice.js';

const SelectedFile = () => {
    const selectedItem = useSelector(getSelectedItem());
    const selectedFile = useSelector(getFile(selectedItem?.filePath));

    if (!selectedItem) {
        return null; // nothing currently selected
    }

    return (
        <Panel label="Selected File">
            {JSON.stringify(selectedFile)}            
        </Panel>
    );
};

export default SelectedFile;