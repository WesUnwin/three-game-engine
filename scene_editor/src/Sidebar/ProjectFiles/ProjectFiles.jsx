import React, { useEffect, useState } from 'react';
import Panel from '../Panel.jsx';
import { useDispatch, useSelector } from 'react-redux';
import projectFilesSlice from '../../Redux/ProjectFilesSlice.js';
import * as FileHelpers from '../../util/FileHelpers.js'
import TreeView from '../Hierarchy/TreeView.jsx';
import { getSelectedItem, selectItem } from '../../Redux/SelectedItemSlice.js';

const ProjectFiles = ({ setDirHandle }) => {
    const dispatch = useDispatch();

    const projectFiles = useSelector(store => store.projectFiles);

    const [selectedProjectFilePath, setSelectedProjectFilePath] = useState(null);
    const selectedProjectFileData = useSelector(store => store.fileData.files.find(f => f.path === selectedProjectFilePath));

    const selectedItem = useSelector(getSelectedItem());

    useEffect(() => {
        if (selectedProjectFileData) {
            dispatch(selectItem(selectedProjectFileData.path, selectedProjectFileData.metaData.type));
        }
    }, [selectedProjectFileData]);

    useEffect(() => {
        // Update selectedProjectFilePath componenent state, to match newly selected hierarchy item if its associated with a file
        if (selectedItem && selectedItem.filePath && selectedItem.filePath !== selectedProjectFilePath) {
            setSelectedProjectFilePath(selectedItem.filePath)
        }
    }, [selectedItem])

    const openASceneFile = async () => {
        const directoryHandle = await window.showDirectoryPicker({
            mode: 'readwrite'
        });

        setDirHandle(directoryHandle)

        const fileInfo = await FileHelpers.openProjectFolder(directoryHandle);
        dispatch(projectFilesSlice.actions.setState(fileInfo));
    };

    const renderFileInfo = (fileInfo, initiallyExpanded = false, index = 0, path = '') => {   
        let filePath = path === '' ? fileInfo.name : `${path}${fileInfo.name}`;
        filePath = filePath.startsWith(projectFiles.name) ? filePath.slice(projectFiles.name.length, filePath.length) : filePath;
        filePath = filePath.startsWith('/') ? filePath.slice(1, filePath.length) : filePath;

        const onClick = () => {  
            setSelectedProjectFilePath(filePath);
        };

        return (
            <TreeView key={index} label={fileInfo.name} initiallyExpanded={initiallyExpanded} expandOnClick={fileInfo.kind === 'directory'} onClick={onClick} isSelected={filePath === selectedProjectFilePath}>
                {fileInfo.kind === 'file' ? (
                    null
                ) : fileInfo.files.length ? (
                    <>
                        {fileInfo.files.map((childFileInfo, i) => renderFileInfo(childFileInfo, false, i, path + fileInfo.name + '/'))}
                    </>
                ) : (
                    '(Empty folder)'
                )}
            </TreeView>
        );
    };

    return (
        <Panel label="Project Files">
            <div>
                <button>
                    New Project
                </button>

                <button onClick={openASceneFile}>
                    Open Scene...
                </button> 
            </div>

            {projectFiles.name && (
                <>
                    <p>Folder: </p>
                    {renderFileInfo(projectFiles, true)}
                </>
            )}   
        </Panel>
    );
};

export default ProjectFiles;