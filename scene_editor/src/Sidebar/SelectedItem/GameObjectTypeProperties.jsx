import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import fileDataSlice, { getFile } from '../../Redux/FileDataSlice.js';
import currentModalSlice from '../../Redux/CurrentModalSlice.js';
import * as FileHelpers from '../../util/FileHelpers.js'
import Components from './Components.jsx';

const GameObjectTypeProperties = ({ dirHandle, type }) => {
    const dispatch = useDispatch();

    const gameFile = useSelector(getFile('game.json'));

    const gameObjectTypeFilePath = gameFile?.data?.gameObjectTypes[type];
    const gameObjectTypeFile = useSelector(getFile(gameObjectTypeFilePath || null));

    useEffect(() => {
        FileHelpers.loadFile(dirHandle, gameObjectTypeFilePath, dispatch, { type: 'gameObjectTypeJSON' })
    }, [gameObjectTypeFilePath]);

    const changeProperty = (field, value) => {
        dispatch(fileDataSlice.actions.modifyFileData({
            path: gameObjectTypeFilePath,
            field,
            value
        }));

        window.postMessage({
            eventName: 'modifyGameObjectTypeInMainArea',
            gameObjectType: type
        });
    };

    // const onChangePhysics = rigidBodyData => {
    //     changeProperty(['rigidBody'], rigidBodyData);
    // };

    const addComponent = () => {

    };

    const removeComponent = () => {

    };

    if (!gameObjectTypeFile?.data) {
        return <div style={{ textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <Components
            componentsJSON={gameObjectTypeFile.data.components || []}
            addComponent={addComponent}
            removeComponent={removeComponent}
        />
    );
};

export default GameObjectTypeProperties