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

const SelectedItem = ({ dirHandle }) => {
    const selectedItem = useSelector(getSelectedItem());
    const selectedFile = useSelector(getFile(selectedItem?.filePath));

    if (!selectedItem) {
        return null; // nothing currently selected
    }

    const getLabel = () => {
        switch (selectedItem.type) {
            case 'gameJSON':
                return 'Game Properties:';
            case 'gameObjectTypeJSON':
                return `GameObject Type: ${selectedItem.params.type}`;
            case 'sceneJSON':
                return `Selected Scene: ${selectedItem.params.name}`;
            case 'gameObject':
                return `Selected GameObject:`;
            default:
                return 'Unknown Selection Type';
        }
    };

    return (
        <Panel label={getLabel()}>
            {selectedItem.type === 'gameJSON' ? (
                <GameProperties gameJSON={selectedFile.data} />
            ) : selectedItem.type === 'gameObjectTypeJSON' ? (
                <GameObjectTypeProperties type={selectedItem.params.type} dirHandle={dirHandle} />
            ) : selectedItem.type === 'sceneJSON' ? (
                <SceneProperties sceneName={selectedItem.params.name} filePath={selectedItem.filePath} sceneJSON={selectedFile.data} />
            ) : selectedItem.type === 'gameObject' ? (
                <GameObjectProperties filePath={selectedItem.filePath} sceneJSON={selectedFile.data} indices={selectedItem.params.indices} dirHandle={dirHandle} />
            ) : (
                `(Error no component configured to display seleted items of type: ${selectedItem.type})`
            )}       
        </Panel>
    );
};

export default SelectedItem;