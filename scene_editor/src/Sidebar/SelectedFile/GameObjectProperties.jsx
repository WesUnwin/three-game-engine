import React from 'react';

const GameObjectProperties = ({ sceneJSON, indices }) => {
    const getGameObjectJSON = (parent, gameObjectIndices) => {
        const childGameObject = parent.gameObjects[gameObjectIndices[0]];
        if (gameObjectIndices.length === 1) {
            return childGameObject;
        } else {
            return getGameObjectJSON(childGameObject, indices.slice(1, indices.length));
        }
    };

    const gameObjectJSON = getGameObjectJSON(sceneJSON, indices);

    return (
        <>
            <label>
                Name: {gameObjectJSON.name || ''}
            </label>        
        </>
    );
};

export default GameObjectProperties