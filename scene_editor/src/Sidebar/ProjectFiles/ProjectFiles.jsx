import React, { useEffect, useState } from 'react';
import Panel from '../Panel.jsx';
import { useDispatch, useSelector } from 'react-redux';
import projectFilesSlice from '../../Redux/ProjectFilesSlice.js';
import * as FileHelpers from '../../util/FileHelpers.js'
import TreeView from '../Hierarchy/TreeView.jsx';
import { getSelectedItem } from '../../Redux/SelectedItemSlice.js';
import currentModalSlice from '../../Redux/CurrentModalSlice.js';

const ProjectFiles = ({ setDirHandle }) => {
    const dispatch = useDispatch();

    const projectFiles = useSelector(store => store.projectFiles);

    const [selectedProjectFilePath, setSelectedProjectFilePath] = useState(null);
    const selectedItem = useSelector(getSelectedItem());

    useEffect(() => {
        // Update selectedProjectFilePath componenent state, to match newly selected hierarchy item if its associated with a file
        if (selectedItem && selectedItem.filePath && selectedItem.filePath !== selectedProjectFilePath) {
            setSelectedProjectFilePath(selectedItem.filePath)
        }
    }, [selectedItem])

    const createNewProject = () => {
        dispatch(currentModalSlice.actions.openModal({
            type: 'CreateProjectModal'
        }));
    };

    const selectProjectFolder = async () => {
        const directoryHandle = await window.showDirectoryPicker({
            mode: 'readwrite'
        }).catch(error => {
            if (error.name === 'AbortError') {
                console.log('User abored window.showDirectoryPicker()');
            } else {
                alert('Error occured while trying to pick a foler: ', error.message);
            }
            return null;
        });
    
        if (directoryHandle) {
            setDirHandle(directoryHandle);

            const fileInfo = await FileHelpers.openProjectFolder(directoryHandle);
            dispatch(projectFilesSlice.actions.setState(fileInfo));
        }
    };

    const openSettingsModal = () => {
        dispatch(currentModalSlice.actions.openModal({ type: 'SettingsModal' }));
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
        <Panel
            className="project-files-panel"
            label="Project Files:"
            actions={[
                { label: 'New Project', onClick: createNewProject },
                { label: 'Open Project', onClick: selectProjectFolder },
                { label: 'Settings', onClick: openSettingsModal }              
            ]}
        >
            {projectFiles.name ? (
                <>
                    {renderFileInfo(projectFiles)}
                </>
            ) : (
                <p style={{ textAlign: 'center' }}>
                    (No project folder selected)
                </p>
            )}   
        </Panel>
    );
};

export default ProjectFiles;