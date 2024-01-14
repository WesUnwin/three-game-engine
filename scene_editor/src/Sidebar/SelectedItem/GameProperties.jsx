import React from 'react';
import { useDispatch } from 'react-redux';
import fileDataSlice from '../../Redux/FileDataSlice';
import PropertyList from './PropertyList.jsx';
import Property from './Property.jsx';

const GameProperties = ({ gameJSON }) => {
    const dispatch = useDispatch();

    const sceneOptions = Object.keys(gameJSON.scenes || []);

    const onInitialSceneChange = event => {
        const action = fileDataSlice.actions.modifyFileData({
            path: 'game.json',
            field: ['initialScene'],
            value: event.target.value
        });
        dispatch(action);
    };

    return (
        <PropertyList>
            <Property label="Initial Scene:">
                <select value={gameJSON.initialScene || null} onChange={onInitialSceneChange}>
                    {sceneOptions.map(sceneName => (
                        <option key={sceneName} value={sceneName}>{sceneName}</option>
                    ))}                    
                </select>
            </Property>
        </PropertyList>
    )
};

export default GameProperties;