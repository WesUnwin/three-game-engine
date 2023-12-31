import React from 'react';
import Panel from '../Panel.jsx';
import { useSelector } from 'react-redux';
import { getSelectedItem } from '../../Redux/SelectedItemSlice.js';
import { getFile } from '../../Redux/FileDataSlice.js';
import GameObjectProperties from './GameObjectProperties.jsx';
import SceneProperties from './SceneProperties.jsx';
import GameProperties from './GameProperties.jsx';
import GameObjectTypeProperties from './GameObjectTypeProperties.jsx';

const displayType = {
    gameJSON: 'Game Properties:',
    gameObjectTypeJSON: 'GameObject Type Properties:',
    sceneJSON: 'Scene Properties:',
    gameObject: 'GameObject Properties:'   
};

const SelectedItem = () => {
    const selectedItem = useSelector(getSelectedItem());
    const selectedFile = useSelector(getFile(selectedItem?.filePath));

    if (!selectedItem) {
        return null; // nothing currently selected
    }

    return (
        <Panel label={displayType[selectedItem.type]}>
            {selectedItem.type === 'gameJSON' ? (
                <GameProperties gameJSON={selectedFile.data} />
            ) : selectedItem.type === 'gameObjectTypeJSON' ? (
                <GameObjectTypeProperties type={selectedItem.params.type} />
            ) : selectedItem.type === 'sceneJSON' ? (
                <SceneProperties sceneJSON={selectedFile.data} />
            ) : selectedItem.type === 'gameObject' ? (
                <GameObjectProperties filePath={selectedItem.filePath} sceneJSON={selectedFile.data} indices={selectedItem.params.indices} />
            ) : (
                `(Error no component configured to display seleted items of type: ${selectedItem.type})`
            )}       
        </Panel>
    );
};

export default SelectedItem;