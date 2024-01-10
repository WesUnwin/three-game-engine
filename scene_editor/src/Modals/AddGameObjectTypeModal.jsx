import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { useDispatch, useSelector } from 'react-redux';
import fileDataSlice, { getFile } from '../Redux/FileDataSlice.js';
import currentModalSlice from '../Redux/CurrentModalSlice.js';
import * as FileHelpers from '../util/FileHelpers.js';

const AddGameObjectTypeModal = ({ dirHandle }) => {
    const dispatch = useDispatch();

    const [type, setType] = useState('');
    const [createNew, setCreateNew] = useState(true);

    const [folderPath, setFolderPath] = useState('game-object-types/');
    const [fileName, setFileName] = useState('myGameObjectType.json');

    const [existingFilePath, setExistingFilePath] = useState(null);

    const [processing, setProcessing] = useState(false);

    const gameFile = useSelector(getFile('game.json'));

    const closeModal = () => {
        dispatch(currentModalSlice.actions.closeModal());
    };

    const selectExistingFile = async event => {
        event.preventDefault();
        event.stopPropagation();

        const fileHandle = await window.showOpenFilePicker({
            multiple: false,
            types: [
                {
                    description: 'GameObject Type JSON files',
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
        const gameObjectTypeFilePath = path.join('/');
        setExistingFilePath(gameObjectTypeFilePath);
    };

    const onSubmit = async () => {
        setProcessing(true);

        let filePath;
        if (createNew) {
            const folder = folderPath.endsWith('/') ? folderPath : `${folderPath}/`;
            filePath = `${folder}${fileName.endsWith('.json') ? fileName : `${fileName}.json`}`;

            if (await FileHelpers.doesFileExist(dirHandle, filePath)) {
                alert('There is already a file with this folder/filename');
                setProcessing(false);
                return
            }

            await FileHelpers.writeFile(dirHandle, filePath, "{}", true);
        } else {
            filePath = existingFilePath;
        }

        dispatch(fileDataSlice.actions.modifyFileData({
            path: 'game.json',
            field: ['gameObjectTypes', type],
            value: filePath
        }));

        await FileHelpers.loadFile(dirHandle, filePath, dispatch,  { type: 'gameObjectTypeJSON' });

        setProcessing(false);
        closeModal();
    };

    const typeIsValid = type.trim().length > 0;

    const typeIsTaken = type in (gameFile.data.gameObjectTypes || {});

    let disableSubmit = false;
    if (createNew) {
        disableSubmit = !typeIsValid || typeIsTaken;
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
                        Add GameObject Type
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
                            Type:
                        </label>
                        &nbsp;
                        <input type="text" value={type} onChange={event => setType(event.target.value)} />
                    </div>
                    {typeIsTaken &&
                        <p style={{color: 'red'}}>
                            A GameObject type with this name already exists in your game.json file.
                        </p>
                    }
                    <br />

                    <div className="row">
                        <input type="checkbox" checked={createNew} onClick={() => setCreateNew(true)} />&nbsp; Create a new GameObject Type file:
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
                        <input type="checkbox" checked={!createNew} onClick={() => setCreateNew(false)} />&nbsp; Add an GameObject type file to your game:
                    </div>

                    {!createNew &&
                        <>
                            <br />
                            <div className='row'>
                                <label>
                                    GameObject Type JSON file:
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

export default AddGameObjectTypeModal;