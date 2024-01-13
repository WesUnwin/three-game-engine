import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import fileDataSlice, { getFile } from '../../Redux/FileDataSlice.js';
import Models from './Models.jsx';
import Lights from './Lights.jsx';
import Physics from './Physics.jsx';

const GameObjectTypeProperties = ({ type }) => {
    const dispatch = useDispatch();

    const gameFile = useSelector(getFile('game.json'));

    const gameObjectTypeFilePath = gameFile?.data?.gameObjectTypes[type];

    const gameObjectTypeFile = useSelector(getFile(gameObjectTypeFilePath || null));

    const changeProperty = (field, value) => {
        dispatch(fileDataSlice.actions.modifyFileData({
            path: gameObjectTypeFilePath,
            field,
            value
        }));
    };

    if (!gameObjectTypeFile?.data) {
        return null;
    }

    return (
        <>    
            <Models
                gameObjectType={type}
                models={gameObjectTypeFile.data.models || []}
                changeProperty={changeProperty}
            />
            <Lights
                lights={gameObjectTypeFile.data.lights || []}
                changeProperty={changeProperty}
                gameObjectType={type}
            />
            <Physics
                rigidBody={gameObjectTypeFile.data.rigidBody}
                changeProperty={changeProperty}
            />
        </>
    );
};

export default GameObjectTypeProperties