import React from 'react';
import PropertyGroup from './PropertyGroup.jsx';
import { useDispatch } from 'react-redux';
import fileDataSlice from '../../Redux/FileDataSlice.js';
import PropertyList from './PropertyList.jsx';
import Property from './Property.jsx';
import ColorInput from './ColorInput.jsx';
import NumberInput from './NumberInput.jsx';
import Lights from './Lights.jsx';
import currentModalSlice from '../../Redux/CurrentModalSlice.js';
import SceneSounds from './SceneSounds.jsx';

const fogDefaults = {
    color: 0x000000,
    near: 1.0,
    far: 1000.0
};

const SceneProperties = ({ sceneName, filePath, sceneJSON }) => {
    const dispatch = useDispatch();

    const onSceneNameChange = event => {
        const newSceneName = event.target.value;
        if (newSceneName.length > 0) {
            dispatch(fileDataSlice.actions.renameScene({ sceneName, newSceneName }));
        }
    };

    const changeFog = (newFogSettings) => {
        dispatch(fileDataSlice.actions.modifyFileData({
            path: filePath,
            field: ['fog'],
            value: newFogSettings
        }));

        window.postMessage({
            eventName: 'modifyFogMainArea',
            scenePath: filePath,
            fog: newFogSettings
        });
    };

    const fog = sceneJSON.fog ? Object.assign({}, fogDefaults, sceneJSON.fog) : null;
    const lights = sceneJSON.lights || [];

    const onChangeLights = updatedLights => {
        dispatch(fileDataSlice.actions.modifyFileData({
            path: filePath,
            field: ['lights'],
            value: updatedLights
        }));

        window.postMessage({
            eventName: 'updateSceneLightsInMainArea',
            scenePath: filePath,
            updatedLights
        });
    };

    const onAddLight = () => {
        const params = {
            sceneName,
            scenePath: filePath,
            existingLights: lights
        };
        dispatch(currentModalSlice.actions.openModal({ type: 'AddLightModal', params }));
    };

    const onChangeSounds = updatedSounds => {
        dispatch(fileDataSlice.actions.modifyFileData({
            path: filePath,
            field: ['sounds'],
            value: updatedSounds
        }));

        window.postMessage({
            eventName: 'updateSceneSoundsInMainArea',
            scenePath: filePath,
            updatedSounds
        });
    };

    const addSound = () => {
        const params = {
            scenePath: filePath,
            existingSounds: sceneJSON.sounds || []
        };
        dispatch(currentModalSlice.actions.openModal({
            type: 'AddSoundModal',
            params
        }));
    };

    return (
        <PropertyList>
            <PropertyGroup label="Name:">
                <input type="text" value={sceneName} onChange={onSceneNameChange} />
            </PropertyGroup>  

            <PropertyGroup label="File:">
                <input type="text" defaultValue={filePath} readOnly disabled />
            </PropertyGroup>

            <Property label="Fog:">
                <PropertyList>
                    <div>
                        <input
                            type="checkbox"
                            checked={fog !== null}
                            onChange={() => changeFog(fog ? null : fogDefaults)}
                        />
                        &nbsp;
                        Use fog
                    </div>

                    {fog ? (
                        <>
                            <Property label="Color:">
                                <ColorInput
                                    value={fog.color}
                                    onChange={val => changeFog({ ...fog, color: val })}
                                />
                            </Property>

                            <Property label="Near:">
                                <NumberInput
                                    value={fog.near}
                                    onChange={val => changeFog({ ...fog, near: val })}
                                />
                            </Property>

                            <Property label="Far:">
                                <NumberInput
                                    value={fog.far}
                                    onChange={val => changeFog({ ...fog, far: val })}
                                />
                            </Property>
                        </>
                    ) : null}
                </PropertyList>
            </Property>

            <Lights
                lights={lights}
                onChange={onChangeLights}
                onAdd={onAddLight}
            />

            <SceneSounds
                sounds={sceneJSON.sounds || []}
                onChange={onChangeSounds}
                onAdd={addSound}
            />
        </PropertyList>
    );
};

export default SceneProperties