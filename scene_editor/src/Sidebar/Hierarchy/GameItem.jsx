import React, { useEffect } from 'react';
import TreeView from "./TreeView.jsx";
import * as FileHelpers from '../../util/FileHelpers.js'
import SceneItem from './SceneItem.jsx';
import { getFile } from '../../Redux/FileDataSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedItem, selectItem } from '../../Redux/SelectedItemSlice.js';

const GameItem = ({ gameFileInfo, dirHandle }) => {
    const dispatch = useDispatch();

    const gameFileData = useSelector(getFile('game.json'));

    const selectedItem = useSelector(getSelectedItem())
    const isSelected = selectedItem?.type === 'gameJSON';

    useEffect(() => {
        FileHelpers.loadFile(dirHandle, 'game.json', dispatch, { type: 'gameJSON' });
    }, [gameFileInfo]);

    const scenes = gameFileData?.data ? gameFileData.data.scenes : {};

    const errorMessage = gameFileData?.error?.message;

    const onClick = () => {
        dispatch(selectItem('game.json', 'gameJSON'));
    };

    return (
        <TreeView label={'game.json'} errorMessage={errorMessage} initiallyExpanded={true} onClick={onClick} isSelected={isSelected}>
            {gameFileData?.data ? (
                <>
                    {Object.entries(scenes).map((sceneEntry, i) => (
                        <SceneItem key={i} dirHandle={dirHandle} sceneName={sceneEntry[0]} scenePath={sceneEntry[1]} />
                    ))}
                </>
            ) : gameFileData?.error ? (
                'Reading...'
            ) : null}
        </TreeView>
    );
};

export default GameItem;