import React, { useState } from 'react';
import Panel from '../Panel.jsx';
import { useSelector } from 'react-redux';
import GameItem from './GameItem.jsx';

const Hierarchy = ({ dirHandle }) => {
    const projectFiles = useSelector(store => store.projectFiles);

    if (!projectFiles?.files) {
        return null;
    }

    const gameFileInfo = projectFiles.files.find(f => f.name.toLowerCase() === 'game.json');

    return (
        <Panel label="Hierarchy">
            {gameFileInfo ? (
                <GameItem gameFileInfo={gameFileInfo} dirHandle={dirHandle} />
            ) : (
                '(no game.json file in project folder)'
            )}            
        </Panel>
    );
};

export default Hierarchy;