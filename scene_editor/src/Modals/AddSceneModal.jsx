import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { useDispatch, useSelector } from 'react-redux';
import currentModalSlice from '../Redux/CurrentModalSlice.js';
import * as FileHelpers from '../util/FileHelpers.js';
import fileDataSlice, { getFile } from '../Redux/FileDataSlice.js';

const AddSceneModal = ({ dirHandle }) => {
    const dispatch = useDispatch();

    const [name, setName] = useState('MyScene');
    const [createNew, setCreateNew] = useState(true);

    const [folderPath, setFolderPath] = useState('scenes/');
    const [fileName, setFileName] = useState('scene.json');

    const [existingFilePath, setExistingFilePath] = useState(null);

    const gameFile = useSelector(getFile('game.json'));

    const [processing, setProcessing] = useState(false);

    const closeModal = () => {
        dispatch(currentModalSlice.actions.closeModal());
    };

    const onSubmit = async () => {
        setProcessing(true);

        let sceneFilePath;
        if (createNew) {
            const folder = folderPath.endsWith('/') ? folderPath : `${folderPath}/`;
            sceneFilePath = `${folder}${fileName.endsWith('.json') ? fileName : `${fileName}.json`}`;

            if (await FileHelpers.doesFileExist(dirHandle, sceneFilePath)) {
                alert('There is already a file with this folder/filename');
                setProcessing(false);
                return
            }

            await FileHelpers.writeFile(dirHandle, sceneFilePath, "{}", true);
        } else {
            sceneFilePath = existingFilePath;
        }

        dispatch(fileDataSlice.actions.modifyFileData({
            path: 'game.json',
            field: ['scenes', name],
            value: sceneFilePath
        }));

        await FileHelpers.loadFile(dirHandle, sceneFilePath, dispatch, { type: 'sceneJSON' })

        setProcessing(false);
        closeModal();
    };

    const selectExistingFile = async event => {
        event.preventDefault();
        event.stopPropagation();

        const fileHandle = await window.showOpenFilePicker({
            multiple: false,
            types: [
                {
                    description: 'Scene JSON files',
                    accept: {
                        "application/json": ['.json']
                    }
                }
            ]
        })

        const path = await dirHandle.resolve(fileHandle[0]);
        if (path === null) {
            alert('The selected file must exist somewhere within the project folder');
            return;
        }
        const scenePath = path.join('/');
        setExistingFilePath(scenePath);
    };

    const nameIsValid = name.trim().length > 0;

    const sceneNameTaken = name in (gameFile.data.scenes || {});

    let disableSubmit = false;
    if (createNew) {
        disableSubmit = !nameIsValid || sceneNameTaken;
    } else {
        disableSubmit = !existingFilePath;
    }

    if (processing) {
        disableSubmit = true;
    }

    return (
        <Modal
            title="Add Scene"
            onSubmit={onSubmit}
            footer={
                <>
                    <button type="button" onClick={closeModal} disabled={processing}>
                        Cancel
                    </button>

                    <button type="submit" onClick={onSubmit} disabled={disableSubmit}>
                        Add Scene
                    </button>
                </>
            }
        >
            {processing ? (
                <p>Processing...</p>
            ) : (
                <>
                    <div className='row'>
                        <label>
                            Scene name:
                        </label>
                        &nbsp;
                        <input type="text" value={name} onChange={event => setName(event.target.value)} />
                    </div>
                    {sceneNameTaken &&
                        <p style={{color: 'red'}}>
                            A scene with this name already exists in your game.json file.
                        </p>
                    }
                    <br />

                    <div className="row">
                        <input type="checkbox" checked={createNew} onClick={() => setCreateNew(true)} />&nbsp; Create a new scene file:
                    </div>
                    {createNew &&
                        <>
                            <div className='row'>
                                <label>
                                    Folder:
                                </label>
                                &nbsp;
                                <input type="text" value={folderPath} onChange={event => setFolderPath(event.target.value)} />
                            </div>
                            <div className='row'>
                                <label>
                                    File name:
                                </label>
                                &nbsp;
                                <input type="text" value={fileName} onChange={event => setFileName(event.target.value)} />
                            </div>
                        </>
                    }

                    <p>--- OR ---</p>

                    <div className="row">
                        <input type="checkbox" checked={!createNew} onClick={() => setCreateNew(false)} />&nbsp; Add an existing scene file to your game:
                    </div>

                    {!createNew &&
                        <>
                            <br />
                            <div className='row'>
                                <label>
                                    Scene JSON file:
                                </label>
                                &nbsp;
                                <input type="text" value={existingFilePath} disabled={true} />
                                &nbsp;
                                <button onClick={selectExistingFile}>
                                    Select file
                                </button>
                            </div>
                        </>
                    }
                </>
            )}
        </Modal>
    );
}

export default AddSceneModal;