import React from 'react';
import PropertyGroup from './PropertyGroup.jsx';
import { useDispatch } from 'react-redux';
import fileDataSlice from '../../Redux/FileDataSlice.js';
import PropertyList from './PropertyList.jsx';

const SceneProperties = ({ sceneName, filePath, sceneJSON }) => {
    const dispatch = useDispatch();

    const onSceneNameChange = event => {
        const newSceneName = event.target.value;
        if (newSceneName.length > 0) {
            dispatch(fileDataSlice.actions.renameScene({ sceneName, newSceneName }));
        }
    };

    return (
        <PropertyList>
            <PropertyGroup label="Name:">
                <input type="text" value={sceneName} onChange={onSceneNameChange} />
            </PropertyGroup>  

            <PropertyGroup label="File:">
                <input type="text" defaultValue={filePath} readOnly disabled />
            </PropertyGroup>
        </PropertyList>
    );
};

export default SceneProperties