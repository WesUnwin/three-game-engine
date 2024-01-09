import React from 'react';
import PropertyGroup from './PropertyGroup.jsx';

const SceneProperties = ({ sceneName, filePath, sceneJSON }) => {
    return (
        <>
            <PropertyGroup label="Name:">
                <input type="text" value={sceneName} readOnly disabled />
            </PropertyGroup>  

            <PropertyGroup label="File:">
                <input type="text" value={filePath} readOnly disabled />
            </PropertyGroup>
        </>
    );
};

export default SceneProperties