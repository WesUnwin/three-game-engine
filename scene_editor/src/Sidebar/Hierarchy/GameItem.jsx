import React, { useEffect } from 'react';
import TreeView from "./TreeView.jsx";
import * as FileHelpers from '../../util/FileHelpers.js'
import SceneItem from './SceneItem.jsx';
import { getFile } from '../../Redux/FileDataSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedItem, selectItem } from '../../Redux/SelectedItemSlice.js';
import GameObjectTypeItem from './GameObjectTypeItem.jsx';
import { FaPlus } from 'react-icons/fa';
import currentModalSlice from '../../Redux/CurrentModalSlice.js';

const GameItem = ({ gameFileInfo, dirHandle }) => {
    const dispatch = useDispatch();

    const gameFileData = useSelector(getFile('game.json'));

    const selectedItem = useSelector(getSelectedItem())
    const isSelected = selectedItem?.type === 'gameJSON';

    useEffect(() => {
        FileHelpers.loadFile(dirHandle, 'game.json', dispatch, { type: 'gameJSON' });
    }, [gameFileInfo]);

    const scenes = gameFileData?.data ? gameFileData.data.scenes : {};
    const gameObjectTypes = gameFileData?.data ? gameFileData.data.gameObjectTypes : {};

    const errorMessage = gameFileData?.error?.message;

    const onClick = () => {
        dispatch(selectItem('game.json', 'gameJSON'));
    };

    const addScene = () => {
        dispatch(currentModalSlice.actions.openModal({ type: 'AddSceneModal' }));
    };

    const addGameObjectType = () => {
        dispatch(currentModalSlice.actions.openModal({ type: 'AddGameObjectTypeModal' }));
    };

    return (
        <TreeView label={<strong>game.json</strong>} errorMessage={errorMessage} initiallyExpanded={true} onClick={onClick} isSelected={isSelected}>
            
            {gameFileData?.data ? (
                <>
                    <TreeView
                        label="Scenes:"
                        expandOnClick={true}
                        initiallyExpanded={true}
                        actions={[
                            { icon: <FaPlus />, onClick: addScene }
                        ]}
                    >
                        {Object.keys(scenes).length === 0 ? (
                            '(no scenes)'
                        ) : (
                            Object.entries(scenes).map((sceneEntry, i) => (
                                <SceneItem
                                    key={i}
                                    dirHandle={dirHandle}
                                    sceneName={sceneEntry[0]}
                                    scenePath={sceneEntry[1]}
                                />
                            ))
                        )}
                    </TreeView>

                    <TreeView
                        label="GameObject Types:"
                        expandOnClick={true}
                        actions={[
                            { icon: <FaPlus />, onClick: addGameObjectType }
                        ]}
                    >
                        {Object.keys(gameObjectTypes).length === 0 ? (
                            '(no game object types)'
                        ) : (
                            Object.entries(gameObjectTypes).map((gameObjectTypeEntry, i) => (
                                <GameObjectTypeItem key={i} gameObjectType={gameObjectTypeEntry[0]} />
                            ))
                        )}
                    </TreeView>
                </>
            ) : gameFileData?.error ? (
                'Reading...'
            ) : null}
        </TreeView>
    );
};

export default GameItem;