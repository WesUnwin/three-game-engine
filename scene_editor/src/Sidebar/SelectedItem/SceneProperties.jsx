import React from 'react';

const SceneProperties = ({ sceneJSON }) => {
    return (
        <>
            <label>
                Name: {sceneJSON.name || ''}
            </label>        
        </>
    );
};

export default SceneProperties