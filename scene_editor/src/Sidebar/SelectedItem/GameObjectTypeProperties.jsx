import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFile } from '../../Redux/FileDataSlice.js';
import Models from './Models.jsx';
import Lights from './Lights.jsx';
import Physics from './Physics.jsx';

const GameObjectTypeProperties = ({ type }) => {
    const dispatch = useDispatch();

    const gameFile = useSelector(getFile('game.json'));

    const gameObjectTypeFilePath = gameFile?.data?.gameObjectTypes[type];

    const gameObjectTypeFile = useSelector(getFile(gameObjectTypeFilePath || null));

    const changeProperty = (field, newValue) => {

    };

    if (!gameObjectTypeFile) {
        return null;
    }

    return (
        <>    
            <Models models={gameObjectTypeFile.data.models || []} />
            <Lights lights={gameObjectTypeFile.data.lights || []} />
            <Physics rigidBody={gameObjectTypeFile.data.rigidBody} />
        </>
    );
};

export default GameObjectTypeProperties