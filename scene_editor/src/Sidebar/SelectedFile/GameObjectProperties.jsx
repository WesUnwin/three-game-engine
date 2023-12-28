import React from 'react';
import NumberInput from './NumberInput.jsx';
import PropertyGroup from './PropertyGroup.jsx';
import { useDispatch } from 'react-redux';
import { updateGameObject } from '../../Redux/FileDataSlice.js';

const GameObjectProperties = ({ filePath, sceneJSON, indices }) => {
    const dispatch = useDispatch();

    const getGameObjectJSON = (parent, gameObjectIndices) => {
        const childGameObject = parent.gameObjects[gameObjectIndices[0]];
        if (gameObjectIndices.length === 1) {
            return childGameObject;
        } else {
            return getGameObjectJSON(childGameObject, indices.slice(1, indices.length));
        }
    };

    const gameObjectJSON = getGameObjectJSON(sceneJSON, indices);

    const position = gameObjectJSON?.position || { x: 0, y: 0, z: 0};
    const scale = gameObjectJSON?.scale || { x: 1, y: 1, z: 1};
    const rotation = gameObjectJSON?.rotation || { x: 0, y: 0, z: 0};

    const changeProperty = (field, newValue) => {
        dispatch(updateGameObject(filePath, indices, field, newValue));
    };

    return (
        <>    
            <PropertyGroup label="Position:">
                <NumberInput label="x:" value={position.x} onChange={val => changeProperty(['position', 'x'], val)} />
                <NumberInput label="y:" value={position.y} onChange={val => changeProperty(['position', 'y'], val)} />
                <NumberInput label="z:" value={position.z} onChange={val => changeProperty(['position', 'z'], val)} />
            </PropertyGroup>
            
            <PropertyGroup label="Scale:">
                <NumberInput label="x:" value={scale.x} onChange={val => changeProperty(['scale', 'x'], val)} />
                <NumberInput label="y:" value={scale.y} onChange={val => changeProperty(['scale', 'y'], val)} />
                <NumberInput label="z:" value={scale.z} onChange={val => changeProperty(['scale', 'z'], val)} />
            </PropertyGroup>

            <PropertyGroup label="Rotation:">
                <NumberInput label="x:" value={rotation.x} onChange={val => changeProperty(['rotation', 'x'], val)} />
                <NumberInput label="y:" value={rotation.y} onChange={val => changeProperty(['rotation', 'y'], val)} />
                <NumberInput label="z:" value={rotation.z} onChange={val => changeProperty(['rotation', 'z'], val)} />
            </PropertyGroup>
        </>
    );
};

export default GameObjectProperties