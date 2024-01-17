import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { useDispatch } from 'react-redux';
import currentModalSlice from '../Redux/CurrentModalSlice.js';
import projectFilesSlice from '../Redux/ProjectFilesSlice.js';
import * as FileHelpers from '../util/FileHelpers.js';
import copyNewProjectFiles from '../util/CopyNewProjectFiles.js';
import selectedItemSlice from '../Redux/SelectedItemSlice.js';
import fileDataSlice from '../Redux/FileDataSlice.js';

const CreateProjectModal = ({ setDirHandle }) => {
    const dispatch = useDispatch();

    const [projectFolderDirHandle, setProjectFolderDirHandle] = useState(null);
  
    const [includeElectronFiles, setIncludeElectronFiles] = useState(true);
    const [includeCordovaFiles, setIncludeCordovaFiles] = useState(true);
  
    const [creating, setCreating] = useState(false);

    const closeModal = () => {
        dispatch(currentModalSlice.actions.closeModal());
    };

    const selectProjectFolder = async event => {
      event.preventDefault();
      event.stopPropagation();
  
      const handle = await window.showDirectoryPicker({
          mode: 'readwrite'
      }).catch(error => {
          if (error.name === 'AbortError') {
              return; // User cancelled
          } else {
              alert('Error occured while trying to pick a folder to create the project in: ', error.message);
          }
          return null;
      });
  
      setProjectFolderDirHandle(handle);
    };
  
    const onSubmit = async () => {
        setCreating(true);
  
        // Copy all files in scene_editor/NewProjectFiles to the folder the user chose
        //await copyNewProjectFiles(projectFolderDirHandle);
        await copyNewProjectFiles(projectFolderDirHandle);

        dispatch(selectedItemSlice.actions.unSelectItem());
        dispatch(projectFilesSlice.actions.clear());
        dispatch(fileDataSlice.actions.clear());

        // Open the created project folder
        const fileInfo = await FileHelpers.openProjectFolder(projectFolderDirHandle);
        dispatch(projectFilesSlice.actions.setState(fileInfo));

        setDirHandle(projectFolderDirHandle);

        closeModal();
    };

    return (
        <Modal
            title="Create a New Project"
            onSubmit={onSubmit}
            footer={
                <>
                    <button type="button" onClick={closeModal} disabled={creating}>
                        Cancel
                    </button>

                    <button type="submit" onClick={onSubmit} disabled={!projectFolderDirHandle || creating}>
                        Create
                    </button>
                </>
            }
        >
          {creating ? (
            <>
              <h5>Creating project files...</h5>
            </>
          ) : (
            <>
              <p>
                This will create a new project in a folder of your choosing, including creating a game.json file, and other initial files to help you get started.
              </p>

              <div className='row'>
                  <input
                    type="text"
                    value={projectFolderDirHandle?.name}
                    readOnly
                    disabled
                  />
                  &nbsp;
                  <button onClick={selectProjectFolder}>
                    Choose folder
                  </button>
              </div>
{/* 
              <div className="row">
                  <input
                    type="checkbox"
                    checked={includeElectronFiles}
                    onClick={() => setIncludeElectronFiles(!includeElectronFiles)}
                  />
                  &nbsp;
                  <p>
                    Include Electron files <br />
                    <small>(for building desktop apps)</small>
                  </p>
              </div>

              <div className="row">
                  <input
                    type="checkbox"
                    checked={includeCordovaFiles}
                    onClick={() => setIncludeCordovaFiles(!includeCordovaFiles)}
                  />
                  &nbsp;
                  <p>
                    Include cordova files <br />
                    <small>(for building mobile apps)</small>
                  </p>                 
              </div>
*/}
            </>
          )}
        </Modal>
    );
}

export default CreateProjectModal;