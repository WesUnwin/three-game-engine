import React from 'react';
import NumberInput from './NumberInput.jsx';
import Slider from '../Slider.jsx';
import PropertyGroup from './PropertyGroup.jsx';
import { useDispatch } from 'react-redux';
import { modifyGameObject } from '../../Redux/FileDataSlice.js';
import Property from './Property.jsx';
import PropertyList from './PropertyList.jsx';
import GameObjectTypeProperties from './GameObjectTypeProperties.jsx';
import Divider from '../Divider.jsx';

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

    const changeProperty = (field, value) => {
        // Update the corresponding GameObject being rendered in the MainArea
        window.postMessage({
            eventName: 'modifyGameObjectInMainArea',
            scenePath: filePath,
            indices,
            field,
            value
        });

        dispatch(modifyGameObject(filePath, indices, field, value));
    };

    return (
        <>
            <PropertyList>
                <Property label="Name:">
                    <input
                        type="text"
                        value={gameObjectJSON.name || ''}
                        onChange={event => changeProperty(['name'], event.target.value)}
                    />
                </Property>

                {gameObjectJSON.type ? (
                    <Property label="Type:">
                        {gameObjectJSON.type}
                    </Property>
                ) : null}

                <PropertyGroup label="Position:">
                    <Property label="x:">
                        <NumberInput value={position.x} onChange={val => changeProperty(['position', 'x'], val)} />
                    </Property>
                    <Property label="y:">
                        <NumberInput value={position.y} onChange={val => changeProperty(['position', 'y'], val)} />
                    </Property>
                    <Property label="z:">
                        <NumberInput value={position.z} onChange={val => changeProperty(['position', 'z'], val)} />
                    </Property>
                </PropertyGroup>
                
                <PropertyGroup label="Scale:">
                    <Property label="x:">
                        <NumberInput value={scale.x} onChange={val => changeProperty(['scale', 'x'], val)} />
                    </Property>
                    <Property label="y:">
                        <NumberInput value={scale.y} onChange={val => changeProperty(['scale', 'y'], val)} />
                    </Property>
                    <Property label="z:">
                        <NumberInput value={scale.z} onChange={val => changeProperty(['scale', 'z'], val)} />
                    </Property>
                </PropertyGroup>

                <PropertyGroup label="Rotation:" inColumn={true}>
                    <Property label="x:">
                        <NumberInput
                            value={rotation.x}
                            onChange={val => changeProperty(['rotation', 'x'], val)}
                        />
                        <Slider
                            value={rotation.x}
                            onChange={val => changeProperty(['rotation', 'x'], val)}
                            max={Math.PI * 2.0}
                        />
                    </Property>
                    <Property label="y:">
                        <NumberInput
                            value={rotation.y}
                            onChange={val => changeProperty(['rotation', 'y'], val)}
                        />
                        <Slider
                            value={rotation.y}
                            onChange={val => changeProperty(['rotation', 'y'], val)}
                            max={Math.PI * 2.0}
                        />
                    </Property>
                    <Property label="z:">
                        <NumberInput
                            value={rotation.z}
                            onChange={val => changeProperty(['rotation', 'z'], val)}
                        />
                        <Slider
                            value={rotation.z}
                            onChange={val => changeProperty(['rotation', 'z'], val)}
                            max={Math.PI * 2.0}
                        />
                    </Property>
                </PropertyGroup>
            </PropertyList>

            {gameObjectJSON.type ? (
                <>
                    <Divider
                        label={`Inherited from type: ${gameObjectJSON.type }`}
                    />

                    <GameObjectTypeProperties
                        type={gameObjectJSON.type}
                    />
                </>
            ) : null}
        </>
    );
};

export default GameObjectProperties